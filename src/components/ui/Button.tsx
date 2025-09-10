import { cn } from "@/utils/cn";

export type ButtonVariant = "default" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-neutral-900 text-neutral-100 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
  secondary:
    "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
};

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
