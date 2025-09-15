"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@/lib/supabase/clients";

// UI placeholders: pas aan naar je eigen componenten
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none " + (props.className||"")} />;
}
function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={"rounded-xl px-4 py-2 border border-white/20 bg-white/10 hover:bg-white/20 " + (props.className||"")} />;
}
function Progress({ value, className }:{ value:number; className?:string }) {
  return (
    <div className={"w-full h-2 rounded bg-white/10 " + (className||"")}>
      <div className="h-2 rounded bg-white/60" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

// --- Klein debounce util, vervangt lodash.debounce ---
function debounce<F extends (...args: any[]) => void>(fn: F, wait: number) {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// --- Schema ---
const WizardSchema = z.object({
  subdomain: z.string().min(3).max(32),
  companyType: z.enum(["zzp", "kleinbedrijf", "mkb", "anders"]).default("zzp"),
  accountingBasis: z.enum(["cash", "accrual"]).default("accrual"),
  fiscalYearStartMonth: z.number().min(1).max(12).default(1),
  language: z.enum(["nl", "en"]).default("nl"),
  currency: z.enum(["EUR"]).default("EUR"),
  logoUrl: z.string().url().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  vatId: z.string().optional().nullable(),
  vatRates: z.array(z.number()).default([21, 9, 0])
});
type WizardData = z.infer<typeof WizardSchema>;

// Supabase browser client
const supabase = createBrowserClient();

export default function SetupWizardPage() {
  const [step, setStep] = useState(1);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<null | { available: boolean; reason?: string }>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const form = useForm<WizardData>({
    resolver: zodResolver(WizardSchema),
    defaultValues: {
      subdomain: "",
      companyType: "zzp",
      accountingBasis: "accrual",
      fiscalYearStartMonth: 1,
      language: "nl",
      currency: "EUR",
      vatRates: [21, 9, 0]
    }
  });

  // Bepaal orgId via memberships (eerste org van user)
  useEffect(() => {
    (async () => {
      setErr(null);
      const { data: mem, error } = await supabase
        .from("memberships")
        .select("organization_id")
        .limit(1)
        .maybeSingle();
      if (error) setErr(error.message);
      if (mem?.organization_id) setOrgId(mem.organization_id);
    })();
  }, []);

  // Debounced beschikbaarheidscheck
  const checkAvailability = debounce(async (candidate: string) => {
    if (!candidate) { setAvailability(null); return; }
    try {
      const res = await fetch(`/api/org/subdomain?candidate=${encodeURIComponent(candidate)}`);
      const json = await res.json();
      setAvailability({ available: !!json.available, reason: json.reason || null });
    } catch {
      setAvailability(null);
    }
  }, 500);

  async function autoSave(values: Partial<WizardData>) {
    if (!orgId) return;
    await supabase.from("organizations").update(values).eq("id", orgId);
  }

  async function handleSubdomainSave() {
    if (!orgId) return;
    try {
      setLoading(true);
      const desired = (form.getValues("subdomain") || "").toLowerCase().trim();
      const res = await fetch("/api/org/subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, subdomain: desired })
      });
      const json = await res.json();
      if (!json.ok) {
        setErr(json.error || "Kan subdomein niet opslaan.");
        return;
      }
      setStep(2);
    } catch {
      setErr("Onbekende fout bij opslaan subdomein.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    if (!orgId) return;
    await supabase.from("organizations").update({ setup_complete: true }).eq("id", orgId);
    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Setup Wizard</h1>
      <Progress value={(step / 5) * 100} className="mb-4" />
      {err && <p className="text-sm text-red-300 mb-2">{err}</p>}

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 1: Kies je subdomein</h2>
          <p className="text-sm mb-2">
            Dit wordt je URL: <span className="font-mono">https://<strong>{form.watch("subdomain") || "jouwbedrijf"}</strong>.bizora.nl</span>
          </p>
          <Input
            placeholder="jouwbedrijf"
            {...form.register("subdomain")}
            onChange={(e) => {
              const v = e.target.value.toLowerCase();
              form.setValue("subdomain", v);
              checkAvailability(v);
            }}
          />
          {availability && (
            <p className={`mt-1 text-sm ${availability.available ? "text-green-400" : "text-red-300"}`}>
              {availability.available ? "Beschikbaar ✅" : `Niet beschikbaar (${availability.reason})`}
            </p>
          )}
          <Button
            className="mt-4"
            disabled={!availability?.available || loading}
            onClick={handleSubdomainSave}
          >
            {loading ? "Opslaan..." : "Bevestigen & Volgende"}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 2: Bedrijfstype & Instellingen</h2>

          <label className="block mt-2 text-sm">Bedrijfstype</label>
          <Input
            list="companyType"
            value={form.watch("companyType")}
            onChange={(e) => { form.setValue("companyType", e.target.value as any); autoSave({ companyType: e.target.value as any }); }}
          />
          <datalist id="companyType">
            <option value="zzp" />
            <option value="kleinbedrijf" />
            <option value="mkb" />
            <option value="anders" />
          </datalist>

          <label className="block mt-2 text-sm">Boekjaar start (1–12)</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={form.watch("fiscalYearStartMonth")}
            onChange={(e) => form.setValue("fiscalYearStartMonth", Number(e.target.value))}
            onBlur={() => autoSave({ fiscalYearStartMonth: form.getValues("fiscalYearStartMonth") })}
          />

          <label className="block mt-2 text-sm">Kas/Accrual</label>
          <Input
            list="accBasis"
            value={form.watch("accountingBasis")}
            onChange={(e) => { form.setValue("accountingBasis", e.target.value as any); autoSave({ accountingBasis: e.target.value as any }); }}
          />
          <datalist id="accBasis">
            <option value="cash" />
            <option value="accrual" />
          </datalist>

          <Button className="mt-4" onClick={() => setStep(3)}>Volgende</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 3: Branding</h2>
          <label className="block mt-2 text-sm">Accentkleur</label>
          <Input
            type="color"
            value={form.watch("accentColor") || "#9ca3af"}
            onChange={(e) => form.setValue("accentColor", e.target.value)}
            onBlur={() => autoSave({ accentColor: form.getValues("accentColor") })}
          />

          <label className="block mt-2 text-sm">Logo URL</label>
          <Input
            placeholder="https://..."
            value={form.watch("logoUrl") || ""}
            onChange={(e) => form.setValue("logoUrl", e.target.value)}
            onBlur={() => autoSave({ logoUrl: form.getValues("logoUrl") })}
          />

          <Button className="mt-4" onClick={() => setStep(4)}>Volgende</Button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 4: BTW-instellingen</h2>
        <label className="block mt-2 text-sm">VAT ID</label>
          <Input
            value={form.watch("vatId") || ""}
            onChange={(e) => form.setValue("vatId", e.target.value)}
            onBlur={() => autoSave({ vatId: form.getValues("vatId") })}
          />

          <p className="mt-2 text-sm opacity-80">Standaardtarieven: 21%, 9%, 0%</p>
          <Button className="mt-4" onClick={() => setStep(5)}>Volgende</Button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 5: Bevestiging</h2>
          <pre className="bg-white/5 border border-white/10 p-3 rounded text-xs">
            {JSON.stringify(form.getValues(), null, 2)}
          </pre>
          <Button className="mt-4" onClick={handleFinish}>Afronden & Naar Dashboard</Button>
        </div>
      )}
    </div>
  );
}
