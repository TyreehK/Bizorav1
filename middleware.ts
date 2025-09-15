import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  matcher: ["/dashboard/:path*", "/setup"]
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Zorgt dat access/refresh cookies worden ververst en beschikbaar zijn
  const supabase = createMiddlewareClient({ req, res });

  // Haal sessie op uit cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isSetup = url.pathname.startsWith("/setup");

  // Niet ingelogd? Dan mag je niet naar dashboard of setup.
  if (!session && (isDashboard || isSetup)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Vanaf hier is er een sessie (user is ingelogd) of de route is publiek.

  // Alleen als user ingelogd is, checken we de org & setup gating
  if (session) {
    const userId = session.user.id;

    // Vind (eerste) membership van deze gebruiker
    const { data: membership } = await supabase
      .from("memberships")
      .select("organization_id")
      .eq("profile_id", userId)
      .limit(1)
      .maybeSingle();

    // Geen org → forceer setup (onboarding)
    if (!membership?.organization_id) {
      if (isDashboard) {
        url.pathname = "/setup";
        return NextResponse.redirect(url);
      }
      return res;
    }

    // Check of setup_complete
    const { data: org } = await supabase
      .from("organizations")
      .select("setup_complete")
      .eq("id", membership.organization_id)
      .maybeSingle();

    const isSetupComplete = org?.setup_complete === true;

    // Blokkeer dashboard tot setup klaar is
    if (!isSetupComplete && isDashboard) {
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
    // Als setup al klaar is, stuur /setup → /dashboard
    if (isSetupComplete && isSetup) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return res;
}
