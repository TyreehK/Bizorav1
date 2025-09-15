"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * ENV:
 * - NEXT_PUBLIC_HCAPTCHA_SITEKEY
 * - (optioneel) NEXT_PUBLIC_APP_URL
 */

const SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || "";

/* ===================== Zod schema (gelijk aan API) ===================== */

const PersonalSchema = z.object({
  firstName: z.string().min(2, "Minimaal 2 tekens").max(50),
  lastName: z.string().min(2, "Minimaal 2 tekens").max(50),
  roleTitle: z.string().max(80).optional().nullable(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Ongeldig telefoonnummer (E.164, bijv. +31612345678)")
});

const AccountSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  communicationsOptIn: z.boolean().optional().default(false)
});

const CompanySchema = z.object({
  companyName: z.string().min(2, "Minimaal 2 tekens"),
  kvk: z.string().min(4).max(16).optional().nullable(),
  vat: z.string().max(32).optional().nullable(),
  industry: z.string().max(60).optional().nullable(),
  companySize: z.string().max(40).optional().nullable()
});

const NLPostcode = /^[1-9]\d{3}\s?[A-Za-z]{2}$/;

const AddressSchema = z.object({
  street: z.string().min(2, "Minimaal 2 tekens"),
  houseNumber: z.string().min(1, "Verplicht"),
  houseNumberAddition: z.string().optional().nullable(),
  postcode: z.string().regex(NLPostcode, "Ongeldige NL-postcode").optional().nullable(),
  city: z.string().min(2, "Minimaal 2 tekens"),
  country: z.string().min(2, "Verplicht").default("NL"),
  invoiceAddressDifferent: z.boolean().default(false),
  invoiceAddress: z
    .object({
      street: z.string().min(2, "Minimaal 2 tekens"),
      houseNumber: z.string().min(1, "Verplicht"),
      houseNumberAddition: z.string().optional().nullable(),
      postcode: z.string().regex(NLPostcode, "Ongeldige NL-postcode"),
      city: z.string().min(2, "Minimaal 2 tekens"),
      country: z.string().min(2, "Verplicht")
    })
    .optional()
    .nullable()
})
.refine(
  (v) => !v.invoiceAddressDifferent || (!!v.invoiceAddress && !!v.invoiceAddress.street),
  { message: "Factuuradres is verplicht", path: ["invoiceAddress"] }
);

const PreferencesSchema = z.object({
  language: z.enum(["nl", "en"]).default("nl"),
  currency: z.enum(["EUR"]).default("EUR"),
  timezone: z.string().default("Europe/Amsterdam"),
  fiscalYearStartMonth: z.number().int().min(1).max(12).default(1),
  accountingBasis: z.enum(["cash", "accrual"]).default("accrual")
});

const LegalSchema = z.object({
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Accepteer de voorwaarden" }) }),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: "Accepteer de privacyverklaring" }) }),
  gdprLabelShown: z.boolean().default(true),
  newsletterOptIn: z.boolean().default(false)
});

const RegistrationSchema = z.object({
  plan: z.enum(["start", "flow", "pro", "enterprise"]).default("start"),
  personal: PersonalSchema,
  account: AccountSchema,
  company: CompanySchema,
  address: AddressSchema,
  preferences: PreferencesSchema,
  legal: LegalSchema,
  hcaptchaToken: z.string().min(10, "Captcha vereist")
});

type RegistrationInput = z.infer<typeof RegistrationSchema>;

/* ========================= Helpers / UI utils ========================== */

const DRAFT_KEY = "bizora_register_draft_v1";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm mb-1">{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent " +
        (props.className || "")
      }
    />
  );
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent " +
        (props.className || "")
      }
    />
  );
}
function Checkbox({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} className="accent-brand-accent h-4 w-4" />
      {label}
    </label>
  );
}
function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-red-300 mt-1">{children}</p>;
}

/* ============================= Component =============================== */

export default function RegisterPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const planParam = (qs.get("plan") || "start").toLowerCase();
  const initialPlan: RegistrationInput["plan"] =
    planParam === "flow" || planParam === "pro" || planParam === "enterprise" ? (planParam as any) : "start";

  const methods = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchema),
    mode: "onChange",
    defaultValues: {
      plan: initialPlan,
      personal: { firstName: "", lastName: "", roleTitle: "", phone: "" },
      account: { email: "", communicationsOptIn: false },
      company: { companyName: "", kvk: "", vat: "", industry: "", companySize: "" },
      address: {
        street: "",
        houseNumber: "",
        houseNumberAddition: "",
        postcode: "",
        city: "",
        country: "NL",
        invoiceAddressDifferent: false,
        invoiceAddress: undefined
      },
      preferences: {
        language: "nl",
        currency: "EUR",
        timezone: "Europe/Amsterdam",
        fiscalYearStartMonth: 1,
        accountingBasis: "accrual"
      },
      legal: {
        acceptTerms: false,
        acceptPrivacy: false,
        gdprLabelShown: true,
        newsletterOptIn: false
      },
      hcaptchaToken: ""
    }
  });

  const { register, handleSubmit, setValue, getValues, formState, watch, reset } = methods;
  const { errors, isValid, isSubmitting } = formState;

  const invoiceDiff = watch("address.invoiceAddressDifferent");

  // --- Draft restore ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.plan = initialPlan;
        reset(parsed, { keepDefaultValues: false });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Autosave on blur (store entire form) ---
  const saveDraft = () => {
    try {
      const data = getValues();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  };

  // convenience: set/unset invoice address block
  useEffect(() => {
    const have = getValues("address.invoiceAddress");
    if (invoiceDiff && !have) {
      setValue("address.invoiceAddress", {
        street: "",
        houseNumber: "",
        houseNumberAddition: "",
        postcode: "",
        city: "",
        country: "NL"
      } as any, { shouldValidate: false, shouldDirty: true });
    }
    if (!invoiceDiff) {
      setValue("address.invoiceAddress", undefined as any, { shouldValidate: false, shouldDirty: true });
    }
  }, [invoiceDiff, getValues, setValue]);

  const [captchaReady, setCaptchaReady] = useState(false);
  const canSubmit = isValid && !!watch("hcaptchaToken") && captchaReady && !isSubmitting;

  async function onSubmit(values: RegistrationInput) {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Er ging iets mis bij registreren.");
        return;
      }
      localStorage.removeItem(DRAFT_KEY);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl as string;
      } else {
        alert("Registratie gelukt, maar geen checkoutUrl ontvangen.");
      }
    } catch (e: any) {
      alert("Onverwachte fout: " + (e?.message || "unknown"));
    }
  }

  const onBlurSave = { onBlur: saveDraft };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Start je 30-dagen proef</h1>
      <p className="opacity-90 mt-2">
        Vul je gegevens in. Na bevestiging ga je naar een Stripe-checkout om je proef te starten (geen kosten nu).
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
        <strong>Gekozen plan:</strong>{" "}
        <span className="uppercase font-semibold">{watch("plan")}</span> &nbsp;|&nbsp; Seats en functies kun je later altijd wijzigen.
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-10">
          {/* Persoonlijk */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Persoonlijk</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Voornaam</Label>
                <Input placeholder="Bijv. Gabriëlla" {...register("personal.firstName")} {...onBlurSave} />
                <ErrorText>{errors.personal?.firstName?.message}</ErrorText>
              </div>
              <div>
                <Label>Achternaam</Label>
                <Input placeholder="Bijv. Jansen" {...register("personal.lastName")} {...onBlurSave} />
                <ErrorText>{errors.personal?.lastName?.message}</ErrorText>
              </div>
              <div>
                <Label>Rol / Functie (optioneel)</Label>
                <Input placeholder="Bijv. Eigenaar" {...register("personal.roleTitle")} {...onBlurSave} />
                <ErrorText>{errors.personal?.roleTitle?.message}</ErrorText>
              </div>
              <div>
                <Label>Telefoon (E.164)</Label>
                <Input placeholder="+31612345678" {...register("personal.phone")} {...onBlurSave} />
                <ErrorText>{errors.personal?.phone?.message}</ErrorText>
              </div>
            </div>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>E-mail</Label>
                <Input placeholder="jij@bedrijf.nl" {...register("account.email")} {...onBlurSave} />
                <ErrorText>{errors.account?.email?.message}</ErrorText>
              </div>
              <div className="flex items-end">
                <Checkbox label="Ik wil productupdates ontvangen" {...register("account.communicationsOptIn")} />
              </div>
            </div>
          </section>

          {/* Bedrijf */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Bedrijf</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Bedrijfsnaam</Label>
                <Input placeholder="Bijv. ACME BV" {...register("company.companyName")} {...onBlurSave} />
                <ErrorText>{errors.company?.companyName?.message}</ErrorText>
              </div>
              <div>
                <Label>KvK (optioneel)</Label>
                <Input placeholder="KvK nummer" {...register("company.kvk")} {...onBlurSave} />
                <ErrorText>{errors.company?.kvk?.message}</ErrorText>
              </div>
              <div>
                <Label>BTW / VAT (optioneel)</Label>
                <Input placeholder="NL123456789B01" {...register("company.vat")} {...onBlurSave} />
                <ErrorText>{errors.company?.vat?.message}</ErrorText>
              </div>
              <div>
                <Label>Branche (optioneel)</Label>
                <Input placeholder="Bijv. Consultancy" {...register("company.industry")} {...onBlurSave} />
                <ErrorText>{errors.company?.industry?.message}</ErrorText>
              </div>
              <div>
                <Label>Bedrijfsgrootte (optioneel)</Label>
                <Select {...register("company.companySize")} {...onBlurSave}>
                  <option value="">Selecteer…</option>
                  <option value="solo">ZZP</option>
                  <option value="small">Klein (2–10)</option>
                  <option value="mid">MKB (11–50)</option>
                  <option value="large">Groot (50+)</option>
                </Select>
                <ErrorText>{errors.company?.companySize?.message}</ErrorText>
              </div>
            </div>
          </section>

          {/* Adres */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Adres</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>Straat</Label>
                <Input {...register("address.street")} {...onBlurSave} />
                <ErrorText>{errors.address?.street?.message}</ErrorText>
              </div>
              <div>
                <Label>Nr</Label>
                <Input {...register("address.houseNumber")} {...onBlurSave} />
                <ErrorText>{errors.address?.houseNumber?.message}</ErrorText>
              </div>
              <div>
                <Label>Toevoeging</Label>
                <Input {...register("address.houseNumberAddition")} {...onBlurSave} />
                <ErrorText>{errors.address?.houseNumberAddition?.message}</ErrorText>
              </div>
              <div>
                <Label>Postcode (NL)</Label>
                <Input placeholder="1234 AB" {...register("address.postcode")} {...onBlurSave} />
                <ErrorText>{errors.address?.postcode?.message}</ErrorText>
              </div>
              <div>
                <Label>Plaats</Label>
                <Input {...register("address.city")} {...onBlurSave} />
                <ErrorText>{errors.address?.city?.message}</ErrorText>
              </div>
              <div>
                <Label>Land</Label>
                <Input {...register("address.country")} {...onBlurSave} />
                <ErrorText>{errors.address?.country?.message}</ErrorText>
              </div>
            </div>

            <div className="mt-4">
              <Checkbox
                label="Afwijkend factuuradres"
                {...register("address.invoiceAddressDifferent")}
                onChange={(e) => {
                  const checked = (e.target as HTMLInputElement).checked;
                  methods.setValue("address.invoiceAddressDifferent", checked, { shouldDirty: true });
                }}
              />
            </div>

            {invoiceDiff && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-medium mb-3">Factuuradres</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Straat</Label>
                    <Input {...register("address.invoiceAddress.street" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.street?.message}</ErrorText>
                  </div>
                  <div>
                    <Label>Nr</Label>
                    <Input {...register("address.invoiceAddress.houseNumber" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.houseNumber?.message}</ErrorText>
                  </div>
                  <div>
                    <Label>Toevoeging</Label>
                    <Input {...register("address.invoiceAddress.houseNumberAddition" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.houseNumberAddition?.message}</ErrorText>
                  </div>
                  <div>
                    <Label>Postcode</Label>
                    <Input {...register("address.invoiceAddress.postcode" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.postcode?.message}</ErrorText>
                  </div>
                  <div>
                    <Label>Plaats</Label>
                    <Input {...register("address.invoiceAddress.city" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.city?.message}</ErrorText>
                  </div>
                  <div>
                    <Label>Land</Label>
                    <Input {...register("address.invoiceAddress.country" as const)} {...onBlurSave} />
                    <ErrorText>{(errors.address?.invoiceAddress as any)?.country?.message}</ErrorText>
                  </div>
                </div>
                <ErrorText>{errors.address?.invoiceAddress?.message as any}</ErrorText>
              </div>
            )}
          </section>

          {/* Voorkeuren */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Voorkeuren</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Taal</Label>
                <Select {...register("preferences.language")} {...onBlurSave}>
                  <option value="nl">Nederlands</option>
                  <option value="en">English</option>
                </Select>
                <ErrorText>{errors.preferences?.language?.toString()}</ErrorText>
              </div>
              <div>
                <Label>Valuta</Label>
                <Select {...register("preferences.currency")} {...onBlurSave}>
                  <option value="EUR">EUR</option>
                </Select>
                <ErrorText>{errors.preferences?.currency?.toString()}</ErrorText>
              </div>
              <div>
                <Label>Tijdzone</Label>
                <Input placeholder="Europe/Amsterdam" {...register("preferences.timezone")} {...onBlurSave} />
                <ErrorText>{errors.preferences?.timezone?.toString()}</ErrorText>
              </div>
              <div>
                <Label>Boekjaar start (maand 1-12)</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  {...register("preferences.fiscalYearStartMonth", { valueAsNumber: true })}
                  {...onBlurSave}
                />
                <ErrorText>{errors.preferences?.fiscalYearStartMonth?.toString()}</ErrorText>
              </div>
              <div>
                <Label>Stelsel</Label>
                <Select {...register("preferences.accountingBasis")} {...onBlurSave}>
                  <option value="accrual">Accrual (opbouw)</option>
                  <option value="cash">Kas</option>
                </Select>
                <ErrorText>{errors.preferences?.accountingBasis?.toString()}</ErrorText>
              </div>
            </div>
          </section>

          {/* Juridisch */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Juridisch</h2>
            <div className="space-y-2">
              <Checkbox
                label="Ik ga akkoord met de Algemene Voorwaarden"
                {...register("legal.acceptTerms")}
                onChange={(e) => {
                  methods.setValue("legal.acceptTerms", (e.target as HTMLInputElement).checked, { shouldDirty: true, shouldValidate: true });
                }}
              />
              <Checkbox
                label="Ik ga akkoord met de Privacyverklaring"
                {...register("legal.acceptPrivacy")}
                onChange={(e) => {
                  methods.setValue("legal.acceptPrivacy", (e.target as HTMLInputElement).checked, { shouldDirty: true, shouldValidate: true });
                }}
              />
              <Checkbox
                label="Schrijf me in voor de nieuwsbrief (optioneel)"
                {...register("legal.newsletterOptIn")}
                onChange={(e) => {
                  methods.setValue("legal.newsletterOptIn", (e.target as HTMLInputElement).checked, { shouldDirty: true });
                }}
              />
              <div className="text-xs opacity-80 mt-2">
                We verwerken je gegevens conform GDPR. Je kunt inzage en export opvragen in het portaal.
              </div>
              <div className="text-xs text-red-300">
                {errors.legal?.acceptTerms?.message || errors.legal?.acceptPrivacy?.message}
              </div>
            </div>
          </section>

          {/* hCaptcha */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Beveiliging</h2>
            {!SITEKEY ? (
              <p className="text-red-300">
                NEXT_PUBLIC_HCAPTCHA_SITEKEY ontbreekt. Stel deze env var in om door te gaan.
              </p>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <HCaptcha
                  sitekey={SITEKEY}
                  onVerify={(token) => {
                    methods.setValue("hcaptchaToken", token, { shouldValidate: true });
                    setCaptchaReady(true);
                  }}
                  onExpire={() => {
                    methods.setValue("hcaptchaToken", "", { shouldValidate: true });
                    setCaptchaReady(false);
                  }}
                />
                <ErrorText>{errors.hcaptchaToken?.toString()}</ErrorText>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                try {
                  const data = methods.getValues();
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
                } catch {}
              }}
              className="rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 transition"
            >
              Concept opslaan
            </button>
            <button
              type="submit"
              disabled={!(isValid && !!methods.watch("hcaptchaToken") && captchaReady && !isSubmitting)}
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                isValid && !!methods.watch("hcaptchaToken") && captchaReady && !isSubmitting
                  ? "bg-brand-accent text-white hover:opacity-90"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              Naar Stripe-checkout
            </button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
