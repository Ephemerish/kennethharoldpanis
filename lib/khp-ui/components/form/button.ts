import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button classes, shared by <button> and ButtonLink (KHP §4.2).
 *
 *   default       solid brand (most actions)
 *   gradient      brand gradient (the lead call to action in a section)
 *   outlineBrand  brand outline (the secondary call to action)
 *   outline       neutral outline
 *   secondary, ghost, link, destructive
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-700 text-neutral-0 hover:bg-brand-800",
        gradient: "bg-brand-gradient text-neutral-0 shadow-brand",
        destructive: "bg-error-600 text-neutral-0 hover:bg-error-700",
        outline: "border border-neutral-400 bg-neutral-0 hover:bg-neutral-100 hover:text-neutral-900",
        outlineBrand: "bg-neutral-0 text-brand-700 border-2 border-brand-600 hover:bg-brand-gradient hover:text-neutral-0",
        secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
