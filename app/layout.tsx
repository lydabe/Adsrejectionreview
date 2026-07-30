import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Rejection Insights",
  description:
    "Drill from campaigns to rejected ads, appeal a decision, or review AI-generated video fixes.",
  metadataBase: new URL("https://creative-policy-check.lydabe.chatgpt.site"),
  openGraph: {
    title: "Ad Rejection Insights",
    description: "From rejection reason to a fix you can review.",
    images: [{ url: "/og-ai-remediation.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ad Rejection Insights",
    description: "From rejection reason to a fix you can review.",
    images: ["/og-ai-remediation.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
