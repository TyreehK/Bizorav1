"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2 font-semibold transition-colors disabled:opacity-50",
        variant === "primary" && "bg-bizora-orange text-white hover:bg-orange-600",
        variant === "secondary" && "bg-bizora-navy text-white hover:bg-[#0a1b33]",
        variant === "outline" && "border border-gray-300 hover:bg-gray-100",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Bezig..." : children}
    </button>
  );
}
