import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import FlowCanvas from "./flowcanvas";

export default async function Dashboard() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <FlowCanvas />
  );
}
