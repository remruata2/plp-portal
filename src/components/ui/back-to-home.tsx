"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface BackToHomeProps {
	href?: string;
	text?: string;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg";
	className?: string;
}

export default function BackToHome({
	href = "/facility/dashboard",
	text = "Back to Home",
	variant = "outline",
	size = "sm",
	className = "",
}: BackToHomeProps) {
	return (
		<Link href={href}>
			<Button
				variant={variant}
				size={size}
				className={`hidden md:flex items-center gap-2 ${className}`}
			>
				<ArrowLeft className="h-4 w-4" />
				<Home className="h-4 w-4" />
				{text}
			</Button>
		</Link>
	);
}
