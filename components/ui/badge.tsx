import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        violet: "border-transparent bg-violet-500/20 text-violet-300 border-violet-500/30",
        gold: "border-transparent bg-gold-500/20 text-gold-400 border-gold-500/30",
        element_fire: "border-transparent bg-orange-500/20 text-orange-300",
        element_water: "border-transparent bg-blue-500/20 text-blue-300",
        element_earth: "border-transparent bg-emerald-500/20 text-emerald-300",
        element_air: "border-transparent bg-sky-500/20 text-sky-300",
        element_spirit: "border-transparent bg-purple-500/20 text-purple-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
