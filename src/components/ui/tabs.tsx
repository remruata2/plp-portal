"use client";

import * as React from "react";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";

export interface TabsProps {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
}

const TabsContext = React.createContext<{
	value?: string;
	onValueChange?: (value: string) => void;
}>({});

const Tabs = ({ defaultValue, value, onValueChange, children }: TabsProps) => {
	const [internalValue, setInternalValue] = React.useState(defaultValue || "");
	const currentValue = value !== undefined ? value : internalValue;

	const handleChange = (newValue: string) => {
		if (value === undefined) {
			setInternalValue(newValue);
		}
		onValueChange?.(newValue);
	};

	// Collect all tab values and their indices
	const tabValues: string[] = [];
	const panelValues: string[] = [];

	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child)) {
			if (child.type === TabsList) {
				React.Children.forEach(child.props.children, (tabChild) => {
					if (React.isValidElement(tabChild) && tabChild.type === TabsTrigger) {
						if (tabChild.props.value) {
							tabValues.push(tabChild.props.value);
						}
					}
				});
			} else if (React.isValidElement(child) && child.type === TabsContent) {
				if (child.props.value) {
					panelValues.push(child.props.value);
				}
			}
		}
	});

	const selectedIndex = tabValues.findIndex((v) => v === currentValue);

	return (
		<TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
			<Tab.Group
				selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
				onChange={(index) => {
					const tabValue = tabValues[index];
					if (tabValue) {
						handleChange(tabValue);
					}
				}}
			>
				{children}
			</Tab.Group>
		</TabsContext.Provider>
	);
};

const TabsList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<Tab.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
	const context = React.useContext(TabsContext);
	const isSelected = context.value === value;

	return (
		<Tab
    ref={ref}
    className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				isSelected && "bg-background text-foreground shadow-sm",
      className
    )}
    {...props}
  />
	);
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
	const context = React.useContext(TabsContext);
	const isSelected = context.value === value;

	if (!isSelected) return null;

	return (
		<Tab.Panels>
			<Tab.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
		</Tab.Panels>
	);
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
