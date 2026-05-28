"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/app/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await getSupabaseBrowser().auth.signOut();
        router.push("/login");
        router.refresh();
      }}
      className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--brown)] transition hover:bg-[var(--brown-deep)] hover:text-[var(--cream-soft)]"
    >
      Salir
    </button>
  );
}
