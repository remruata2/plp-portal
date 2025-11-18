"use client";

import * as React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	children: React.ReactNode;
}

const SelectContext = React.createContext<{
	value?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	items?: Map<string, React.ReactNode>;
}>({});

function Select({
	value,
	defaultValue,
	onValueChange,
	disabled,
	children,
}: SelectProps) {
	const [internalValue, setInternalValue] = React.useState<string | undefined>(
		value || defaultValue
	);
	const [items, setItems] = React.useState<Map<string, React.ReactNode>>(
		new Map()
	);

	const currentValue = value !== undefined ? value : internalValue;

	const handleValueChange = (newValue: string) => {
		if (value === undefined) {
			setInternalValue(newValue);
		}
		onValueChange?.(newValue);
	};

	// Extract items from children (including nested SelectContent)
	React.useEffect(() => {
		const itemsMap = new Map<string, React.ReactNode>();
		const extractItems = (node: React.ReactNode) => {
			if (React.isValidElement(node)) {
				const props = node.props as {
					value?: string;
					children?: React.ReactNode;
				};
				// Check if this is a SelectItem
				if (node.type === SelectItem && props.value) {
					itemsMap.set(props.value, props.children);
				}
				// Recursively check children (handles SelectContent, SelectGroup, etc.)
				if (props.children) {
					React.Children.forEach(props.children, extractItems);
				}
			} else if (Array.isArray(node)) {
				// Handle arrays of nodes
				node.forEach(extractItems);
			}
		};
		React.Children.forEach(children, extractItems);
		setItems(itemsMap);
	}, [children]);

	return (
		<SelectContext.Provider
			value={{
				value: currentValue,
				onValueChange: handleValueChange,
				disabled,
				items,
			}}
		>
			<Listbox
				value={currentValue}
				onChange={handleValueChange}
				disabled={disabled}
			>
				<div className="relative">{children}</div>
			</Listbox>
		</SelectContext.Provider>
	);
}

export interface SelectTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	size?: "sm" | "default";
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
	({ className, children, size = "default", ...props }, ref) => {
		const context = React.useContext(SelectContext);
		return (
			<Listbox.Button
				ref={ref}
				className={cn(
					"flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"cursor-pointer",
					size === "sm" && "h-8",
					className
				)}
				{...props}
			>
				{children}
				<ChevronDownIcon className="h-4 w-4 opacity-50 ui-open:rotate-180 transition-transform" />
			</Listbox.Button>
		);
	}
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, children, placeholder, ...props }, ref) => {
	const context = React.useContext(SelectContext);
	const [displayValue, setDisplayValue] = React.useState<
		string | React.ReactNode
	>(placeholder || "");

	React.useEffect(() => {
		// Only update if we have a value and items are loaded
		if (context.value && context.items && context.items.size > 0) {
			const item = context.items.get(context.value);
			if (item) {
				setDisplayValue(item);
			} else {
				// Item not found in map - try to find it in the DOM as fallback
				const domItem = document.querySelector(
					`[data-select-item][data-value="${context.value}"]`
				);
				if (domItem) {
					setDisplayValue(domItem.textContent?.trim() || placeholder || "");
				} else {
					// Item not found - show placeholder instead of ID
					setDisplayValue(placeholder || "");
				}
			}
		} else if (!context.value) {
			// No value selected - show placeholder
			setDisplayValue(placeholder || "");
		} else if (context.value) {
			// We have a value but items haven't loaded - try DOM fallback
			const domItem = document.querySelector(
				`[data-select-item][data-value="${context.value}"]`
			);
			if (domItem) {
				setDisplayValue(domItem.textContent?.trim() || placeholder || "");
			} else {
				// Keep showing placeholder until items are available
				setDisplayValue(placeholder || "");
			}
		}
	}, [context.value, context.items, placeholder]);

	return (
		<span
			ref={ref}
			className={cn("flex items-center gap-2", className)}
			{...props}
		>
			{displayValue}
		</span>
	);
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<Transition
			as={React.Fragment}
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<Listbox.Options
				ref={ref}
				className={cn(
					"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1",
					className
				)}
				{...props}
			>
				{children}
			</Listbox.Options>
		</Transition>
	);
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
	return (
		<Listbox.Option value={value}>
			{({ active, selected }) => (
				<div
					ref={ref}
					data-select-item
					data-value={value}
					className={cn(
						"relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
						active && "bg-accent text-accent-foreground",
						selected && "bg-accent text-accent-foreground",
						className
					)}
					{...props}
				>
					{selected && (
						<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
							<CheckIcon className="h-4 w-4" />
						</span>
					)}
					{children}
				</div>
			)}
		</Listbox.Option>
	);
});
SelectItem.displayName = "SelectItem";

const SelectGroup = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<div ref={ref} className={className} {...props}>
			{children}
		</div>
	);
});
SelectGroup.displayName = "SelectGroup";

const SelectLabel = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
	return (
		<label
			ref={ref}
			className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
});
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<
	HTMLHRElement,
	React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
	return (
		<hr
			ref={ref}
			className={cn("bg-border -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
});
SelectSeparator.displayName = "SelectSeparator";

const SelectScrollUpButton = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	return null;
});
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	return null;
});
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
