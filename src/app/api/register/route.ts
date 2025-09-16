import { NextResponse } from "next/server";
import { createServerAdminClient } from "@/lib/supabase/client";
import { z } from "zod";

/**
 * Validatie van de registratie data
 */
const RegistrationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(6),
  roleTitle: z.string().optional(),
  organizationName: z.string().min(2),
  subdomain: z.string().regex(/^[a-z0-9-]{3,32}$/),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error }, { status: 400 });
    }

    const { email, firstName, lastName, phone, roleTitle, organizationName, subdomain } =
      parsed.data;

    const supabase = createServerAdminClient();

    // 1. Maak auth user
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (authErr || !authUser.user) {
      return NextResponse.json({ error: authErr?.message || "Failed to create user" }, { status: 500 });
    }

    const userId = authUser.user.id;

    // 2. Maak organisatie aan
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: organizationName,
        subdomain,
        plan: "trial",
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagen
      })
      .select("id")
      .single();

    if (orgErr || !org) {
      return NextResponse.json({ error: orgErr?.message || "Failed to create organization" }, { status: 500 });
    }

    // 3. Koppel profiel
    const { error: profErr } = await supabase.from("profiles").insert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      phone,
      role_title: roleTitle,
    });

    if (profErr) {
      return NextResponse.json({ error: profErr.message }, { status: 500 });
    }

    // 4. Membership admin
    const { error: memErr } = await supabase.from("memberships").insert({
      user_id: userId,
      organization_id: org.id,
      role: "admin",
    });

    if (memErr) {
      return NextResponse.json({ error: memErr.message }, { status: 500 });
    }

    // 5. Log registratie
    await supabase.from("registrations").insert({
      email,
      organization_id: org.id,
    });

    return NextResponse.json({ success: true, organizationId: org.id }, { status: 201 });
  } catch (e: any) {
    console.error("Register error:", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
