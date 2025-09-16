"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Article = { id: string; title: string; cat: string; time: string };

const CATS = ["Aan de slag", "Facturen", "Offertes", "BTW", "Rapportages", "Team", "Data"];
const ARTICLES: Article[] = [
  { id: "a1", title: "Eerste stappen in Bizora", cat: "Aan de slag", time: "3 min" },
  { id: "a2", title: "Je huisstijl instellen", cat: "Aan de slag", time: "4 min" },
  { id: "a3", title: "Factuur maken en versturen", cat: "Facturen", time: "5 min" },
  { id: "a4", title: "Herinneringen automatiseren", cat: "Facturen", time: "3 min" },
  { id: "a5", title: "Offerte pipeline & acceptatie", cat: "Offertes", time: "4 min" },
  { id: "a6", title: "BTW-periodes & export", cat: "BTW", time: "4 min" },
  { id: "a7", title: "KPI’s & drill-down", cat: "Rapportages", time: "5 min" },
  { id: "a8", title: "Teamrollen & uitnodigen", cat: "Team", time: "3 min" },
  { id: "a9", title: "Data export (CSV/XLSX/PDF)", cat: "Data", time: "2 min" },
];

export default function KnowledgeBasePage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("Alles");

  const allCats = useMemo(() => ["Alles", ...CATS], []);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ARTICLES.filter(a =>
      (active === "Alles" || a.cat === active) &&
      (s === "" || a.title.toLowerCase().includes(s))
    );
  }, [q, active]);

  return (
    <>
      <Hero />
      <Search q={q} setQ={setQ} active={active} setActive={setActive} cats={allCats} />
      <Categories cats={CATS} setActive={setActive} />
      <Articles items={filtered} />
      <Popular />
      <Latest />
      <VideoTeaser />
      <SubmitQuestion />
      <ContactTeaser />
      <FinalCTA />
    </>
  );
}

/* 1) HERO */
function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", display: "grid", gap: "1rem" }}>
        <h1 className="section-title" style={{ marginInline: "auto" }}>Kennisbank</h1>
        <p className="section-subtitle" style={{ marginInline: "auto" }}>
          Handleidingen, voorbeelden en best practices om alles uit Bizora te halen.
        </p>
      </div>
    </section>
  );
}

/* 2) SEARCH */
function Search({ q, setQ, active, setActive, cats }: any) {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem", gridTemplateColumns: "1fr auto" }}>
          <input placeholder="Zoek in artikelen..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={active} onChange={(e) => setActive(e.target.value)}>
            {cats.map((c: string) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}

/* 3) CATEGORIES (quick access) */
function Categories({ cats, setActive }: { cats: string[]; setActive: (v: string) => void }) {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "1rem" }}>
          {cats.map((c) => (
            <button
              key={c}
              className="btn btn-outline"
              onClick={() => setActive(c)}
              style={{ width: "100%" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4) ARTICLES LIST */
function Articles({ items }: { items: Article[] }) {
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 className="section-title">Artikelen</h2>
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {items.map((a) => (
              <a key={a.id} className="card" style={{ padding: "1rem" }} href="#">
                <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>{a.title}</div>
                <div style={{ color: "var(--bz-text-muted)" }}>{a.cat} · {a.time}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5) POPULAR */
function Popular() {
  const list = ["Factuur maken en versturen", "Offerte pipeline & acceptatie", "BTW-periodes & export"];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Populair</div>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: ".75rem" }}>
            {list.map((t) => (
              <li key={t} className="card" style={{ padding: "1rem" }}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 6) LATEST */
function Latest() {
  const list = ["Teamrollen & uitnodigen", "Data export (CSV/XLSX/PDF)", "KPI’s & drill-down"];
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Nieuw</div>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: ".75rem" }}>
            {list.map((t) => (
              <li key={t} className="card" style={{ padding: "1rem" }}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 7) VIDEO TEASER */
function VideoTeaser() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ height: 300, display: "grid", placeItems: "center" }}>
          🎬 Video tutorial placeholder (Embed later)
        </div>
      </div>
    </section>
  );
}

/* 8) SUBMIT QUESTION */
function SubmitQuestion() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "2fr 1fr" }}>
        <form
          className="card"
          style={{ padding: "1rem", display: "grid", gap: ".75rem" }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Stel een vraag aan ons team</div>
          <input placeholder="Naam" required />
          <input type="email" placeholder="E-mail" required />
          <textarea rows={5} placeholder="Je vraag" required />
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <button className="btn btn-primary">Verzenden</button>
            {sent && <span style={{ color: "var(--bz-text-muted)" }}>✅ Verzonden (demo)</span>}
          </div>
        </form>

        <div className="card" style={{ padding: "1rem" }}>
          <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Sneller antwoord?</div>
          <div style={{ color: "var(--bz-text-muted)" }}>Bekijk eerst de FAQ of neem contact op.</div>
        </div>
      </div>
    </section>
  );
}

/* 9) CONTACT TEASER */
function ContactTeaser() {
  return (
    <section>
      <div className="container">
        <div className="card" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--bz-primary)" }}>Kom je er niet uit?</div>
            <div style={{ color: "var(--bz-text-muted)" }}>Onze support helpt je graag.</div>
          </div>
        <Link className="btn btn-primary" href="/contact">Contact</Link>
        </div>
      </div>
    </section>
  );
}

/* 10) FINAL CTA */
function FinalCTA() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <div className="card" style={{ padding: "2rem", display: "grid", gap: ".5rem" }}>
          <h2 className="section-title">Klaar om Bizora te proberen?</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>Start gratis en volg onze stappen in de kennisbank.</p>
          <div><Link className="btn btn-primary" href="/register">Start gratis</Link></div>
        </div>
      </div>
    </section>
  );
}
