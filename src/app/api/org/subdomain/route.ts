import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * ENV vereist:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - (optioneel) STRIPE_SECRET_KEY  → om customer.metadata.subdomain te syncen
 *
 * Database-vereisten (reeds aangemaakt in jouw migraties):
 * - public.organizations (kolommen: id, subdomain, stripe_customer_id, status, plan, ...)
 * - public.memberships (kolommen: organization_id, profile_id, role)
 * - functies: public.is_valid_subdomain(text), public.is_reserved_subdomain(text)
 * - RLS policies zoals aangeleverd (alleen leden zien org, alleen admin updaten)
 */

export const dynamic = "force-dynamic";

/* ----------------------------- Helpers ----------------------------- */

// Maak een Supabase client met *RLS als ingelogde gebruiker* door cookies → Authorization header te geven
function supabaseFromReq(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Supabase/Auth v2 cookies (naam kan variëren). We proberen via Authorization en sb-access-token.
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : (req.cookies.get("sb-access-token")?.value ?? req.cookies.get("access-token")?.value ?? "");

  return createClient(url, anon, {
    global: {
      headers: bearer ? { Authorization: `Bearer ${bearer}` } : {}
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

// Eenvoudige in-memory rate limiter per (user or ip), 1 actie per 10s
const RATE_MS = 10_000;
const buckets = new Map<string, number>();
function throttle(key: string) {
  const now = Date.now();
  const last = buckets.get(key) ?? 0;
  if (now - last < RATE_MS) return false;
  buckets.set(key, now);
  return true;
}

const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,30})[a-z0-9]$/;

/* ------------------------------- GET --------------------------------
   Check beschikbaarheid: /api/org/subdomain?candidate=acme
   ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseFromReq(req);
    const { searchParams } = new URL(req.url);
    const candidate = (searchParams.get("candidate") || "").toLowerCase().trim();

    if (!candidate) {
      return NextResponse.json({ ok: false, available: false, reason: "missing_candidate" }, { status: 400 });
    }

    if (!SUBDOMAIN_REGEX.test(candidate)) {
      return NextResponse.json({ ok: false, available: false, reason: "invalid_format" }, { status: 200 });
    }

    // Reserved list check (via DB functie, of fallback in code)
    const { data: reservedRes, error: reservedErr } = await supabase
      .rpc("is_reserved_subdomain", { sub: candidate });

    if (!reservedErr && reservedRes === true) {
      return NextResponse.json({ ok: true, available: false, reason: "reserved" }, { status: 200 });
    }

    // Bestaat al?
    const { data: taken, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("subdomain", candidate)
      .limit(1);

    if (error) {
      return NextResponse.json({ ok: false, available: false, reason: "db_error", details: error.message }, { status: 500 });
    }

    const available = !taken || taken.length === 0;
    return NextResponse.json({ ok: true, available, reason: available ? null : "taken" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, available: false, reason: "internal_error" }, { status: 500 });
  }
}

/* ------------------------------- POST -------------------------------
   Claim subdomein:
   body: { orgId: string, subdomain: string }
   Vereist: gebruiker is admin van org (RLS policy + expliciete check).
   ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseFromReq(req);

    // Auth check: lees je eigen profiel-id via RLS (auth.uid()) door eenvoudige query.
    // (We kunnen ook getUser() via auth helpers doen; hier houden we het bij RLS)
    // We proberen een snelle call die auth.uid() vereist: select id from profiles where id = auth.uid()
    const { data: me } = await supabase.from("profiles").select("id").eq("id", (null as any)).maybeSingle();
    // Bovenstaande truc werkt niet altijd zonder auth-helpers; alternatieve aanpak:
    // We doen een actie die lidmaatschap vereist (zie verderop). Hier beperken we rate-key op IP.
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    if (!throttle(ip)) {
      return NextResponse.json({ ok: false, error: "too_many_requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => null) as { orgId?: string; subdomain?: string } | null;
    const orgId = (body?.orgId || "").trim();
    const desired = (body?.subdomain || "").toLowerCase().trim();

    if (!orgId || !desired) {
      return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
    }

    if (!SUBDOMAIN_REGEX.test(desired)) {
      return NextResponse.json({ ok: false, error: "invalid_format" }, { status: 400 });
    }

    // Reserved?
    const { data: isRes } = await supabase.rpc("is_reserved_subdomain", { sub: desired });
    if (isRes === true) {
      return NextResponse.json({ ok: false, error: "reserved" }, { status: 200 });
    }

    // Bestaat al?
    {
      const { data: exists, error: exErr } = await supabase
        .from("organizations")
        .select("id")
        .eq("subdomain", desired)
        .limit(1);

      if (exErr) return NextResponse.json({ ok: false, error: "db_error", details: exErr.message }, { status: 500 });
      if (exists && exists.length > 0) {
        return NextResponse.json({ ok: false, error: "taken" }, { status: 200 });
      }
    }

    // Is aanvrager admin in deze org? (RLS enforced)
    // We gebruiken een query op memberships die *alleen* data teruggeeft als de caller lid is;
    // en we checken expliciet op role = 'admin'.
    const { data: canAdmin, error: roleErr } = await supabase
      .from("memberships")
      .select("role")
      .eq("organization_id", orgId)
      .limit(1);

    if (roleErr) {
      return NextResponse.json({ ok: false, error: "db_error", details: roleErr.message }, { status: 500 });
    }
    const isAdmin = (canAdmin ?? []).some(r => r.role === "admin");
    if (!isAdmin) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    // Update subdomain
    const { data: orgRow, error: updErr } = await supabase
      .from("organizations")
      .update({ subdomain: desired })
      .eq("id", orgId)
      .select("id, stripe_customer_id")
      .single();

    if (updErr) {
      // constraint fouten (format/reserved) komen hier ook terecht
      return NextResponse.json({ ok: false, error: "update_failed", details: updErr.message }, { status: 400 });
    }

    // Optioneel: Stripe customer metadata.subdomain bijwerken
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && orgRow?.stripe_customer_id) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
        await stripe.customers.update(orgRow.stripe_customer_id, {
          metadata: { subdomain: desired }
        });
      } catch (e) {
        // Niet fataal; we geven waarschuwing terug
        return NextResponse.json({ ok: true, warning: "stripe_metadata_update_failed" }, { status: 200 });
      }
    }

    return NextResponse.json({ ok: true, subdomain: desired }, { status: 200 });
  } catch (e: any) {
    console.error("SUBDOMAIN_SET_ERROR", e?.message || e);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
