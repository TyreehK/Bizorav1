import { NextRequest, NextResponse } from "next/server";
import { createServerAdminClient } from "../../../lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Naam, e-mail en bericht zijn verplicht." }, { status: 400 });
    }

    // Optioneel: wegschrijven in Supabase (tabel: contact_messages)
    try {
      const supabase = createServerAdminClient();
      await supabase.from("contact_messages").insert({
        name, email, subject, message,
        meta: { ua: req.headers.get("user-agent") || "" }
      });
    } catch (e) {
      // Niet fataal — we willen de gebruiker niet blokkeren
      console.error("[contact] supabase insert fail:", (e as any)?.message || e);
    }

    // Non-blocking log
    console.log("[contact] new message:", { name, email, subject });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[contact] fatal:", e?.message || e);
    return NextResponse.json({ error: "Serverfout" }, { status: 500 });
  }
}
