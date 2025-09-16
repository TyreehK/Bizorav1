// src/lib/supabase/client.ts
// Eén schone implementatie zonder duplicaten.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Publieke env (browser & server) */
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Server-only env (NOOIT client-side gebruiken) */
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser client:
 * - gebruikt de public anon key
 * - persistSession + autoRefresh aan
 */
export function createBrowserClient(): SupabaseClient {
  if (!PUBLIC_URL || !PUBLIC_ANON) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL of NEXT_PUBLIC_SUPABASE_ANON_KEY ontbreekt. " +
      "Controleer je .env(.local) en Vercel Project Settings."
    );
  }
  return createClient(PUBLIC_URL, PUBLIC_ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Server admin client — gebruikt SERVICE ROLE key (bypasst RLS).
 * Gebruik ALLEEN in server-context (API routes, server actions, webhooks).
 * Nooit importeren in client components!
 */
export function createServerAdminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("[Supabase] createServerAdminClient() mag alleen server-side gebruikt worden.");
  }
  const url = PUBLIC_URL || process.env.SUPABASE_URL;
  const serviceKey = SERVICE_ROLE;
  if (!url || !serviceKey) {
    throw new Error(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY of SUPABASE_URL ontbreekt. " +
      "Zorg dat dit server-only env vars zijn (geen NEXT_PUBLIC_)."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * (Optioneel) Tenant subdomein uit Host header halen.
 * - production: tenant.domein.nl → "tenant"
 * - localhost: returnt null (we kunnen elders pad-based fallback doen)
 */
export function getTenantFromRequest(req: Request): string | null {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  // Pas deze lijst aan je eigen (apex/marketing) domeinen aan:
  const marketing = new Set([
    "localhost",
    "127.0.0.1",
    "bizora.vercel.app",
    "bizora.nl",
    "www.bizora.nl",
  ]);

  if (!hostname || marketing.has(hostname)) return null;

  const parts = hostname.split(".");
  if (parts.length >= 3) {
    // bv. tenant.bizora.nl
    return parts[0].toLowerCase();
  }
  if (parts.length === 2 && !marketing.has(hostname)) {
    // bv. tenant.local
    return parts[0].toLowerCase();
  }
  return null;
}
// Eenvoudige barrel zodat zowel '.../client' als '.../clients' werkt
export * from "./client";
