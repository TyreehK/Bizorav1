import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Bizora",
  description: "Boekhouden slim en simpel."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
