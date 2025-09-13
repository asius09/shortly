import { cn } from "@/utils/cn";

/**
 * ButtonVariant defines the visual style of the Button component.
 * - "default": Primary action button, high contrast.
 * - "secondary": Subtle background, for secondary actions.
 * - "ghost": Minimal, transparent background, for less emphasis.
 * - "outline": Transparent with border, for outlined actions.
 * - "destructive": Red background, for dangerous/destructive actions.
 * - "info": Blue background, for informational actions.
 */
export type ButtonVariant =
  | "default"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "info";

/**
 * ButtonProps extends the native button props and adds a `variant` prop
 * to control the button's visual style.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button.
   * @default "default"
   */
  variant?: ButtonVariant;
}

/**
 * Maps each ButtonVariant to its corresponding Tailwind CSS classes.
 */
const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-neutral-900 text-neutral-100 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
  secondary:
    "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
  outline:
    "bg-transparent border border-neutral-300 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-white dark:hover:bg-red-800",
  info:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600",
};

/**
 * Button component for consistent styling across the app.
 * Supports multiple variants for different use cases.
 */
export const Button = ({
  className,
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out",
        "hover:scale-101 hover:transition-transform hover:duration-150 hover:ease-out",
        "active:transition-transform active:duration-200 active:ease-in",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 active:scale-98 active:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
};

Button.displayName = "Button";
