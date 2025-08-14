"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	FileText,
	Upload,
	Edit,
	Trash2,
	Info,
	ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import EditSubmissionModal from "@/components/facility/EditSubmissionModal";

interface Facility {
	id: string;
	name: string;
	facility_type: {
		name: string;
	};
}

interface HealthDataSubmission {
	report_month: string;
	submission_date: string;
	type: "field_value" | "remuneration_record";
	canEdit?: boolean;
	editDeadline?: string;
	editReason?: string;
}

export default function FacilityHealthDataPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [facility, setFacility] = useState<Facility | null>(null);
	const [submissions, setSubmissions] = useState<HealthDataSubmission[]>([]);
	const [loadingSubmissions, setLoadingSubmissions] = useState(false);

	// Edit modal state
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedSubmissionId, setSelectedSubmissionId] = useState<
		string | null
	>(null);

	console.log("Facility health data page - Session status:", status);
	console.log("Facility health data page - Full session data:", session);
	console.log("Facility health data page - Session user:", session?.user);
	console.log(
		"Facility health data page - Facility ID:",
		session?.user?.facility_id
	);
	console.log("Facility health data page - User role:", session?.user?.role);

	useEffect(() => {
		console.log("useEffect triggered - Status:", status, "Session:", !!session);

		if (status === "loading") {
			console.log("Session still loading...");
			return;
		}

		if (status === "unauthenticated") {
			console.log("User unauthenticated, redirecting to login");
			router.push("/login");
			return;
		}

		if (session?.user) {
			console.log("Session loaded, loading facility data");
			loadFacility();
		} else {
			console.log("Session loaded but no user found:", {
				hasSession: !!session,
				hasUser: !!session?.user,
				userRole: session?.user?.role,
			});
		}
	}, [status, session, router]);

	const loadFacility = async () => {
		try {
			// Try to get facility data from the my-facility endpoint
			const response = await fetch("/api/facility/my-facility");
			if (response.ok) {
				const data = await response.json();
				setFacility(data.facility);
				// Now load submissions using the facility ID from the response
				if (data.facility?.id) {
					loadSubmissions(data.facility.id);
				}
			} else {
				console.error("Failed to load facility data:", response.status);
			}
		} catch (error) {
			console.error("Error loading facility:", error);
		}
	};

	const loadSubmissions = async (facilityId?: string) => {
		const targetFacilityId = facilityId || session?.user?.facility_id;
		if (!targetFacilityId) {
			console.log("No facility ID available for loading submissions");
			return;
		}

		try {
			setLoadingSubmissions(true);
			const response = await fetch(
				`/api/health-data/submissions?facilityId=${targetFacilityId}`
			);

			if (response.ok) {
				const data = await response.json();
				const submissionsWithEditability = await Promise.all(
					(data.submissions || []).map(
						async (submission: HealthDataSubmission) => {
							try {
								// Check if this submission can be edited
								const editabilityResponse = await fetch(
									`/api/health-data/facility-submissions/${targetFacilityId}-${submission.report_month}`
								);
								if (editabilityResponse.ok) {
									const editabilityData = await editabilityResponse.json();
									return {
										...submission,
										canEdit: editabilityData.submission?.canEdit || false,
										editDeadline: editabilityData.submission?.editDeadline,
										editReason: editabilityData.submission?.canEdit
											? `Can be edited until ${new Date(
													editabilityData.submission.editDeadline
											  ).toLocaleDateString()}`
											: editabilityData.error || "Cannot be edited",
									};
								}
							} catch (error) {
								console.error("Error checking editability:", error);
							}

							return {
								...submission,
								canEdit: false,
								editReason: "Error checking editability",
							};
						}
					)
				);
				setSubmissions(submissionsWithEditability);
			}
		} catch (error) {
			console.error("Error loading submissions:", error);
			toast.error("Failed to load submissions");
		} finally {
			setLoadingSubmissions(false);
		}
	};

	const handleViewSubmission = (submissionId: string) => {
		if (!facility?.id) {
			toast.error("Facility information not loaded");
			return;
		}
		router.push(`/facility/health-data/submissions/${submissionId}/view`);
	};

	const handleEditSubmission = (submissionId: string) => {
		if (!facility?.id) {
			toast.error("Facility information not loaded");
			return;
		}
		setSelectedSubmissionId(submissionId);
		setIsEditModalOpen(true);
	};

	const handleDeleteSubmission = async (reportMonth: string) => {
		if (!facility?.id) {
			toast.error("Facility information not loaded");
			return;
		}

		// Show comprehensive confirmation dialog like in admin page
		if (
			!confirm(
				"Are you sure you want to delete this submission?\n\n" +
					"This will permanently delete:\n" +
					"• All field data values\n" +
					"• Remuneration calculations\n" +
					"• Worker remuneration records\n" +
					"• Performance records\n" +
					"• Facility targets\n" +
					"• All other associated core data\n\n" +
					"This action cannot be undone."
			)
		) {
			return;
		}

		try {
			const response = await fetch(
				`/api/health-data/facility-submissions/${facility.id}-${reportMonth}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const result = await response.json();

				// Show detailed success message with deletion breakdown like admin page
				if (result.breakdown) {
					const breakdownText = Object.entries(result.breakdown)
						.filter(([_, count]) => (count as number) > 0)
						.map(([table, count]) => `${table}: ${count} records`)
						.join(", ");

					toast.success(
						`Submission deleted successfully. Removed ${result.totalDeletedCount} total records (${breakdownText})`
					);
				} else {
					toast.success("Submission deleted successfully");
				}

				loadSubmissions(facility.id);
			} else {
				const errorData = await response.json();
				toast.error(errorData.error || "Failed to delete submission");
			}
		} catch (error) {
			console.error("Error deleting submission:", error);
			toast.error("Failed to delete submission");
		}
	};

	const getFacilityTypeDisplay = (type: string) => {
		const typeMap: Record<string, string> = {
			PHC: "Primary Health Centre",
			UPHC: "Urban Primary Health Centre",
			CHC: "Community Health Centre",
			DH: "District Hospital",
			SDH: "Sub District Hospital",
		};
		return typeMap[type] || type;
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="mx-auto max-w-4xl">
					<div className="flex items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-7xl space-y-6">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
								PLP Report Submission
							</h1>
							<p className="mt-2 text-gray-600">
								Submit monthly PLP indicators for your facility.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Button
								variant="outline"
								onClick={() => router.back()}
								className="hidden md:flex"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go Back
							</Button>
							<Button
								onClick={() => router.push("/facility/health-data/form")}
								className="w-full bg-black hover:bg-gray-800 sm:w-auto"
								size="lg"
							>
								<Upload className="mr-2 h-5 w-5" />
								Submit Report
							</Button>
						</div>
					</div>
				</div>

				{/* Facility Information Card */}
				<Card className="shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<FileText className="h-5 w-5 text-blue-600" />
							Facility Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label className="text-sm font-medium text-gray-500">
									Facility Name
								</label>
								<p className="text-gray-900 font-medium">
									{facility?.name || "Loading..."}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Facility Type
								</label>
								<p className="text-gray-900">
									{facility?.facility_type?.name
										? getFacilityTypeDisplay(facility.facility_type.name)
										: "Loading..."}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Submissions Card */}
				<Card className="shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<FileText className="h-5 w-5 text-blue-600" />
							Recent Submissions
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loadingSubmissions ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
							</div>
						) : submissions.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
								<p>No submissions found</p>
								<p className="text-sm">
									Submit your first report to get started
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{submissions.map((submission, index) => (
									<div
										key={index}
										className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col min-h-[240px] shadow-sm"
									>
										{/* Submission Header */}
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 space-y-1">
												<h3 className="text-lg font-semibold text-gray-900">
													{new Date(
														submission.report_month + "-01"
													).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
													})}
												</h3>
												<p className="text-sm text-gray-600">
													Submitted on{" "}
													{new Date(
														submission.submission_date
													).toLocaleDateString()}
												</p>
											</div>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-800"
											>
												Data Submitted
											</Badge>
										</div>

										{/* Editability Status */}
										{submission.canEdit && (
											<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
												<Info className="h-4 w-4 text-green-600" />
												<span className="text-sm text-green-800 font-medium">
													{submission.editReason}
												</span>
											</div>
										)}

										{/* Action Buttons */}
										<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-auto pt-3">
											<div className="flex flex-col gap-2 sm:flex-row">
												<Button
													onClick={() =>
														handleViewSubmission(
															`${facility?.id}-${submission.report_month}`
														)
													}
													variant="outline"
													size="sm"
													className="w-full sm:w-auto"
												>
													<FileText className="mr-2 h-4 w-4" />
													View
												</Button>

												{submission.canEdit && (
													<>
														<Button
															onClick={() =>
																handleEditSubmission(
																	`${facility?.id}-${submission.report_month}`
																)
															}
															variant="outline"
															size="sm"
															className="w-full sm:w-auto"
														>
															<Edit className="mr-2 h-4 w-4" />
															Edit
														</Button>
														<Button
															onClick={() =>
																handleDeleteSubmission(submission.report_month)
															}
															variant="destructive"
															size="sm"
															className="w-full sm:w-auto"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</Button>
													</>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Edit Modal */}
			<EditSubmissionModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedSubmissionId(null);
				}}
				submissionId={selectedSubmissionId}
				onSubmissionUpdated={loadSubmissions}
			/>
		</div>
	);
}
