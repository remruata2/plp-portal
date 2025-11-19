"use client";

import * as React from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import { cn } from "@/lib/utils";

export interface SwitchProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
	({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
		return (
			<HeadlessSwitch
				checked={checked}
				onChange={onCheckedChange}
				disabled={disabled}
				className={({ checked, focus }) =>
					cn(
						"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						"disabled:cursor-not-allowed disabled:opacity-50",
						checked ? "bg-primary" : "bg-input",
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
						onChange={() => {}} // Controlled by HeadlessSwitch
						readOnly
						disabled={disabled}
						className="sr-only"
					{...props}
				/>
						<span
					className={cn(
								"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform",
							checked ? "translate-x-5" : "translate-x-0"
						)}
					/>
					</>
				)}
			</HeadlessSwitch>
		);
	}
);
Switch.displayName = "Switch";

export { Switch };
