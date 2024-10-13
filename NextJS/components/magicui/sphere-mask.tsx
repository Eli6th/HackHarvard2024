import { cn } from "@/lib/utils";

export const SphereMask = ({ 
  reverse = false, 
  color = "#3b82f6"
}: { 
  reverse?: boolean;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none relative -z-[2] mx-auto h-[50rem] overflow-hidden",
        "[mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)]",
        reverse ? "my-[-22rem] rotate-180 md:mt-[-30rem]" : "my-[-18.8rem]",
        "before:absolute before:inset-0 before:h-full before:w-full before:opacity-40",
        "after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))] after:bg-background"
      )}
      style={{
        "--sphere-color": color,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`
      } as React.CSSProperties}
    ></div>
  );
};