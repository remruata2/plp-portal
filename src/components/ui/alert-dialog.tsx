"use client";

import * as React from "react";
import {
	Dialog as HeadlessDialog,
	Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface AlertDialogProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{
	onOpenChange?: (open: boolean) => void;
}>({});

function AlertDialog({
	open,
	defaultOpen,
	onOpenChange,
	children,
}: AlertDialogProps) {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
	const isOpen = open !== undefined ? open : internalOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (open === undefined) {
			setInternalOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<AlertDialogContext.Provider value={{ onOpenChange: handleOpenChange }}>
			<HeadlessDialog open={isOpen} onClose={() => handleOpenChange(false)}>
				{children}
			</HeadlessDialog>
		</AlertDialogContext.Provider>
	);
}

const AlertDialogTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => {
	const context = React.useContext(AlertDialogContext);
	
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		context?.onOpenChange?.(true);
	};

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children, {
			...props,
			onClick: handleClick,
			ref,
		});
	}

	return (
		<button ref={ref} onClick={handleClick} {...props}>
			{children}
		</button>
	);
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

const AlertDialogOverlay = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<Transition.Child
			as={React.Fragment}
			enter="ease-out duration-200"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div
				ref={ref}
				className={cn(
					"fixed inset-0 z-50 bg-black/50",
					className
				)}
				{...props}
			/>
		</Transition.Child>
	);
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<Transition.Child
				as={React.Fragment}
				enter="ease-out duration-200"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<HeadlessDialog.Panel
					ref={ref}
					className={cn(
						"fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:max-w-lg",
						className
					)}
					{...props}
				>
					{children}
				</HeadlessDialog.Panel>
			</Transition.Child>
		</AlertDialogPortal>
	);
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
		{...props}
	/>
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
			className
		)}
		{...props}
	/>
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<HeadlessDialog.Title
		ref={ref}
		className={cn("text-lg font-semibold", className)}
		{...props}
	/>
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<HeadlessDialog.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const context = React.useContext(AlertDialogContext);

	return (
		<button
			ref={ref}
			className={cn(buttonVariants(), className)}
			onClick={(e) => {
				props.onClick?.(e);
				context?.onOpenChange?.(false);
			}}
			{...props}
		/>
	);
});
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const context = React.useContext(AlertDialogContext);

	return (
		<button
			ref={ref}
			className={cn(buttonVariants({ variant: "outline" }), className)}
			onClick={(e) => {
				props.onClick?.(e);
				context?.onOpenChange?.(false);
			}}
			{...props}
		/>
	);
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
