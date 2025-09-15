import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: Request) {
  const { event, session } = await request.json().catch(() => ({ event: null, session: null }));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Bij SIGNED_IN of TOKEN_REFRESHED schrijven we de sessie-cookies
  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    if (session?.access_token && session?.refresh_token) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }
  }

  // Bij SIGNED_OUT ruimen we cookies op
  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
