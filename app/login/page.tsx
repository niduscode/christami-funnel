"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/app/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cream)] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--cream-soft)] p-8 shadow-[0_8px_24px_rgba(58,38,20,0.08)]">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]">Admin Christami</div>
          <h1 className="mt-2 font-serif text-2xl text-[var(--brown-deep)]">Iniciar sesión</h1>
        </div>

        {step === "email" ? (
          <form onSubmit={requestOtp} className="mt-6 grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--brown)]">Email autorizado</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 focus:border-[var(--olive)] focus:outline-none focus:ring-2 focus:ring-[var(--olive)]/20"
              />
            </label>
            <button disabled={loading} className="rounded-full bg-[var(--olive)] py-2.5 font-semibold text-[var(--cream-soft)] transition hover:bg-[var(--olive-deep)] disabled:opacity-60">
              {loading ? "Enviando…" : "Enviar código"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-6 grid gap-3">
            <p className="text-sm text-[var(--muted)]">Te enviamos un código a <strong>{email}</strong>.</p>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--brown)]">Código de 6 dígitos</span>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                inputMode="numeric"
                pattern="\d{6}"
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 tracking-[0.4em] focus:border-[var(--olive)] focus:outline-none focus:ring-2 focus:ring-[var(--olive)]/20"
              />
            </label>
            <button disabled={loading} className="rounded-full bg-[var(--olive)] py-2.5 font-semibold text-[var(--cream-soft)] transition hover:bg-[var(--olive-deep)] disabled:opacity-60">
              {loading ? "Verificando…" : "Entrar"}
            </button>
            <button type="button" onClick={() => setStep("email")} className="text-xs text-[var(--muted)] underline">
              Usar otro email
            </button>
          </form>
        )}

        {error && <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      </div>
    </main>
  );
}
