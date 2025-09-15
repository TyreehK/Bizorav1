"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import debounce from "lodash.debounce";

// UI libs: shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// --- Types & schema ---

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

// --- Supabase client ---
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Component ---
export default function SetupWizardPage() {
  const [step, setStep] = useState(1);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<null | { available: boolean; reason?: string }>(null);
  const [loading, setLoading] = useState(false);

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

  // Haal actieve org van ingelogde user (simpelste: eerste membership)
  useEffect(() => {
    (async () => {
      const { data: membership } = await supabase
        .from("memberships")
        .select("organization_id")
        .limit(1)
        .maybeSingle();
      if (membership?.organization_id) {
        setOrgId(membership.organization_id);
      }
    })();
  }, []);

  // Subdomein-check debounced
  const checkAvailability = debounce(async (candidate: string) => {
    if (!candidate) return;
    const res = await fetch(`/api/org/subdomain?candidate=${encodeURIComponent(candidate)}`);
    const json = await res.json();
    setAvailability({ available: json.available, reason: json.reason });
  }, 500);

  // Autosave elke blur/change
  async function autoSave(values: Partial<WizardData>) {
    if (!orgId) return;
    await supabase.from("organizations").update(values).eq("id", orgId);
  }

  async function handleSubdomainSave() {
    if (!orgId) return;
    const desired = form.getValues("subdomain");
    setLoading(true);
    const res = await fetch("/api/org/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, subdomain: desired })
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setStep(2);
    } else {
      alert(`Fout: ${json.error}`);
    }
  }

  async function handleFinish() {
    if (!orgId) return;
    await supabase.from("organizations").update({ setup_complete: true }).eq("id", orgId);
    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Setup Wizard</h1>
      <Progress value={(step / 5) * 100} className="mb-6" />

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 1: Kies je subdomein</h2>
          <p className="text-sm mb-2">Dit wordt je login URL: <span className="font-mono">https://<strong>{form.watch("subdomain") || "jouwbedrijf"}</strong>.bizora.nl</span></p>
          <Input
            placeholder="jouwbedrijf"
            {...form.register("subdomain")}
            onChange={e => {
              form.setValue("subdomain", e.target.value.toLowerCase());
              checkAvailability(e.target.value.toLowerCase());
            }}
          />
          {availability && (
            <p className={`mt-1 text-sm ${availability.available ? "text-green-600" : "text-red-600"}`}>
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
          <label className="block mt-2">Bedrijfstype</label>
          <Select
            onValueChange={v => { form.setValue("companyType", v as any); autoSave({ companyType: v as any }); }}
            value={form.watch("companyType")}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="zzp">ZZP</SelectItem>
              <SelectItem value="kleinbedrijf">Kleinbedrijf</SelectItem>
              <SelectItem value="mkb">MKB</SelectItem>
              <SelectItem value="anders">Anders</SelectItem>
            </SelectContent>
          </Select>

          <label className="block mt-2">Boekjaar start (maand 1-12)</label>
          <Input
            type="number"
            min={1}
            max={12}
            {...form.register("fiscalYearStartMonth", { valueAsNumber: true })}
            onBlur={() => autoSave({ fiscalYearStartMonth: form.getValues("fiscalYearStartMonth") })}
          />

          <label className="block mt-2">Kas/Accrual</label>
          <Select
            onValueChange={v => { form.setValue("accountingBasis", v as any); autoSave({ accountingBasis: v as any }); }}
            value={form.watch("accountingBasis")}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Kas</SelectItem>
              <SelectItem value="accrual">Accrual</SelectItem>
            </SelectContent>
          </Select>

          <Button className="mt-4" onClick={() => setStep(3)}>Volgende</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 3: Branding</h2>
          <label className="block mt-2">Accentkleur (hex)</label>
          <Input
            type="color"
            {...form.register("accentColor")}
            onBlur={() => autoSave({ accentColor: form.getValues("accentColor") })}
          />

          <label className="block mt-2">Logo upload (URL)</label>
          <Input
            placeholder="https://..."
            {...form.register("logoUrl")}
            onBlur={() => autoSave({ logoUrl: form.getValues("logoUrl") })}
          />

          <Button className="mt-4" onClick={() => setStep(4)}>Volgende</Button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 4: BTW-instellingen</h2>
          <label className="block mt-2">VAT ID</label>
          <Input
            {...form.register("vatId")}
            onBlur={() => autoSave({ vatId: form.getValues("vatId") })}
          />

          <p className="mt-2 text-sm">Standaardtarieven: 21%, 9%, 0%</p>
          <Button className="mt-4" onClick={() => setStep(5)}>Volgende</Button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stap 5: Bevestiging</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(form.getValues(), null, 2)}</pre>
          <Button className="mt-4" onClick={handleFinish}>Afronden & Naar Dashboard</Button>
        </div>
      )}
    </div>
  );
}
