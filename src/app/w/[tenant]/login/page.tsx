import { notFound } from "next/navigation";

type Props = {
  params: { tenant: string };
  searchParams: { [k: string]: string | string[] | undefined };
};

export default function TenantLoginPage({ params, searchParams }: Props) {
  const { tenant } = params;
  if (!tenant || typeof tenant !== "string") return notFound();

  const plan = typeof searchParams?.plan === "string" ? searchParams.plan : undefined;

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold">Inloggen — {tenant}</h1>
      {plan && <p className="text-sm opacity-80 mt-1">Voorkeuze plan: <strong>{plan}</strong></p>}
      <p className="opacity-90 mt-4">
        Hier komt de **workspace login** met e-mail + wachtwoord (Supabase), 2FA en “wachtwoord vergeten”.
      </p>

      <div className="mt-6 rounded-2xl p-4 bg-white/5 border border-white/10">
        <p className="text-sm opacity-80">
          In de volgende stap sluiten we Supabase Auth aan en voegen we RLS/tenancy toe.
        </p>
      </div>
    </main>
  );
}
