import type { Metadata } from "next";
import "./globals.css";
import { ShellClient } from "@/components/layout/ShellClient";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: { default: "DevKit Pro", template: "%s · DevKit Pro" },
  description:
    "12 beautiful developer utilities in one app — JSON formatter, regex tester, color converter, CSS gradients, hash generator and more. Zero installs, 100% offline.",
  keywords: ["developer tools", "devkit", "json formatter", "regex tester", "base64", "hash generator", "open source"],
  openGraph: {
    title: "DevKit Pro",
    description: "All-in-one developer toolkit. Beautiful, offline-first, open source.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ToastProvider>
          <ShellClient>
            {children}
          </ShellClient>
        </ToastProvider>
      </body>
    </html>
  );
}
