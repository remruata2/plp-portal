"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FacilityProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// No need for loading state or API calls - use session data directly
	if (status === "loading") {
		return (
			<div className="max-w-7xl mx-auto p-6">
				<div className="flex items-center justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
					<span className="ml-3 text-gray-600">Loading session...</span>
				</div>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="max-w-7xl mx-auto p-6">
				<div className="text-center py-8 text-gray-500">
					No session data available
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Page Header */}
			<div className="mb-6 space-y-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
						<p className="text-gray-600 mt-2">
							Manage your facility profile and settings
						</p>
					</div>
					<div className="flex justify-end">
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.back()}
							className="hidden md:flex"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</div>
				</div>
			</div>

			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Facility Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="text-sm font-medium text-gray-700">
								Username
							</label>
							<p className="text-lg font-semibold text-gray-900">
								{session?.user?.username || "N/A"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">Role</label>
							<p className="text-lg font-semibold text-gray-900">
								{session?.user?.role || "N/A"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">
								User ID
							</label>
							<p className="text-lg font-semibold text-gray-900">
								{session?.user?.id || "N/A"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">Email</label>
							<p className="text-lg font-semibold text-gray-900">
								{session?.user?.email || "N/A"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Session Data Display */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Session Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="text-sm font-medium text-gray-700">
								Facility ID
							</label>
							<p className="text-lg font-semibold text-gray-900 font-mono text-sm">
								{session.user.facility_id || "N/A"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">
								Session Status
							</label>
							<p className="text-lg font-semibold text-gray-900">{status}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
