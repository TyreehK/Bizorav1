import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// FIX: relatieve import naar client.ts (server admin client)
import { createServerAdminClient } from "../../../../lib/supabase/client";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/* ----------------------------- Helpers ----------------------------- */

type AppSubStatus = "trialing" | "active" | "past_due" | "canceled" | "read_only" | "trial_will_end";

function mapStripeSubStatus(s: Stripe.Subscription.Status): AppSubStatus {
  switch (s) {
    case "trialing": return "trialing";
    case "active": return "active";
    case "past_due": return "past_due";
    case "canceled": return "canceled";
    default: return "read_only";
  }
}

function seatLimitForPlan(plan: string): number | null {
  const p = plan.toLowerCase();
  if (p === "start") return 1;
  if (p === "flow") return 3;
  if (p === "pro") return 10;
  if (p === "enterprise") return null;
  return 1;
}

async function upsertSubscriptionForOrg(supabase: any, orgId: string, sub: Stripe.Subscription, planFallback?: string) {
  const status = mapStripeSubStatus(sub.status);
  const trial_end = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
  const current_period_start = new Date(sub.current_period_start * 1000).toISOString();
  const current_period_end = new Date(sub.current_period_end * 1000).toISOString();
  const cancel_at = sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null;
  const canceled_at = sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null;

  const plan = planFallback ?? "start";

  const { error } = await supabase
    .from("subscriptions")
    .upsert({
      org_id: orgId,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
      plan,
      status,
      current_period_start,
      current_period_end,
      trial_end,
      cancel_at,
      canceled_at
    }, { onConflict: "org_id" });

  if (error) {
    console.error("UPSERT_SUBSCRIPTION_ERROR", error);
  }
}

/* ------------------------------- Route ------------------------------ */

export async function POST(req: NextRequest) {
  const supabase = createServerAdminClient();

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig || !endpointSecret) throw new Error("Missing signature/secret");
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("STRIPE_WEBHOOK_VERIFY_FAIL", err?.message);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registration_id;
        const plan = (session.metadata?.plan || "start").toLowerCase();

        let subscription: Stripe.Subscription | null = null;
        if (session.subscription) {
          subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        }

        if (registrationId) {
          await supabase
            .from("registrations")
            .update({
              status: "converted",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string
            })
            .eq("id", registrationId);
        }

        const { data: reg } = registrationId
          ? await supabase.from("registrations").select("email, plan, payload").eq("id", registrationId).single()
          : { data: null as any };

        const email = (reg?.email ?? session.customer_details?.email ?? "").toLowerCase();
        const companyName = reg?.payload?.company?.companyName || "Nieuw bedrijf";

        const { data: org, error: orgErr } = await supabase
          .from("organizations")
          .insert({
            name: companyName,
            subdomain: null,
            plan,
            status: "trialing",
            trial_end: subscription?.trial_end ? new Date(subscription.trial_end * 1000) : null,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            seat_limit: seatLimitForPlan(plan),
            timezone: "Europe/Amsterdam",
            currency: "EUR",
            locale: "nl-NL",
            bookyear_start: reg?.payload?.preferences?.fiscalYearStartMonth ?? 1,
            accounting_basis: reg?.payload?.preferences?.accountingBasis ?? "accrual"
          })
          .select("id")
          .single();

        if (orgErr || !org) {
          console.error("ORG_CREATE_ERROR", orgErr);
          break;
        }

        const orgId = org.id as string;

        let profileId: string | null = null;
        if (email) {
          const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .limit(1)
            .maybeSingle();

          if (existing?.id) {
            profileId = existing.id;
          } else {
            const { data: created, error: profErr } = await supabase
              .from("profiles")
              .insert({
                email,
                first_name: reg?.payload?.personal?.firstName ?? null,
                last_name: reg?.payload?.personal?.lastName ?? null,
                phone: reg?.payload?.personal?.phone ?? null,
                locale: reg?.payload?.preferences?.language === "en" ? "en-GB" : "nl-NL"
              })
              .select("id")
              .single();
            if (profErr) console.error("PROFILE_CREATE_ERROR", profErr);
            profileId = created?.id ?? null;
          }
        }

        if (profileId) {
          const { error: memErr } = await supabase.from("memberships").insert({
            organization_id: orgId,
            profile_id: profileId,
            role: "admin",
            status: "active"
          });
          if (memErr) console.error("MEMBERSHIP_CREATE_ERROR", memErr);
        }

        if (subscription) {
          await upsertSubscriptionForOrg(supabase, orgId, subscription, plan);
        } else if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await upsertSubscriptionForOrg(supabase, orgId, sub, plan);
        }

        break;
      }

      case "customer.subscription.trial_will_end": {
        const sub = event.data.object as Stripe.Subscription;
        const { data: orgSub } = await supabase
          .from("subscriptions")
          .select("org_id")
          .eq("stripe_subscription_id", sub.id)
          .maybeSingle();
        if (orgSub?.org_id) {
          await upsertSubscriptionForOrg(supabase, orgSub.org_id, sub);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        let orgId: string | null = null;
        {
          const { data: found } = await supabase
            .from("subscriptions")
            .select("org_id")
            .eq("stripe_subscription_id", sub.id)
            .maybeSingle();
          orgId = found?.org_id ?? null;
        }
        if (!orgId) {
          const { data: org } = await supabase
            .from("organizations")
            .select("id")
            .eq("stripe_subscription_id", sub.id)
            .maybeSingle();
          orgId = org?.id ?? null;
        }

        if (orgId) {
          await upsertSubscriptionForOrg(supabase, orgId, sub);
          if (sub.status === "active") {
            await supabase.from("organizations").update({ status: "active" }).eq("id", orgId);
          }
        }

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const { data: found } = await supabase
          .from("subscriptions")
          .select("org_id")
          .eq("stripe_subscription_id", sub.id)
          .maybeSingle();

        if (found?.org_id) {
          await upsertSubscriptionForOrg(supabase, found.org_id, sub);
          await supabase.from("organizations").update({ status: "suspended" }).eq("id", found.org_id);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);

          const { data: found } = await supabase
            .from("subscriptions")
            .select("org_id")
            .eq("stripe_subscription_id", sub.id)
            .maybeSingle();

          if (found?.org_id) {
            await upsertSubscriptionForOrg(supabase, found.org_id, sub);
            await supabase.from("organizations").update({ status: "active" }).eq("id", found.org_id);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);

          const { data: found } = await supabase
            .from("subscriptions")
            .select("org_id")
            .eq("stripe_subscription_id", sub.id)
            .maybeSingle();

          if (found?.org_id) {
            await upsertSubscriptionForOrg(supabase, found.org_id, sub);
          }
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK_HANDLER_ERROR", (err && err.message) || err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }
}
