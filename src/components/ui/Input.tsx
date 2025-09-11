"use client";
import { cn } from "@/utils/cn";
import { useRef, useEffect, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

type InputBaseProps = {
  label?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
};

type InputProps =
  | (Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> &
      InputBaseProps & {
        as?: "input";
        type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
        autoResize?: never;
      })
  | (React.TextareaHTMLAttributes<HTMLTextAreaElement> &
      InputBaseProps & {
        as: "textarea";
        autoResize?: boolean;
      });

export const Input = ({
  as = "input",
  autoResize = true,
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Extract value, placeholder, and type from props safely
  let value: any, placeholder: any, type: any, restProps: any;
  if (as === "textarea") {
    ({ value, placeholder, ...restProps } =
      props as React.TextareaHTMLAttributes<HTMLTextAreaElement>);
    type = undefined;
  } else {
    ({ value, placeholder, type, ...restProps } = props as Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type"
    > & { type?: React.InputHTMLAttributes<HTMLInputElement>["type"] });
  }

  useEffect(() => {
    if (as === "textarea" && autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      const resize = () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      };
      resize();
      textarea.addEventListener("input", resize);
      return () => textarea.removeEventListener("input", resize);
    }
  }, [as, autoResize, value]);

  const sharedClassName = cn(
    "flex w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none shadow-sm",
    "border-neutral-200 bg-neutral-100 text-neutral-900 placeholder:text-neutral-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
    "dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.15)]",
    "focus:border-neutral-300 focus:ring-2 focus:ring-neutral-300 dark:focus:border-neutral-600 dark:focus:ring-neutral-800",
    "active:border-neutral-300 active:ring-2 active:ring-neutral-100 dark:active:border-neutral-700 dark:active:ring-neutral-900",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error &&
      "border-red-500 focus:border-red-500 focus:ring-red-300 dark:border-red-600 dark:focus:border-red-600 dark:focus:ring-red-900",
    className,
  );

  const errorHeight = "h-2";

  return (
    <div
      className={cn("flex w-full flex-col gap-1 sm:gap-2", containerClassName)}
    >
      {label && (
        <label className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      {as === "textarea" ? (
        <textarea
          ref={textareaRef}
          className={cn(
            sharedClassName,
            "max-h-60 min-h-[40px] resize-none overflow-y-auto",
            "sm:text-base",
          )}
          rows={1}
          value={value}
          placeholder={placeholder}
          {...(restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === "password" ? (
        <div className="relative w-full">
          <input
            className={cn(sharedClassName, "h-10 pr-10 sm:h-12 sm:text-base")}
            value={value}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            {...(restProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={cn(
              "absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 focus:ring-2 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-700",
              "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <IconEyeOff size={20} aria-hidden="true" />
            ) : (
              <IconEye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        <input
          className={cn(sharedClassName, "h-10 sm:h-12 sm:text-base")}
          value={value}
          placeholder={placeholder}
          type={type}
          {...(restProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <div
        className={cn("text-xs text-red-500 transition-all", errorHeight)}
        aria-live="polite"
      >
        {error ? error : null}
      </div>
    </div>
  );
};

Input.displayName = "Input";
