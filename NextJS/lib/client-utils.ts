import "client-only";
// Add util functions that should only be run in client components. Importing these in server components will throw an error.
// For more info on how to avoid poisoning your server/client components: https://www.youtube.com/watch?v=BZlwtR9pDp4

/*
 * Note: When developing you may get an error pointing to this file, with the message:
 *
 *   "You're importing a component that imports client-only.
 *   It only works in a Client Component but none of its parents
 *   are marked with "use client", so they're Server Components by default."
 *
 * This error likely means you imported a function from this file (which contains only client-side functions)
 * into a server component. Perhaps you forgot to mark your new component as a client component with the
 * "use client" directive!
 */

import { env } from "@/env.mjs";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./schema";

// Function to access Supabase from Client Components, which run in the browser.

/*
 * Note: You should create a new client for every route! On the client,
 * createBrowserClient already uses a singleton pattern, so you only ever
 * create one instance, no matter how many times you call your
 * createClient function.
 */

export const createBrowserSupabaseClient = () => {
  // Injects type dependencies from database schema (<Database>)
  const supabaseClient = createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return supabaseClient;
};
