import Link from "next/link";
import type { Route } from "next";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact — Bizora",
  description:
    "Neem contact op met Bizora. We helpen je graag met vragen over product, prijzen of onboarding.",
};

export default function ContactPage() {
  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <Link className="brand" href={"/" as Route}>
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </Link>
          <nav className="nav__links">
            <Link href={{ pathname: "/" as Route, hash: "features" }}>Product</Link>
            <Link href={{ pathname: "/" as Route, hash: "solutions" }}>Oplossingen</Link>
            <Link href={"/pricing" as Route}>Prijzen</Link>
            <Link className="nav-active" href={"/contact" as Route}>
              Contact
            </Link>
          </nav>
          <div className="nav__cta">
            <Link className="btn btn--ghost" href={"/login" as Route}>
              Inloggen
            </Link>
            <Link className="btn btn--primary" href={"/register" as Route}>
              Start gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="hero">
          <div className="container">
            <h1 className="hero__title">Contact met Bizora</h1>
            <p className="hero__subtitle">
              Stel je vraag. Ons team reageert doorgaans binnen één werkdag.
            </p>
          </div>
        </section>

        {/* 2. Contactkaarten */}
        <section className="section">
          <div className="container grid grid--3">
            <div className="card feature">
              <div className="feature__icon">💬</div>
              <h3>Support</h3>
              <p>Vragen over de app, onboarding of features.</p>
              <a className="btn btn--link" href="#form">Stuur bericht</a>
            </div>
            <div className="card feature">
              <div className="feature__icon">💼</div>
              <h3>Sales</h3>
              <p>Wil je een demo of Enterprise opties bespreken?</p>
              <a className="btn btn--link" href="#form">Plan gesprek</a>
            </div>
            <div className="card feature">
              <div className="feature__icon">🧾</div>
              <h3>Facturatie</h3>
              <p>Vragen over facturen of je abonnement.</p>
              <a className="btn btn--link" href="#form">Neem contact op</a>
            </div>
          </div>
        </section>

        {/* 3. Formulier (client component) */}
        <section id="form" className="section section--alt">
          <div className="container card" style={{ padding: 18 }}>
            <h2 className="h2">Bericht sturen</h2>
            <ContactForm />
          </div>
        </section>

        {/* 4. Info blokken */}
        <section className="section">
          <div className="container grid grid--3">
            <div className="card feature">
              <div className="feature__icon">⏱️</div>
              <h3>Reactietijd</h3>
              <p>Ma–vr 09:00–17:00. Gemiddeld binnen 24 uur antwoord.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">📍</div>
              <h3>Locatie</h3>
              <p>Remote-first. Team verspreid in NL.</p>
            </div>
            <div className="card feature">
              <div className="feature__icon">🔐</div>
              <h3>Privacy</h3>
              <p>We verwerken je gegevens volgens onze privacyvoorwaarden.</p>
            </div>
          </div>
        </section>

        {/* 5. CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Liever direct proberen?</h3>
              <p>Activeer de proef en ervaar het zelf.</p>
            </div>
            <Link className="btn btn--primary" href={"/register" as Route}>
              Start gratis
            </Link>
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
            <Link href={"/knowledge-base" as Route}>Kennisbank</Link>
            <Link href={"/faq" as Route}>FAQ</Link>
            <a href="#">Status</a>
            <Link href={"/contact" as Route}>Contact</Link>
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
