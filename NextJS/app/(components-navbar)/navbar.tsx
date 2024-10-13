import { createServerSupabaseClient } from "@/lib/server-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {user ? (
        <Link href="/dashboard" className="text-xl font-medium transition-colors">
          Query on Reality
        </Link>
      ) : (
        <Link href="/" className="text-xl font-medium transition-colors">
          Query on Reality
        </Link>
      )}
    </nav>
  );
}
