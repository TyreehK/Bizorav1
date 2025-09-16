import type { Route } from "next";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Inloggen — Bizora",
  description:
    "Log in met je e-mailadres en wachtwoord om toegang te krijgen tot je Bizora dashboard.",
};

export default function LoginPage() {
  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="/">
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href={"/pricing" as Route}>Prijzen</a>
            <a href={"/knowledge-base" as Route}>Kennisbank</a>
            <a href={"/contact" as Route}>Contact</a>
          </nav>
          <div className="nav__cta">
            <a className="btn btn--primary" href={"/register" as Route}>Start gratis</a>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main>
        <section className="hero">
          <div className="container" style={{ maxWidth: 480 }}>
            <h1 className="hero__title">Inloggen</h1>
            <p className="hero__subtitle">
              Vul je gegevens in om toegang te krijgen tot je dashboard.
            </p>

            {/* Client component met formulier en state */}
            <LoginForm />

            <p style={{ fontSize: "0.95rem", marginTop: 16, opacity: 0.8 }}>
              Nog geen account?{" "}
              <a href={"/register" as Route} className="btn btn--link">Maak er gratis één aan</a>.
            </p>
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
            <div className="foot__title">Resources</div>
            <a href={"/knowledge-base" as Route}>Kennisbank</a>
            <a href={"/faq" as Route}>FAQ</a>
            <a href={"/contact" as Route}>Contact</a>
          </div>
          <div>
            <div className="foot__title">Juridisch</div>
            <a href="#">Privacy</a>
            <a href="#">Voorwaarden</a>
          </div>
        </div>
      </footer>
    </>
  );
}
