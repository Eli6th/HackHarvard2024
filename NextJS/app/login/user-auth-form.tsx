"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Template: https://github.com/shadcn/taxonomy/blob/main/components/user-auth-form.tsx

// Create Zod object schema with validations
const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Use Zod to extract inferred type from schema
type FormData = z.infer<typeof userAuthSchema>;

export default function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // Create form with react-hook-form and use Zod schema to validate the form submission (with resolver)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Obtain supabase client from context provider
  const supabaseClient = createBrowserSupabaseClient();

  const onSubmit = async (input: FormData) => {
    setIsLoading(true);

    if (isSignUp) {
      // Sign up new user
      const { error } = await supabaseClient.auth.signUp({
        email: input.email.toLowerCase(),
        password: input.password,
      });

      if (error) {
        setIsLoading(false);
        return toast({
          title: "Something went wrong during sign up.",
          description: error.message,
          variant: "destructive",
        });
      }

      setIsLoading(false);
      router.push('/dashboard');
      return toast({
        title: "Successfully Signed Up",
        description: "Welcome to Query On Reality!",
      });
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: input.email.toLowerCase(),
      password: input.password,
    });

    if (error) {
      setIsLoading(false);
      return toast({
        title: "Something went wrong trying to sign in.",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
    router.push('/dashboard');
    return toast({
      title: "Successfully Signed Up",
      description: "Welcome to Query On Reality!",
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={(e: BaseSyntheticEvent) => void handleSubmit(onSubmit)(e)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </form>
      <div className="text-center">
        <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Button>
      </div>
    </div>
  );
}
