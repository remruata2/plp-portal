"use client";

import * as React from "react";
import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
		return (
			<HeadlessCheckbox
				checked={checked}
				onChange={onCheckedChange}
				disabled={disabled}
				className={({ checked, focus }) =>
					cn(
						"relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						"disabled:cursor-not-allowed disabled:opacity-50",
						checked && "bg-primary text-primary-foreground border-primary",
						focus && "ring-2 ring-ring ring-offset-2",
						className
					)
				}
			>
				{({ checked }) => (
					<>
						<input
							type="checkbox"
							ref={ref}
							checked={checked}
							disabled={disabled}
							className="sr-only"
							{...props}
						/>
						{checked && (
							<Check className="h-3 w-3 text-primary-foreground pointer-events-none" />
						)}
					</>
				)}
			</HeadlessCheckbox>
		);
	}
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
