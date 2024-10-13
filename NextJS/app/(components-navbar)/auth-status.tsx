import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { getUserProfile } from "@/lib/utils";
import Link from "next/link";
import UserNav from "./user-nav";

export default async function AuthStatus() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Log in</Link>
      </Button>
    );
  }

  const { profile, error } = await getUserProfile(supabase, user);

  if (error) {
    console.error(error);

    return;
  }

  return <UserNav profile={profile} />;
}
