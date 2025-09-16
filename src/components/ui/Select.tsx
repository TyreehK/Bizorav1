"use client";

import { SelectHTMLAttributes } from "react";
import clsx from "clsx";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <div>
      <select
        {...props}
        className={clsx(
          "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bizora-orange",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
