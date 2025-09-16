// app/page.tsx
export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        style={{
          padding: "72px 24px",
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gap: 24,
        }}
        aria-labelledby="hero-title"
      >
        <div style={{ display: "grid", gap: 16 }}>
          <h1
            id="hero-title"
            style={{
              fontSize: 48,
              lineHeight: "1.1",
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Bizora — bouw sneller. beheer slimmer.
          </h1>
          <p style={{ fontSize: 18, color: "#334155", margin: 0 }}>
            Moderne web app met Supabase, Vercel & GitHub. Start met een
            schaalbare basis: auth, data en UI klaar om te groeien.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <a
              href="/signup"
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#111827",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Start gratis
            </a>
            <a
              href="#features"
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                color: "#111827",
                fontWeight: 600,
                background: "white",
              }}
            >
              Bekijk features
            </a>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginTop: 16,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            <span>⚡ Supabase</span>
            <span>•</span>
            <span>▲ Vercel</span>
            <span>•</span>
            <span> GitHub</span>
          </div>
        </div>

        {/* Simple visual / placeholder */}
        <div
          role="img"
          aria-label="Product preview"
          style={{
            marginTop: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            minHeight: 260,
            background:
              "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f1f5f9 100%)",
          }}
        />
      </section>

      {/* FEATURES */}
      <section
        id="features"
        aria-labelledby="features-title"
        style={{
          padding: "48px 24px",
          background: "#fafafa",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2 id="features-title" style={{ fontSize: 32, margin: "0 0 16px" }}>
            Wat maakt Bizora anders?
          </h2>
          <p style={{ margin: "0 0 24px", color: "#475569" }}>
            Alles wat je nodig hebt om snel te lanceren, netjes gestructureerd.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <Card
              title="Direct klaar voor productie"
              description="Next.js App Router, edge-ready. Perfect voor Vercel deployments."
              icon="🚀"
            />
            <Card
              title="Supabase als turbo-backend"
              description="Auth, database en file storage zonder gedoe. Veilig en schaalbaar."
              icon="🧩"
            />
            <Card
              title="Netjes gestructureerd"
              description="Heldere mappenstructuur en componenten. Gemakkelijk uit te breiden."
              icon="🗂️"
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        aria-labelledby="pricing-title"
        style={{ padding: "64px 24px" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2 id="pricing-title" style={{ fontSize: 32, margin: "0 0 8px" }}>
            Eerlijke prijzen
          </h2>
          <p style={{ margin: "0 0 24px", color: "#475569" }}>
            Begin gratis. Upgrade wanneer jij klaar bent.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <PriceCard
              name="Starter"
              price="Gratis"
              features={[
                "Basis landingspagina",
                "Klaar voor Supabase",
                "Deploy op Vercel",
              ]}
              ctaHref="/signup"
              highlighted={false}
            />
            <PriceCard
              name="Growth"
              price="€19/m"
              features={[
                "Auth + profielpagina",
                "Nieuwsbrief opslag",
                "Eenvoudige formulieren",
              ]}
              ctaHref="/signup"
              highlighted
            />
            <PriceCard
              name="Business"
              price="€49/m"
              features={[
                "Teams & rollen",
                "Server actions + RLS",
                "Custom domeinen",
              ]}
              ctaHref="/contact"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        style={{
          padding: "56px 24px",
          background: "#f8fafc",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 id="contact-title" style={{ fontSize: 28, margin: "0 0 12px" }}>
            Vragen of samenwerken?
          </h2>
          <p style={{ margin: "0 0 20px", color: "#475569" }}>
            Stuur een mail naar{" "}
            <a href="mailto:hello@bizora.app">hello@bizora.app</a> of klik op
            “Start gratis”.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="/signup"
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#111827",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Start gratis
            </a>
            <a
              href="mailto:hello@bizora.app"
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                color: "#111827",
                fontWeight: 600,
                background: "white",
              }}
            >
              Mail ons
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Card({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        background: "white",
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }} aria-hidden>
        {icon}
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{title}</h3>
      <p style={{ margin: 0, color: "#475569" }}>{description}</p>
    </article>
  );
}

function PriceCard({
  name,
  price,
  features,
  ctaHref,
  highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  ctaHref: string;
  highlighted?: boolean;
}) {
  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        background: highlighted ? "#111827" : "white",
        color: highlighted ? "white" : "#0f172a",
      }}
      aria-label={`${name} plan`}
    >
      <header style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 20 }}>{name}</h3>
        <p
          style={{
            margin: "4px 0 0",
            fontWeight: 700,
            fontSize: 18,
            color: highlighted ? "white" : "#111827",
          }}
        >
          {price}
        </p>
      </header>
      <ul style={{ paddingLeft: 18, margin: "12px 0", lineHeight: 1.6 }}>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a
        href={ctaHref}
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: 10,
          border: highlighted ? "1px solid #374151" : "1px solid #e5e7eb",
          textDecoration: "none",
          color: highlighted ? "white" : "#111827",
          fontWeight: 600,
          background: highlighted ? "#0b1220" : "white",
        }}
      >
        Kies {name}
      </a>
    </article>
  );
}
