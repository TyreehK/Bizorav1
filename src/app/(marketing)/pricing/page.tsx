import Link from "next/link";

const plans = [
  { name: "Start", price: "€7", seats: "1 seat", features: ["Facturen & Offertes", "BTW-aangifte", "Basis rapportages"] },
  { name: "Flow", price: "€16", seats: "3 seats", features: ["Alles in Start", "Uitgebreide rapportages", "Integraties (basis)"] },
  { name: "Pro", price: "€29", seats: "10 seats", features: ["Alles in Flow", "Geavanceerde rapportages", "Integraties (uitgebreid)"] },
  { name: "Enterprise", price: "Op maat", seats: "Onbeperkt", features: ["Maatwerk integraties", "Dedicated support"] }
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">Kies je plan</h1>
      <p className="text-center opacity-90 mt-3">30 dagen gratis proef. Daarna eenvoudig maandelijks opzegbaar.</p>

      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="rounded-2xl p-6 bg-white/5 border border-white/10 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="text-3xl mt-2">{p.price}</div>
              <div className="opacity-80 mt-1">{p.seats}</div>
              <ul className="mt-4 space-y-2 text-sm opacity-90">
                {p.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
            </div>
            <Link
              href={{ pathname: "/login", query: { plan: p.name.toLowerCase() } }}
              className="mt-6 rounded-xl px-4 py-3 bg-brand-accent text-white text-center font-semibold hover:opacity-90 transition"
            >
              Start gratis
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
