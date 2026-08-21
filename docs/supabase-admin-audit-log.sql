-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-admin-check-consolidation.sql has already been run (this
-- file uses public.is_admin() from that migration).
--
-- ============================================================
-- WHAT THIS ADDS
-- ============================================================
-- puzzle_reward_grants logs every reward grant ever made, but admin
-- actions on everything else -- editing or deleting a puzzle in the
-- catalog, approving/rejecting a community post or a submitted puzzle,
-- deleting someone's comment or feedback -- leave no trace of who did it
-- or when. If content is ever wrongly deleted or edited, there's currently
-- no way to know who did it or revert it.
--
-- This adds a single audit-log table plus a reusable trigger, attached to
-- every table an admin can write to. The trigger fires on every actual
-- INSERT/UPDATE/DELETE against those tables (client-driven or otherwise),
-- but only records it when the row was written by the admin identity
-- (public.is_admin()) -- a regular user deleting their own comment, or
-- inserting their own feedback/post/submission, is not an admin action and
-- is not logged. This is deliberately trigger-based rather than routed
-- through a new RPC: it requires no app code changes, and it can't be
-- silently bypassed by a future admin write path that forgets to call a
-- logging function, since it fires on the table itself.

create table if not exists public.puzzle_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  admin_email text,
  action text not null,
  target_table text not null,
  target_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.puzzle_admin_audit_log enable row level security;

-- Only the admin can ever read this -- it's a record of admin actions, not
-- user-facing data. Writes only ever happen via the trigger function
-- below, which runs SECURITY DEFINER regardless of table grants.
drop policy if exists "admin can read the audit log" on public.puzzle_admin_audit_log;
create policy "admin can read the audit log"
  on public.puzzle_admin_audit_log
  for select
  using (public.is_admin());

grant select on public.puzzle_admin_audit_log to authenticated;

create or replace function public._log_admin_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_target_id text;
begin
  if public.is_admin() then
    v_target_id := (case when TG_OP = 'DELETE' then old.id else new.id end)::text;

    insert into public.puzzle_admin_audit_log
      (admin_user_id, admin_email, action, target_table, target_id, old_data, new_data)
    values (
      auth.uid(),
      auth.jwt() ->> 'email',
      TG_OP,
      TG_TABLE_NAME,
      v_target_id,
      case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
      case when TG_OP in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
    );
  end if;
  return coalesce(new, old);
end;
$$;

-- puzzle_catalog: admin edits/creates/deletes puzzle content directly
-- (see the Admin tab's puzzle editor in app/WavefrontApp.tsx).
drop trigger if exists log_admin_write on public.puzzle_catalog;
create trigger log_admin_write
  after insert or update or delete on public.puzzle_catalog
  for each row execute function public._log_admin_write();

-- puzzle_community_posts: admin approves/rejects/deletes a post. Insert is
-- deliberately not covered -- posts are user-authored, not an admin action.
drop trigger if exists log_admin_write on public.puzzle_community_posts;
create trigger log_admin_write
  after update or delete on public.puzzle_community_posts
  for each row execute function public._log_admin_write();

-- puzzle_cycle_submissions: admin approves/rejects/deletes a submitted
-- puzzle. Same reasoning -- insert is the submitter's own action.
drop trigger if exists log_admin_write on public.puzzle_cycle_submissions;
create trigger log_admin_write
  after update or delete on public.puzzle_cycle_submissions
  for each row execute function public._log_admin_write();

-- puzzle_feedback: admin deletes feedback (the only admin-only action on
-- this table -- see docs/supabase-admin-check-consolidation.sql).
drop trigger if exists log_admin_write on public.puzzle_feedback;
create trigger log_admin_write
  after delete on public.puzzle_feedback
  for each row execute function public._log_admin_write();

-- puzzle_community_comments: covers the admin side of "author or admin can
-- delete a comment" -- an author deleting their own comment is not logged
-- (is_admin() is false for them), only an admin-performed delete is.
drop trigger if exists log_admin_write on public.puzzle_community_comments;
create trigger log_admin_write
  after delete on public.puzzle_community_comments
  for each row execute function public._log_admin_write();
