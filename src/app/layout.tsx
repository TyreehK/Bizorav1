import "@/styles/index.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bizora — Moderne administratie zonder gedoe",
  description:
    "Facturen, offertes, btw en rapportages in één overzichtelijk platform voor ondernemers.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {/* Sticky, lichte navbar bovenaan */}
        <header className="navbar">
          <div className="container">
            <Navbar />
          </div>
        </header>

        {/* Spacer is niet nodig omdat .navbar sticky is met eigen hoogte */}

        <main>{children}</main>

        <footer className="footer">
          <div className="container">
            <Footer />
          </div>
        </footer>
      </body>
    </html>
  );
}
