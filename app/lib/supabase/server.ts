import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (toSet: { name: string; value: string; options?: object }[]) => {
          for (const { name, value, options } of toSet) {
            store.set({ name, value, ...options });
          }
        },
      },
    }
  );
}
