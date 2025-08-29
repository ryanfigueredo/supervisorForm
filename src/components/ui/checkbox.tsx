import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-black/20 accent-[#72931d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72931d]",
        className
      )}
      {...props}
    />
  );
}
