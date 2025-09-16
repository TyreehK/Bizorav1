export const metadata = {
  title: "Kennisbank — Bizora",
  description:
    "Artikelen en how-to's over facturen, BTW, rapportages en meer. Leer Bizora maximaal benutten.",
};

const CATEGORIES = [
  { slug: "start", name: "Starten met Bizora" },
  { slug: "invoices", name: "Facturen & Offertes" },
  { slug: "expenses", name: "Uitgaven & Inkoop" },
  { slug: "vat", name: "BTW & Aangifte" },
  { slug: "reports", name: "Rapportages" },
  { slug: "account", name: "Account & Beveiliging" },
];

const ARTICLES = [
  { cat: "start", title: "Eerste stappen: van account tot eerste factuur" },
  { cat: "start", title: "Subdomein kiezen en branding instellen" },
  { cat: "invoices", title: "Nummering en sjablonen" },
  { cat: "invoices", title: "Herinneringen automatiseren" },
  { cat: "expenses", title: "Bonnetjes scannen met OCR" },
  { cat: "vat", title: "BTW-periodes en concept aangifte" },
  { cat: "reports", title: "Omzet per klant en aging" },
  { cat: "account", title: "Rollen & rechten (5 vast)" },
  { cat: "account", title: "2FA verplichten voor het team" },
  { cat: "reports", title: "Exporteren naar CSV/XLSX/PDF" },
  { cat: "vat", title: "ICP en verleggingsregels" },
  { cat: "expenses", title: "Dubbele inkoopfacturen voorkomen" },
];

export default function KnowledgeBasePage() {
  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="/">
            <span className="brand__logo">B</span>
            <span className="brand__name">BIZORA</span>
          </a>
          <nav className="nav__links">
            <a href="/#features">Product</a>
            <a href="/#solutions">Oplossingen</a>
            <a href="/pricing">Prijzen</a>
            <a className="nav-active" href="/knowledge-base">Kennisbank</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="nav__cta">
            <a className="btn btn--ghost" href="/login">Inloggen</a>
            <a className="btn btn--primary" href="/register">Start gratis</a>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="hero">
          <div className="container">
            <h1 className="hero__title">Kennisbank</h1>
            <p className="hero__subtitle">Handleidingen, tips en best practices.</p>
          </div>
        </section>

        {/* 2. Categorieën */}
        <section className="section">
          <div className="container grid grid--3">
            {CATEGORIES.map((c) => (
              <div key={c.slug} className="card feature">
                <div className="feature__icon">📚</div>
                <h3>{c.name}</h3>
                <p className="muted">
                  Artikelen en stappenplannen binnen {c.name.toLowerCase()}.
                </p>
                <a className="btn btn--link" href={`#${c.slug}`}>Bekijk artikelen</a>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Lijsten per categorie (10+ componenten via map) */}
        <section className="section section--alt">
          <div className="container">
            {CATEGORIES.map((c) => (
              <div key={c.slug} id={c.slug} className="card" style={{ padding: 18, marginBottom: 16 }}>
                <h2 className="h2">{c.name}</h2>
                <div className="grid grid--3">
                  {ARTICLES.filter((a) => a.cat === c.slug).map((a) => (
                    <div key={a.title} className="feature">
                      <h4 style={{ margin: "0 0 6px 0" }}>{a.title}</h4>
                      <p className="muted">Uitleg, voorbeelden en veelgemaakte fouten.</p>
                      <a className="btn btn--link" href="#!">Lees artikel</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CTA */}
        <section className="cta">
          <div className="container cta__inner">
            <div>
              <h3>Mis je iets?</h3>
              <p>Laat het ons weten — we voegen het snel toe.</p>
            </div>
            <a className="btn btn--primary" href="/contact">Stuur verzoek</a>
          </div>
        </section>
      </main>

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
            <a href="/knowledge-base">Kennisbank</a><a href="/faq">FAQ</a><a href="#">Status</a><a href="/contact">Contact</a>
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
