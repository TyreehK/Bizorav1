"use client";

import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ error, className, ...props }: InputProps) {
  return (
    <div>
      <input
        {...props}
        className={clsx(
          "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bizora-orange",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
