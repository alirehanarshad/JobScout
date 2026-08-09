import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { inter, instrumentSerif, instrumentSerifItalic } from "@/lib/fonts";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobScout — AI-Powered Job Search Command Center",
  description: "Your intelligent job search pipeline. Discover, evaluate, and track opportunities across 50+ portals with AI-powered insights.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "JobScout" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0c0e14",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('jobscout:theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content',d?'#0c0e14':'#f8f9fb');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${instrumentSerifItalic.variable}`}
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
