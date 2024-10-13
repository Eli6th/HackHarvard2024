import "server-only";
// Add util functions that should only be run in server components. Importing these in client components will throw an error.
// For more info on how to avoid poisoning your server/client components: https://www.youtube.com/watch?v=BZlwtR9pDp4
import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { type Database } from "./schema";

/*
 * Note: When developing you may get an error pointing to this file, with the message:
 *
 *  "You're importing a component that needs server-only. That only works
 *  in a Server Component which is not supported in the pages/ directory."
 *
 * This error likely means you imported a function from this file (which contains only server-side functions)
 * into a client component. Perhaps your new component is imported in a client component, which would
 * automatically mark it as a client component (even without the "use client" directive)!
 */

// Function to access Supabase from Server Components, Server Actions, and Route Handlers, which run only on the server.
/*
 * Note: You should create a new client for every route! On the server, it basically configures a fetch call.
 * You need to reconfigure the fetch call anew for every request to your server, because you need the cookies from the request.
 */
export const createServerSupabaseClient = () => {
  /*
    Note that cookies is called before any calls to Supabase, which opts fetch calls out of Next.js's caching.
    This is important for authenticated data fetches, to ensure that users get access only to their own data.

    See the Next.js docs to learn more about opting out of data caching:
    https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching
  */
  const cookieStore = cookies();

  // Injects type dependencies from database schema (<Database>)
  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
  return supabase;

  /*
    The cookies object lets the Supabase client know how to access the cookies,
    so it can read and write the user session data. To make @supabase/ssr
    framework-agnostic, the cookies methods aren't hard-coded.
    These utility functions adapt @supabase/ssr's cookie handling for Next.js.
  */

  /*
    The set and remove methods for the server client need error handlers,
    because Next.js throws an error if cookies are set from Server Components.
    You can safely ignore this error because we've set up middleware
    to write refreshed cookies to storage.
  */
};

// Function for refreshing the Supabase session in Next.js middleware
/*
  Since Server Components can't write cookies, you need middleware to
  refresh expired Auth tokens and store them.

  The middleware is responsible for:
    1. Refreshing the Auth token (by calling supabase.auth.getUser).
    2. Passing the refreshed Auth token to Server Components, so they don't attempt to refresh the same token themselves. This is accomplished with request.cookies.set.
    3. Passing the refreshed Auth token to the browser, so it replaces the old token. This is accomplished with response.cookies.set.
*/
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}
