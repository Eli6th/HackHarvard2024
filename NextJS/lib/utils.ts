// Add util functions that can be used in both server and client components.
// For more info on how to avoid poisoning your server/client components: https://www.youtube.com/watch?v=BZlwtR9pDp4
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Database } from "./schema";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// helper to make it easier to conditionally add Tailwind CSS classes
// https://ui.shadcn.com/docs/installation
// More usage: https://www.neorepo.com/blog/how-to-build-a-button-with-nextjs-and-shadcn-ui

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to pause execution of an async function for the specified number of milliseconds. Useful for debugging (e.g. loading states)
// https://alvarotrigo.com/blog/wait-1-second-javascript/
export function delay(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// Supabase query to retrieve user profile.
// This can be used in both client and server components, just pass in the corresponding supabase client as a prop.
// Also note the structure of the function typing and return, which ensures that errors from supabase MUST be handled whenever this query is used in a component.
export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<{ profile: Profile; error: null } | { profile: null; error: Error }> {
  const { data, error } = await supabase.from("profiles").select().eq("id", user.id);

  if (error) {
    return {
      profile: null,
      error: new Error(error.message),
    };
  }

  if (data.length !== 1) {
    return {
      profile: null,
      error: new Error("There are duplicate UUIDs. Please contact system administrator"),
    };
  }

  const profileData = data[0];

  // Note: We normally wouldn't need to check this case, but because ts noUncheckedIndexedAccess is enabled in tsconfig, we have to.
  // noUncheckedIndexedAccess provides better typesafety at cost of jumping through occasional hoops.
  // Read more here: https://www.totaltypescript.com/tips/make-accessing-objects-safer-by-enabling-nouncheckedindexedaccess-in-tsconfig
  // https://github.com/microsoft/TypeScript/pull/39560
  if (!profileData) {
    return {
      profile: null,
      error: new Error("Profile data not found."),
    };
  }

  return { profile: profileData, error: null };
}
