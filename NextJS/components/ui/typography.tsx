import { cn } from "@/lib/utils";
import React, { type ComponentPropsWithoutRef } from "react";

// https://stackoverflow.com/questions/54654303/using-a-forwardref-component-with-children-in-typescript

export const TypographyH1 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h1">>(({ className,...props }, ref) => (
  <h1 ref={ref} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props}/>
));
TypographyH1.displayName = "TypographyH1";

export const TypographyH2 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h2">>(({ className,...props }, ref) => (
  <h2 ref={ref} className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className)} {...props}/>
));
TypographyH2.displayName = "TypographyH2";

export const TypographyH3 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h3">>(({ className,...props }, ref) => (
  <h3 ref={ref} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}/>
));
TypographyH3.displayName = "TypographyH3";

export const TypographyH4 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h4">>(({ className,...props }, ref) => (
  <h4 ref={ref} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}/>
));
TypographyH4.displayName = "TypographyH4";

export const TypographyP = React.forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(({ className,...props }, ref) => (
  <p ref={ref} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props}/>
));
TypographyP.displayName = "TypographyP";

export const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, ComponentPropsWithoutRef<"blockquote">>(({ className,...props }, ref) => (
  <blockquote ref={ref} className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props}/>
));
TypographyBlockquote.displayName = "TypographyBlockquote";

/* Typing references:
https://stackoverflow.com/questions/65361696/arguments-of-same-length-typescript
https://stackoverflow.com/questions/69507794/typescript-how-to-make-sure-two-props-of-a-functional-component-which-are-arra */
export const TypographyTable = <H extends string[]>({
  headers,
  rows,
}: {
  headers: [...H];
  rows: [...{ [I in keyof H]: string[] }];
}) => {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headers.map((headerItem, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {headerItem}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="m-0 border-t p-0 even:bg-muted">
              {row.map((rowItem) => (
                <td
                  key={rowItem}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {rowItem}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function TypographyList({ items }: { items: string[] }) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {items.map((item) => (
        <li key={item}>item</li>
      ))}
    </ul>
  );
}

export const TypographyInlineCode = React.forwardRef<HTMLElement, ComponentPropsWithoutRef<"code">>(({ className,...props }, ref) => (
  <code ref={ref} className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} {...props}/>
));
TypographyInlineCode.displayName = "TypographyInlineCode";

export const TypographyLead = React.forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(({ className,...props }, ref) => (
  <p ref={ref} className={cn("text-xl text-muted-foreground", className)} {...props}/>
));
TypographyLead.displayName = "TypographyLead";

export const TypographyLarge = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(({ className,...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold", className)} {...props}/>
));
TypographyLarge.displayName = "TypographyLarge";

export const TypographySmall = React.forwardRef<HTMLElement, ComponentPropsWithoutRef<"small">>(({ className,...props }, ref) => (
  <small ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props}/>
));
TypographySmall.displayName = "TypographySmall";

export const TypographyMuted = React.forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(({ className,...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}/>
));
TypographyMuted.displayName = "TypographyMuted";

export const PageHeader1 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h2">>(({ className,...props }, ref) => (
  <h2 ref={ref} className={cn("text-2xl font-bold tracking-tight", className)} {...props}/>
));
PageHeader1.displayName = "PageHeader1";

export const PageSubHeader1 = React.forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(({ className,...props }, ref) => (
  <p ref={ref} className={cn("text-muted-foreground", className)} {...props}/>
));
PageSubHeader1.displayName = "PageSubHeader1";

export const PageHeader2 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h3">>(({ className,...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-medium", className)} {...props}/>
));
PageHeader2.displayName = "PageHeader2";

export const PageSubHeader2 = React.forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(({ className,...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}/>
));
PageSubHeader2.displayName = "PageSubHeader2";
