import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Bizora — <span className="text-brand-accent">Start gratis</span> en groei met je bedrijf
        </h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Alles-in-één voor offertes, facturen, uitgaven, BTW en rapportages.
          30 dagen proef. Daarna simpel maandabonnement.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="rounded-xl px-6 py-3 bg-brand-accent text-white font-semibold hover:opacity-90 transition"
          >
            Start gratis
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl px-6 py-3 border border-white/20 hover:border-white/40 transition"
          >
            Bekijk pakketten
          </Link>
        </div>
      </section>

      <section className="mt-24 grid md:grid-cols-3 gap-6">
        {[
          { title: "BTW-aangifte", desc: "Klaarzetten, controleren en exporteren — zonder gedoe." },
          { title: "Facturen & Offertes", desc: "Van offerte naar factuur met één klik." },
          { title: "Rapportages", desc: "Inzicht in omzet, aging en marges." }
        ].map((f) => (
          <div key={f.title} className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="opacity-90">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-24 border-t border-white/10 pt-8 text-sm opacity-80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <nav className="flex gap-4">
            <Link href="/pricing">Pakketten</Link>
            <Link href="#">Over ons</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Algemene voorwaarden</Link>
          </nav>
          <div>© Bizora {new Date().getFullYear()}</div>
        </div>
      </footer>
    </main>
  );
}
