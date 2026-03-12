import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onWheel, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onWheel={(e) => {
          if (type === "number") {
            (e.target as HTMLInputElement).blur();
          }
          onWheel?.(e);
        }}
        onTouchStart={(e) => {
          if (type === "number") {
            // Only blur if the input is already focused and the user is touching it again (likely to scroll)
            if (document.activeElement === e.target) {
              (e.target as HTMLInputElement).blur();
            }
          }
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
