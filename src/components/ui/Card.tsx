import { cn } from "@/utils/cn";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h1
      className={cn(
        "mb-1 block text-center text-2xl leading-tight font-bold tracking-tight text-neutral-900 dark:text-neutral-100",
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </h1>
  );
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-6 block text-center text-base font-medium text-neutral-700 dark:text-neutral-300",
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        [
          "h-fit w-fit max-w-lg min-w-md rounded-2xl border p-5",
          "border-neutral-200 bg-neutral-100 shadow-lg shadow-neutral-200/60",
          "dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-2xl dark:shadow-white/4",
          "flex flex-col items-center justify-center",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
