import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, leftIcon, rightIcon, id, required, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-[#003820] dark:group-focus-within:text-[#95d4ac] transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={id}
            ref={ref}
            required={required}
            className={cn(
              "w-full h-11 bg-white dark:bg-[#121320] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3.5 outline-none transition-all duration-200 text-xs sm:text-sm font-semibold",
              "hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#003820] focus:ring-2 focus:ring-[#003820]/10",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-100",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-500 font-medium animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
export { Input };
