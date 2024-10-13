import { Separator } from "@/components/ui/separator";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { getUserProfile } from "@/lib/utils";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

function SettingsError({ message }: { message: string }) {
  return (
    <>
      <h3 className="text-lg font-medium">Error</h3>
      <p>{message}</p>
    </>
  );
}

export default async function Settings() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { profile, error } = await getUserProfile(supabase, user);

  if (error) {
    return <SettingsError message={error.message} />;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
        </div>
        <Separator />
        <ProfileForm profile={profile} />
      </div>
    </>
  );
}
