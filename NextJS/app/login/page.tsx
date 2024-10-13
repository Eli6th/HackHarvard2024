import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import UserAuthForm from "./user-auth-form";

export default async function LoginPage() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Users who are already signed in should be redirected to dashboard
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign up/log in</h1>
        <p className="text-sm text-muted-foreground">Enter your email and password below to sign in or create a new account</p>
      </div>
      <UserAuthForm />
    </div>
  );
}
