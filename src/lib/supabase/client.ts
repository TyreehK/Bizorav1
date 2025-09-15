// src/lib/supabase/clients.ts
"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Vereiste env variabelen:
 *
 *  Client-side (exposed):
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 *  Server-side (NOOIT naar client gelekt):
 *    - SUPABASE_SERVICE_ROLE_KEY
 *
 *  Optioneel:
 *    - NEXT_PUBLIC_APP_URL (handig voor redirects)
 */

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser client — gebruikt anon key (RLS enforced)
 * Gebruik in client components, of in server components die client features hydrateren.
 */
export function createBrowserClient(): SupabaseClient {
  if (!PUBLIC_URL || !PUBLIC_ANON) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL of NEXT_PUBLIC_SUPABASE_ANON_KEY ontbreekt. " +
      "Controleer je .env en Vercel Project Settings."
    );
  }
  return createClient(PUBLIC_URL, PUBLIC_ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

/**
 * Server admin client — gebruikt SERVICE ROLE key (bypasst RLS)
 * Gebruik ALLEEN in server-context (API routes, server actions, webhooks).
 * Nooit importeren in client components!
 */
export function createServerAdminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("[Supabase] createServerAdminClient() mag alleen server-side gebruikt worden.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY of SUPABASE_URL ontbreekt. " +
      "Zorg dat deze alleen als SERVER env variabelen zijn ingesteld."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

/**
 * Haal tenant (subdomein) uit de Host header.
 * - production: tenant.domein.nl → "tenant"
 * - localhost: gebruik pad-based routing (we bouwen elders een fallback)
 */
export function getTenantFromRequest(req: Request): string | null {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  // Pas deze lijst aan je eigen domeinen aan:
  const marketing = new Set(["localhost", "127.0.0.1", "bizora.vercel.app", "bizora.nl", "www.bizora.nl"]);

  if (!hostname || marketing.has(hostname)) return null;

  const parts = hostname.split(".");
  if (parts.length >= 3) {
    // bv. tenant.bizora.nl
    return parts[0].toLowerCase();
  }
  // 2-delig domein dat niet in marketing-lijst staat kan ook tenant zijn (bv. tenant.local)
  if (parts.length === 2 && !marketing.has(hostname)) {
    return parts[0].toLowerCase();
  }
  return null;
}
