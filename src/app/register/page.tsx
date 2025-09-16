import Link from "next/link";
import type { Route } from "next";

export const metadata = {
  title: "Registreren — Bizora",
  description: "Maak je Bizora-account aan en start je 30 dagen proefperiode.",
};

export default function RegisterPage() {
  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href={"/" as Route}>
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href={"/#features" as Route}>Product</a>
            <a href={"/#solutions" as Route}>Oplossingen</a>
            <a href={"/pricing" as Route}>Prijzen</a>
            <a href={"/knowledge-base" as Route}>Kennisbank</a>
            <a href={"/contact" as Route}>Contact</a>
          </nav>
          <div className="nav__cta">
            <a className="btn btn--ghost" href={"/login" as Route}>Inloggen</a>
            <a className="btn btn--primary" href={"/register" as Route}>Start gratis</a>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main>
        <section className="hero">
          <div className="container" style={{ maxWidth: 760 }}>
            <h1 className="hero__title">Registreren</h1>
            <p className="hero__subtitle">
              Je account en organisatie zijn aangemaakt. Je kunt nu inloggen.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Link href={"/login" as Route} className="btn btn--primary">Naar login</Link>
              <Link href={"/" as Route} className="btn btn--ghost">Terug naar home</Link>
            </div>
          </div>
        </section>

        {/* Extra info / tips */}
        <section className="section section--alt">
          <div className="container">
            <h2 className="h2">Wat kun je hierna doen?</h2>
            <div className="grid grid--3">
              <div className="card feature">
                <div className="feature__icon">🏷️</div>
                <h3>Subdomein kiezen</h3>
                <p>Kies een herkenbare sitenaam voor je workspace (bv. jouwbedrijf).</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">🎨</div>
                <h3>Branding instellen</h3>
                <p>Upload je logo en kies een accentkleur voor offertes en facturen.</p>
              </div>
              <div className="card feature">
                <div className="feature__icon">🧾</div>
                <h3>Eerste factuur sturen</h3>
                <p>Maak in 2 minuten je eerste factuur en stuur deze direct per e-mail.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="brand__logo brand__logo--sm">B</div>
            <div className="brand__name">BIZORA</div>
            <p className="muted">© Bizora, alle rechten voorbehouden.</p>
          </div>
          <div>
            <div className="foot__title">Product</div>
            <a href="#">Facturen</a><a href="#">Offertes</a><a href="#">Uitgaven</a><a href="#">Rapportages</a>
          </div>
          <div>
            <div className="foot__title">Resources</div>
            <a href={"/knowledge-base" as Route}>Kennisbank</a>
            <a href={"/faq" as Route}>FAQ</a>
            <a href="#">Status</a>
            <a href={"/contact" as Route}>Contact</a>
          </div>
          <div>
            <div className="foot__title">Juridisch</div>
            <a href="#">Privacy</a><a href="#">Voorwaarden</a><a href="#">Verwerkersovereenkomst</a>
          </div>
        </div>
      </footer>
    </>
  );
}
