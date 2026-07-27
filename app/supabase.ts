import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These values are intentionally public browser configuration. The secret and
// service-role keys remain only in Supabase Edge Function environment settings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vkskeiafwbabsobjgmzd.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_4d51VmkiYTDIf4cePzOsgA_1_kvJzG1";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;
