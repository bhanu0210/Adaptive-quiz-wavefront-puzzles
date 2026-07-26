import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://puzzles.wavefrontdaily.in"),
  title: "Wavefront Puzzles | Adaptive reasoning challenges",
  description:
    "Adaptive, independently verified puzzles for sharper everyday thinking.",
  openGraph: {
    title: "Wavefront Puzzles",
    description: "Think in better patterns.",
    type: "website",
    url: "https://puzzles.wavefrontdaily.in",
    images: [
      {
        url: "https://puzzles.wavefrontdaily.in/og.png",
        width: 1730,
        height: 909,
        alt: "Wavefront Puzzles connected reasoning paths",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wavefront Puzzles",
    description: "Think in better patterns.",
    images: ["https://puzzles.wavefrontdaily.in/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
