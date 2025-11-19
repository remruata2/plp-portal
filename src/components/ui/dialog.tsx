"use client";

import * as React from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

const Dialog = ({ open, defaultOpen, onOpenChange, children }: DialogProps) => {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
	const isOpen = open !== undefined ? open : internalOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (open === undefined) {
			setInternalOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<HeadlessDialog open={isOpen} onClose={() => handleOpenChange(false)}>
			{children}
		</HeadlessDialog>
	);
};

const DialogTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => {
	const context = React.useContext(DialogContext);
	
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		context?.onOpenChange?.(true);
	};

	if (asChild && React.isValidElement(children)) {
		// Clone the child and pass the ref and onClick handler
		// React will handle ref forwarding through the Button's forwardRef
		return React.cloneElement(children, {
			...props,
			onClick: handleClick,
			ref: ref,
		} as any);
	}

	return (
		<button ref={ref} onClick={handleClick} {...props}>
			{children}
		</button>
	);
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContext = React.createContext<{
	onOpenChange?: (open: boolean) => void;
}>({});

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

const DialogClose = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
	const context = React.useContext(DialogContext);

	return (
		<button
			ref={ref}
			className={cn(
				"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
				className
			)}
			onClick={(e) => {
				onClick?.(e);
				context?.onOpenChange?.(false);
			}}
			{...props}
		/>
	);
});
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<
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
					"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      className
    )}
    {...props}
  />
		</Transition.Child>
	);
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
  <DialogPortal>
    <DialogOverlay />
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
						"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
					<DialogClose>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
					</DialogClose>
				</HeadlessDialog.Panel>
			</Transition.Child>
  </DialogPortal>
	);
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<HeadlessDialog.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<HeadlessDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// Wrap Dialog to provide context
const DialogWithContext = ({
	open,
	defaultOpen,
	onOpenChange,
	children,
}: DialogProps) => {
	return (
		<DialogContext.Provider value={{ onOpenChange }}>
			<Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
				{children}
			</Dialog>
		</DialogContext.Provider>
	);
};

export {
	DialogWithContext as Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
