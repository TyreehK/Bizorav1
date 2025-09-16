"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

const RegistrationSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
  firstName: z.string().min(2, "Minimaal 2 tekens"),
  lastName: z.string().min(2, "Minimaal 2 tekens"),
  phone: z.string().min(6, "Telefoonnummer is te kort"),
  organizationName: z.string().min(2, "Bedrijfsnaam is verplicht"),
  subdomain: z.string().regex(/^[a-z0-9-]{3,32}$/, "Ongeldig subdomein"),
});

type RegistrationInput = z.infer<typeof RegistrationSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchema),
    mode: "onChange",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: RegistrationInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registratie mislukt");
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="max-w-xl mx-auto py-16 px-6 text-center text-white bg-black">
        <h1 className="text-3xl font-bold mb-4">✅ Registratie gelukt</h1>
        <p className="mb-6 text-gray-300">
          Je account en organisatie zijn aangemaakt. Je kunt nu inloggen.
        </p>
        <Button asChild variant="primary">
          <a href="/login">Naar login</a>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-6 bg-black text-white rounded-xl shadow-xl">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                step >= s ? "bg-white text-black" : "border-gray-600 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-0.5 ${
                  step > s ? "bg-white" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>
              <FormField label="Voornaam" error={methods.formState.errors.firstName?.message}>
                <Input {...methods.register("firstName")} />
              </FormField>
              <FormField label="Achternaam" error={methods.formState.errors.lastName?.message}>
                <Input {...methods.register("lastName")} />
              </FormField>
              <FormField label="E-mail" error={methods.formState.errors.email?.message}>
                <Input type="email" {...methods.register("email")} />
              </FormField>
              <FormField label="Telefoonnummer" error={methods.formState.errors.phone?.message}>
                <Input {...methods.register("phone")} />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Bedrijfsgegevens</h2>
              <FormField label="Bedrijfsnaam" error={methods.formState.errors.organizationName?.message}>
                <Input {...methods.register("organizationName")} />
              </FormField>
              <FormField label="Subdomein" error={methods.formState.errors.subdomain?.message}>
                <div className="flex items-center">
                  <Input {...methods.register("subdomain")} className="flex-1" />
                  <span className="ml-2 text-gray-400">.bizora.nl</span>
                </div>
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Bevestiging</h2>
              <p className="text-gray-400 mb-4">
                Controleer je gegevens en rond de registratie af. Daarna maken we je account en organisatie aan.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><strong>Naam:</strong> {methods.getValues("firstName")} {methods.getValues("lastName")}</li>
                <li><strong>E-mail:</strong> {methods.getValues("email")}</li>
                <li><strong>Telefoon:</strong> {methods.getValues("phone")}</li>
                <li><strong>Bedrijf:</strong> {methods.getValues("organizationName")}</li>
                <li><strong>Subdomein:</strong> {methods.getValues("subdomain")}.bizora.nl</li>
              </ul>
            </>
          )}

          {error && (
            <div className="rounded border border-red-500 bg-red-900/40 p-3 text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={prevStep}>
                Vorige
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" variant="primary" onClick={nextStep}>
                Volgende
              </Button>
            ) : (
              <Button type="submit" variant="primary" loading={loading}>
                Registreer
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
