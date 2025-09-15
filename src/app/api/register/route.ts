// src/app/api/register/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

/**
 * Vereiste ENV variabelen:
 * - NEXT_PUBLIC_APP_URL (bv. http://localhost:3000 of je Vercel URL)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY  (SERVER-ONLY)
 * - HCAPTCHA_SECRET
 * - STRIPE_SECRET_KEY
 * - STRIPE_PRICE_START
 * - STRIPE_PRICE_FLOW
 * - STRIPE_PRICE_PRO
 * - STRIPE_PRICE_ENTERPRISE
 */

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  flow: process.env.STRIPE_PRICE_FLOW,
  pro: process.env.STRIPE_PRICE_PRO,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE
};

// Supabase admin client (RLS bypass voor server logic)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

/* ----------------------------- Rate Limiting ------------------------------ */
// Eenvoudige in-memory rate limit (10 req / 10 min per IP)
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;
type Bucket = { count: number; start: number };
const rateStore = new Map<string, Bucket>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const b = rateStore.get(ip);
  if (!b) {
    rateStore.set(ip, { count: 1, start: now });
    return false;
  }
  if (now - b.start > WINDOW_MS) {
    rateStore.set(ip, { count: 1, start: now });
    return false;
  }
  if (b.count >= LIMIT) return true;
  b.count++;
  return false;
}

function getClientIP(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

/* ----------------------- Disposable email blokkade ------------------------ */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","10minutemail.com","guerrillamail.com","tempmail.com",
  "yopmail.com","trashmail.com","sharklasers.com","getnada.com",
  "dispostable.com","maildrop.cc","mintemail.com","throwawaymail.com"
]);

function isDisposableEmail(email: string) {
  const at = email.lastIndexOf("@");
  if (at === -1) return true;
  const domain = email.slice(at + 1).toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}

/* --------------------------------- Zod ----------------------------------- */
// Registratie (stap 1) conform blueprint
const PersonalSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  roleTitle: z.string().max(80).optional().nullable(),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/, "Ongeldig telefoonnummer (E.164)")
});

const AccountSchema = z.object({
  email: z.string().email(),
  communicationsOptIn: z.boolean().optional().default(false)
});

const CompanySchema = z.object({
  companyName: z.string().min(2),
  kvk: z.string().min(4).max(16).optional().nullable(),
  vat: z.string().max(32).optional().nullable(),
  industry: z.string().max(60).optional().nullable(),
  companySize: z.string().max(40).optional().nullable()
});

const AddressSchema = z.object({
  street: z.string().min(2),
  houseNumber: z.string().min(1),
  houseNumberAddition: z.string().optional().nullable(),
  postcode: z.string().regex(/^[1-9]\d{3}\s?[A-Za-z]{2}$/, "Ongeldige NL-postcode").optional().nullable(),
  city: z.string().min(2),
  country: z.string().min(2).default("NL"),
  invoiceAddressDifferent: z.boolean().default(false),
  invoiceAddress: z
    .object({
      street: z.string().min(2),
      houseNumber: z.string().min(1),
      houseNumberAddition: z.string().optional().nullable(),
      postcode: z.string().regex(/^[1-9]\d{3}\s?[A-Za-z]{2}$/),
      city: z.string().min(2),
      country: z.string().min(2)
    })
    .optional()
    .nullable()
});

const PreferencesSchema = z.object({
  language: z.enum(["nl", "en"]).default("nl"),
  currency: z.enum(["EUR"]).default("EUR"),
  timezone: z.string().default("Europe/Amsterdam"),
  fiscalYearStartMonth: z.number().int().min(1).max(12).default(1),
  accountingBasis: z.enum(["cash", "accrual"]).default("accrual")
});

const LegalSchema = z.object({
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Je moet akkoord gaan met de voorwaarden" }) }),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: "Je moet akkoord gaan met de privacyverklaring" }) }),
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
  hcaptchaToken: z.string().min(10)
});

type RegistrationInput = z.infer<typeof RegistrationSchema>;

function normalizePlan(input: string): "start"|"flow"|"pro"|"enterprise" {
  const p = input.toLowerCase();
  if (p === "start" || p === "flow" || p === "pro" || p === "enterprise") return p;
  return "start";
}

/* ----------------------------- hCaptcha check ----------------------------- */
async function verifyHCaptcha(token: string, ip: string) {
  if (!HCAPTCHA_SECRET) return false;
  const body = new URLSearchParams({
    secret: HCAPTCHA_SECRET,
    response: token,
    remoteip: ip
  });
  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.success;
}

/* --------------------------------- Route --------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);

    // Rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "too_many_requests", message: "Te veel verzoeken. Probeer het later opnieuw." },
        { status: 429 }
      );
    }

    // Parse + validate
    const json = (await req.json()) as unknown;
    const parsed = RegistrationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_error", details: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const input = parsed.data as RegistrationInput;

    const email = input.account.email.toLowerCase().trim();
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "disposable_email", message: "Gebruik een geldig, permanent e-mailadres." },
        { status: 400 }
      );
    }

    // hCaptcha
    const captchaOk = await verifyHCaptcha(input.hcaptchaToken, ip);
    if (!captchaOk) {
      return NextResponse.json(
        { error: "captcha_failed", message: "Captcha validatie mislukt." },
        { status: 400 }
      );
    }

    // Plan + Stripe price id
    const plan = normalizePlan(input.plan);
    const priceId = PLAN_PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "plan_not_configured", message: "Plan niet geconfigureerd op de server." },
        { status: 500 }
      );
    }

    // Insert registratie record (pre_stripe)
    const { data: regData, error: regErr } = await supabase
      .from("registrations")
      .insert({
        email,
        plan,
        payload: input,
        status: "pre_stripe"
      })
      .select("id")
      .single();

    if (regErr || !regData) {
      return NextResponse.json(
        { error: "db_error", message: "Kon registratie niet opslaan.", details: regErr?.message },
        { status: 500 }
      );
    }

    const registrationId = regData.id;

    // Stripe Checkout (subscription + 30 dagen trial)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      success_url: `${APP_URL}/register/success?rid=${registrationId}`,
      cancel_url: `${APP_URL}/register/cancel?rid=${registrationId}`,
      metadata: {
        registration_id: registrationId,
        plan,
        email
      },
      subscription_data: {
        trial_settings: { end_behavior: { missing_payment_method: "pause" } },
        trial_period_days: 30
      },
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_creation: "always",
      customer_email: email,
      client_reference_id: registrationId
    });

    // Bewaar checkout session id (niet fataal als dit stuk faalt)
    await supabase
      .from("registrations")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", registrationId);

    return NextResponse.json(
      {
        ok: true,
        registrationId,
        checkoutUrl: session.url
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { error: "internal_error", message: "Er ging iets mis." },
      { status: 500 }
    );
  }
}
