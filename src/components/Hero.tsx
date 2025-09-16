import Link from "next/link";

export default function Hero() {
  return (
    <section className="section">
      <div className="container-bz grid gap-10 lg:grid-cols-2 items-center">
        {/* Copy */}
        <div>
          <span className="pill mb-4">Voor ondernemers · 30 dagen gratis</span>
          <h1 className="text-5xl font-extrabold leading-[1.05] text-[var(--bz-navy)]">
            Administratie, <span style={{ color: "var(--bz-blue)" }}>eenvoudig</span> geregeld
          </h1>
          <p className="mt-4 text-lg text-[var(--bz-ink-2)] max-w-xl">
            Stuur professionele offertes, factureer met één klik en houd je btw en betalingen bij — alles op één plek.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/register">
              Start gratis
            </Link>
            <Link className="btn btn-secondary" href="/pricing">
              Bekijk prijzen
            </Link>
          </div>
          <ul className="mt-5 grid gap-2 text-sm text-[var(--bz-ink-2)]">
            <li>• Zicht op omzet & openstaande posten</li>
            <li>• Mooie pdf’s en automatische herinneringen</li>
            <li>• Koppeling klaar voor later (bank/kvk)</li>
          </ul>
        </div>

        {/* Visual mock: 2 zachte kaarten */}
        <div className="grid gap-5">
          <div className="bz-card p-5">
            <div className="text-sm text-[var(--bz-ink-2)]">Factuur #INV-24031</div>
            <div className="mt-2 text-2xl font-extrabold text-[var(--bz-navy)]">€ 1.250</div>
            <div
              className="mt-4 h-28 rounded-xl"
              style={{
                background: "linear-gradient(180deg,#eef3ff,transparent)",
              }}
            />
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-[var(--bz-ink-2)]">Vervaldatum</span>
              <span className="font-semibold">14 dagen</span>
            </div>
          </div>

          <div className="bz-card p-5">
            <div className="text-sm text-[var(--bz-ink-2)]">Offerte pipeline</div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              <div
                className="h-14 rounded-lg"
                style={{ background: "#f6f8ff", border: "1px solid #e3ebff" }}
              />
              <div
                className="h-14 rounded-lg"
                style={{ background: "#f6f8ff", border: "1px solid #e3ebff" }}
              />
              <div
                className="h-14 rounded-lg"
                style={{ background: "#f6f8ff", border: "1px solid #e3ebff" }}
              />
              <div
                className="h-14 rounded-lg"
                style={{ background: "#f6f8ff", border: "1px solid #e3ebff" }}
              />
            </div>
            <div className="mt-4 text-sm text-[var(--bz-ink-2)]">
              Conversie deze maand{" "}
              <span className="font-semibold text-[var(--bz-blue)]">38%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
