import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/app/lib/supabase/server";
import { SignOutButton } from "./signout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="border-b border-[var(--line)] bg-[var(--cream-soft)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-lg text-[var(--brown-deep)]">
              Christami · Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--brown)]">
              <Link href="/admin" className="hover:text-[var(--olive)]">
                Leads
              </Link>
              <Link href="/admin/cotizador" className="hover:text-[var(--olive)]">
                Cotizador
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
            <span>{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
