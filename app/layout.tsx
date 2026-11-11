import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Doctor Tracker", template: "%s · Doctor Tracker" },
  description: "Admin portal for managing doctors, their patients, and care analytics.",
};

export const viewport: Viewport = { themeColor: "#2563eb" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before hydration. */}
      <body className="min-h-full bg-slate-50 font-sans text-slate-900" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
