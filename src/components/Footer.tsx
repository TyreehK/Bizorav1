import Link from "next/link";

export default function Footer() {
  return (
    <div
      aria-label="Voettekst"
      className="container"
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      }}
    >
      {/* Bovenste blokken */}
      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
      >
        <div style={{ display: "grid", gap: ".6rem" }}>
          <div className="brand">Bizora</div>
          <p style={{ color: "var(--bz-text-muted)" }}>
            Slimme software voor facturen, offertes en btw — gemaakt voor ondernemers.
          </p>
          <div style={{ fontSize: "0.9rem", color: "var(--bz-text-muted)" }}>
            © {new Date().getFullYear()} Bizora
          </div>
        </div>

        <div style={{ display: "grid", gap: ".4rem" }}>
          <div style={{ fontWeight: 700, color: "var(--bz-primary)" }}>Product</div>
          <Link href="/pricing">Prijzen</Link>
          <Link href="/knowledge-base">Kennisbank</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">Over ons</Link>
        </div>

        <div style={{ display: "grid", gap: ".4rem" }}>
          <div style={{ fontWeight: 700, color: "var(--bz-primary)" }}>Resources</div>
          <Link href="/contact">Contact</Link>
          <a href="#" className="underline">Perskit</a>
          <a href="#" className="underline">Status</a>
        </div>

        <div style={{ display: "grid", gap: ".4rem" }}>
          <div style={{ fontWeight: 700, color: "var(--bz-primary)" }}>Juridisch</div>
          <a className="underline" href="#">Privacy</a>
          <a className="underline" href="#">Algemene voorwaarden</a>
          <a className="underline" href="#">Verwerkersovereenkomst</a>
        </div>
      </div>

      {/* Onderrand */}
      <div
        style={{
          borderTop: "1px solid var(--bz-border)",
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          color: "var(--bz-text-muted)",
          fontSize: ".95rem",
        }}
      >
        <span>Gemaakt met ♥ in NL</span>
        <span>KVK / BTW / Contact</span>
      </div>
    </div>
  );
}
