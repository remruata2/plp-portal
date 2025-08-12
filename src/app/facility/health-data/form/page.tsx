"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import BackToHome from "@/components/ui/back-to-home";

// Import dynamic form component
import DynamicHealthDataForm from "@/components/forms/DynamicHealthDataForm";

interface Facility {
	id: string;
	name: string;
	facility_type: {
		name: string;
	};
}

export default function HealthDataFormPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [facility, setFacility] = useState<Facility | null>(null);
	const [loading, setLoading] = useState(true);

	console.log("Health data form page - Session status:", status);
	console.log("Health data form page - Session data:", session);

	useEffect(() => {
		if (session?.user) {
			loadFacilityData();
		}
	}, [session]);

	const loadFacilityData = async () => {
		try {
			setLoading(true);

			// Get facility data from user session
			if (!session?.user?.facility_id) {
				toast.error(
					"No facility assigned to user. Please contact administrator."
				);
				return;
			}

			// Fetch facility details
			const facilityResponse = await fetch(
				`/api/facilities/${session.user.facility_id}`
			);
			if (!facilityResponse.ok) {
				throw new Error("Failed to fetch facility data");
			}

			const facilityData = await facilityResponse.json();
			setFacility(facilityData);
		} catch (error) {
			console.error("Error loading facility data:", error);
			toast.error("Failed to load facility data");
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async () => {
		try {
			// Redirect back to the main health data page after successful submission
			router.push("/facility/health-data");
			toast.success("Data submitted successfully!");
		} catch (error) {
			console.error("Error handling form submission:", error);
		}
	};

	const getFormComponent = () => {
		if (!facility) return null;

		const facilityType = facility.facility_type.name;
		const userRole = session?.user?.role || "facility";

		// Map facility type names to match database names
		const facilityTypeMap: Record<string, string> = {
			PHC: "PHC",
			SC_HWC: "SC_HWC",
			UPHC: "UPHC",
			U_HWC: "U_HWC",
			A_HWC: "A_HWC",
		};

		const mappedFacilityType = facilityTypeMap[facilityType] || facilityType;

		console.log("Form component - Original facility type:", facilityType);
		console.log("Form component - Mapped facility type:", mappedFacilityType);

		return (
			<DynamicHealthDataForm
				facilityType={mappedFacilityType}
				userRole={userRole}
				facilityId={facility.id.toString()}
				onSubmissionSuccess={handleFormSubmit}
			/>
		);
	};

	const getFacilityTypeDisplay = (type: string) => {
		const typeMap: Record<string, string> = {
			PHC: "Primary Health Centre",
			SC_HWC: "Sub Centre Health & Wellness Centre",
			UPHC: "Urban Primary Health Centre",
			U_HWC: "Urban Health & Wellness Centre",
			A_HWC: "Ayush Health & Wellness Centre",
		};
		return typeMap[type] || type;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading facility data...</span>
				</div>
			</div>
		);
	}

	if (!facility) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<Card>
					<CardContent className="p-6">
						<p className="text-center text-gray-500">
							No facility data found. Please contact your administrator.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-4 sm:p-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
				<div className="flex-1">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Submit PLP Report
					</h1>
					<p className="text-gray-600 mt-2 text-sm sm:text-base">
						Submit monthly PLP indicators for your facility
					</p>
				</div>
				<div className="flex justify-end">
					<BackToHome
						href="/facility/health-data"
						text="Back to PLP Report"
						variant="outline"
					/>
				</div>
			</div>

			{/* Facility Information */}
			<Card className="mb-6">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
						<FileText className="h-5 w-5" />
						Facility Information
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="text-sm font-medium text-gray-500">
								Facility Name
							</label>
							<p className="text-gray-900 text-base sm:text-lg">
								{facility.name}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-500">
								Facility Type
							</label>
							<p className="text-gray-900 text-base sm:text-lg">
								{getFacilityTypeDisplay(facility.facility_type.name)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Data Submission Form */}
			<Card>
				<CardContent className="p-4 sm:p-6">{getFormComponent()}</CardContent>
			</Card>
		</div>
	);
}
