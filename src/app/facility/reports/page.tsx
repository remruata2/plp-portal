"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
	TrendingUp,
	TrendingDown,
	Target,
	Calendar,
	FileText,
	BarChart3,
	DollarSign,
	Users,
	Building2,
	Activity,
} from "lucide-react";
import { getIndicatorNumber } from "@/lib/utils/indicator-sort-order";
import { CalculationDetailsModal } from "@/components/calculation-details-modal";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PerformanceIndicator {
	id: number;
	name: string;
	target: string; // Now contains target description like "3%-5%", "5-10 sessions"
	actual: number;
	percentage: number;
	status: "achieved" | "partial" | "not_achieved";
	incentive_amount: number;
	indicator_code?: string;
	target_type?: string;
	target_description?: string;
	target_value_for_calculation?: number;
	// Calculation details
	numerator_value?: number;
	denominator_value?: number;
	formula_config?: any;
	calculation_result?: any;
	max_remuneration?: number;
	raw_percentage?: number; // Raw percentage before remuneration logic
	// Field information
	numerator_field?: {
		id: number;
		code: string;
		name: string;
	} | null;
	denominator_field?: {
		id: number;
		code: string;
		name: string;
	} | null;
	target_field?: {
		id: number;
		code: string;
		name: string;
	} | null;
}

interface WorkerRemuneration {
	id: number;
	name: string;
	worker_type: string;
	worker_role: string;
	allocated_amount: number;
	performance_percentage: number;
	calculated_amount: number;
}

interface MonthlyReport {
	reportMonth: string;
	facility: {
		id: string;
		name: string;
		display_name: string;
		type: string;
		type_display_name: string;
	};
	totalIncentive: number;
	totalPersonalIncentives: number;
	totalRemuneration: number;
	performancePercentage: number;
	indicators: PerformanceIndicator[];
	workers: WorkerRemuneration[];
	summary: {
		totalIndicators: number;
		achievedIndicators: number;
		partialIndicators: number;
		notAchievedIndicators: number;
		workerCounts: Record<string, number>;
	};
}

export default function FacilityReportsPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [selectedYear, setSelectedYear] = useState<string | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [report, setReport] = useState<MonthlyReport | null>(null);
	const [availableMonths, setAvailableMonths] = useState<string[]>([]);
	const [availableYears, setAvailableYears] = useState<string[]>([]);

	// Get latest available month and year from the available months list
	const getLatestAvailableMonthAndYear = (months: string[]) => {
		if (months.length === 0) return { month: null, year: null };
		// Sort months in descending order and return the latest
		const sortedMonths = months.sort((a, b) => b.localeCompare(a));
		const latestMonth = sortedMonths[0];
		const [year, month] = latestMonth.split("-");
		return { month, year };
	};

	// Extract available years from available months
	const extractAvailableYears = (months: string[]) => {
		const years = [...new Set(months.map((month) => month.split("-")[0]))];
		return years.sort((a, b) => b.localeCompare(a)); // Sort years descending
	};

	// Get available months for a specific year
	const getAvailableMonthsForYear = (year: string) => {
		return availableMonths
			.filter((month) => month.startsWith(year + "-"))
			.map((month) => month.split("-")[1])
			.sort((a, b) => a.localeCompare(b)); // Sort months ascending
	};

	// Combine year and month into the format expected by the API
	const getCombinedMonthYear = () => {
		if (selectedYear && selectedMonth) {
			return `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
		}
		return null;
	};

	useEffect(() => {
		console.log("Session status:", status);
		console.log("Session data:", session);

		if (status === "loading") {
			return; // Still loading session
		}

		if (session?.user?.facility_id) {
			console.log("User has facility_id:", session.user.facility_id);
			loadAvailableMonths();
		} else if (status === "unauthenticated") {
			console.log("User is unauthenticated");
			setLoading(false);
		} else {
			console.log("User authenticated but no facility_id");
			setLoading(false);
		}
	}, [session, status]);

	useEffect(() => {
		if (status === "loading") {
			return; // Still loading session
		}

		const combinedMonthYear = getCombinedMonthYear();
		if (
			combinedMonthYear !== null &&
			session?.user?.facility_id &&
			availableMonths.length > 0
		) {
			loadReport(combinedMonthYear);
		}
	}, [selectedYear, selectedMonth, session, status, availableMonths]);

	const loadAvailableMonths = async () => {
		try {
			console.log("Loading available months...");
			const response = await fetch("/api/facility/reports/available-months");
			console.log("Available months response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("Available months data:", data);
				const months = data.months || [];
				setAvailableMonths(months);

				// Extract available years
				const years = extractAvailableYears(months);
				setAvailableYears(years);

				// Set the latest available month and year as default
				if (months.length > 0) {
					const { month, year } = getLatestAvailableMonthAndYear(months);
					console.log("Setting latest available month and year as default:", {
						month,
						year,
					});
					setSelectedYear(year);
					setSelectedMonth(month);
				} else {
					console.log("No available months found");
					setLoading(false);
				}
			} else {
				const errorData = await response.json();
				console.error("Failed to load available months:", errorData);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error loading available months:", error);
			setLoading(false);
		}
	};

	const loadReport = async (month: string) => {
		try {
			setLoading(true);
			console.log("Loading report for month:", month);
			const response = await fetch(`/api/facility/reports/service/${month}`);
			console.log("Report response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("Report data:", data);
				setReport(data);
			} else {
				const errorData = await response.json();
				console.error("Failed to load report:", errorData);
				toast.error("Failed to load report");
				setReport(null);
			}
		} catch (error) {
			console.error("Error loading report:", error);
			toast.error("Failed to load report");
			setReport(null);
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const config = {
			achieved: {
				variant: "default" as const,
				text: "Achieved",
				className: "bg-green-100 text-green-800",
			},
			partial: {
				variant: "secondary" as const,
				text: "Partial",
				className: "bg-yellow-100 text-yellow-800",
			},
			not_achieved: {
				variant: "destructive" as const,
				text: "Not Achieved",
				className: "bg-red-100 text-red-800",
			},
		};
		const statusConfig =
			config[status as keyof typeof config] || config.not_achieved;
		return (
			<Badge className={statusConfig.className}>{statusConfig.text}</Badge>
		);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "achieved":
				return <TrendingUp className="h-4 w-4 text-green-600" />;
			case "partial":
				return <Target className="h-4 w-4 text-yellow-600" />;
			case "not_achieved":
				return <TrendingDown className="h-4 w-4 text-red-600" />;
			default:
				return <Target className="h-4 w-4 text-gray-600" />;
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex items-center gap-2">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
					<span>Loading report...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6">
			{/* Page Header */}
			<div className="space-y-4 mb-6">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
					<div className="flex-1">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
							Incentive Reports
						</h1>
						<p className="text-gray-600 mt-2 text-sm sm:text-base">
							{report ? (
								<>
									<span className="flex items-center gap-2 mt-1">
										<Building2 className="h-4 w-4" />
										{report.facility.display_name} (
										{report.facility.type_display_name})
									</span>
								</>
							) : (
								"View your facility's performance and incentive calculations"
							)}
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.back()}
							className="hidden md:flex"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
						<div className="flex items-center gap-2 sm:gap-4">
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
								<div className="flex items-center gap-2">
									<Calendar className="h-5 w-5 text-gray-500" />
									<span className="text-sm font-medium text-gray-700 hidden sm:block">
										Select Period:
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Select
										value={selectedYear || undefined}
										onValueChange={(year) => {
											setSelectedYear(year);
											setSelectedMonth(null); // Reset month when year changes
										}}
									>
										<SelectTrigger className="w-24 sm:w-28 h-10 sm:h-11 text-sm sm:text-base">
											<SelectValue placeholder="Year" />
										</SelectTrigger>
										<SelectContent>
											{availableYears.map((year) => (
												<SelectItem key={year} value={year}>
													{year}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Select
										value={selectedMonth || undefined}
										onValueChange={setSelectedMonth}
										disabled={!selectedYear}
									>
										<SelectTrigger className="w-28 sm:w-32 h-10 sm:h-11 text-sm sm:text-base">
											<SelectValue
												placeholder={
													selectedYear ? "Month" : "Select year first"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{selectedYear ? (
												getAvailableMonthsForYear(selectedYear).map((month) => (
													<SelectItem key={month} value={month}>
														{new Date(
															`${selectedYear}-${month}-01`
														).toLocaleDateString("en-US", {
															month: "long",
														})}
													</SelectItem>
												))
											) : (
												<SelectItem value="no-year" disabled>
													Select year first
												</SelectItem>
											)}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{loading ? (
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
							<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
								Loading report...
							</h3>
							<p className="text-gray-500 text-sm sm:text-base">
								Please wait while we load your performance data.
							</p>
						</div>
					</CardContent>
				</Card>
			) : !report ? (
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="text-center">
							<FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
								{availableMonths.length === 0
									? "No Data Available"
									: "No Report Available"}
							</h3>
							<p className="text-gray-500 text-sm sm:text-base">
								{availableMonths.length === 0
									? "No performance data has been submitted yet. Please submit PLP report to view reports."
									: "No performance report is available for the selected month. Please ensure you have submitted PLP report for this period."}
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{/* Summary Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{["PHC", "UPHC", "U_HWC"].includes(report.facility.type)
										? "Team Incentives"
										: "Facility Incentives"}
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold">
									₹{report.totalIncentive.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{["PHC", "UPHC", "U_HWC"].includes(report.facility.type)
										? "MO team-based incentive"
										: "Facility incentives"}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Personal Incentives
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold text-blue-600">
									₹{report.totalPersonalIncentives.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{report.workers.filter((w) =>
										["hw", "asha", "colocated_sc_hw"].includes(
											w.worker_type.toLowerCase()
										)
									).length === 0
										? "No personal incentives"
										: `${
												report.workers.filter((w) =>
													["hw", "asha", "colocated_sc_hw"].includes(
														w.worker_type.toLowerCase()
													)
												).length
										  } performance-based workers`}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Remuneration
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold text-purple-600">
									₹{report.totalRemuneration.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Facility + Employee remuneration
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Performance
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold text-green-600">
									{typeof report.performancePercentage === "number"
										? report.performancePercentage.toFixed(1)
										: "0.0"}
									%
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Overall facility performance
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Indicators
								</CardTitle>
								<Activity className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold text-blue-600">
									{report.summary.totalIndicators}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Indicators for {report.facility.type_display_name}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Achieved</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent className="p-3 sm:p-6">
								<div className="text-xl sm:text-2xl font-bold text-green-600">
									{report.summary.achievedIndicators}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Out of {report.summary.totalIndicators} indicators
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Detailed Performance Table */}
					<Card>
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<BarChart3 className="h-5 w-5" />
								Detailed Performance Report
							</CardTitle>
							<CardDescription className="text-sm">
								Indicators are numbered according to their order in the official
								source files for consistency with government documentation.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0 sm:p-6">
							<div className="overflow-x-auto">
								<table className="w-full min-w-full">
									<thead>
										<tr className="border-b">
											<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												#
											</th>
											<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Indicator
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Target
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Actual
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Achievement %
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Status
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Incentive
											</th>
											<th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												Calculation
											</th>
										</tr>
									</thead>
									<tbody>
										{report.indicators.map((indicator) => {
											const indicatorNumber = getIndicatorNumber(indicator);
											return (
												<tr
													key={indicator.id}
													className="border-b hover:bg-gray-50"
												>
													<td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
														<div className="inline-flex flex-col items-center justify-center w-7 h-12 sm:w-8 sm:h-14 text-blue-700 bg-blue-50 rounded-md border border-blue-200">
															<span className="text-xs sm:text-sm font-semibold leading-none">
																{indicatorNumber}
															</span>
															<span className="mt-1 text-[10px] sm:text-xs leading-none">
																{indicator.status === "achieved"
																	? "A"
																	: indicator.status === "partial"
																	? "P"
																	: "N"}
															</span>
														</div>
													</td>
													<td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">
														<div className="flex flex-col">
															<span className="font-medium text-xs sm:text-sm">
																{indicator.name}
															</span>
															<span className="text-xs text-gray-500 font-mono">
																{indicator.indicator_code}
															</span>
														</div>
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
														{indicator.target}
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
														{indicator.actual}
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
														<span
															className={`font-medium ${
																(indicator.percentage || 0) >= 100
																	? "text-green-600"
																	: (indicator.percentage || 0) >= 50
																	? "text-yellow-600"
																	: "text-red-600"
															}`}
														>
															{typeof indicator.percentage === "number"
																? indicator.percentage.toFixed(1)
																: "0.0"}
															%
														</span>
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
														<div className="flex items-center justify-center gap-2">
															{getStatusIcon(indicator.status)}
															{getStatusBadge(indicator.status)}
														</div>
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
														₹{indicator.incentive_amount.toFixed(2)}
													</td>
													<td className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
														<CalculationDetailsModal
															indicator={indicator}
															facilityType={report.facility.type}
														/>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					{/* Incentive Summary */}
					<Card>
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<DollarSign className="h-5 w-5" />
								Incentive Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
									<div>
										<h3 className="text-base sm:text-lg font-semibold text-green-800">
											Total Incentive Earned
										</h3>
										<p className="text-green-600 text-sm sm:text-base">
											{new Date(report.reportMonth + "-01").toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "long",
												}
											)}
										</p>
									</div>
									<div className="text-left sm:text-right">
										<div className="text-2xl sm:text-3xl font-bold text-green-800">
											₹{report.totalIncentive.toFixed(2)}
										</div>
										<p className="text-sm text-green-600">
											Based on {report.summary.achievedIndicators} achieved
											indicators
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Worker Remuneration Summary */}
					<Card>
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<DollarSign className="h-5 w-5" />
								Worker Remuneration Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="space-y-4 sm:space-y-6">
								{/* Performance Overview */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
										<div>
											<h3 className="text-base sm:text-lg font-semibold text-blue-800">
												Overall Performance
											</h3>
											<p className="text-blue-600 text-sm sm:text-base">
												Facility performance for{" "}
												{new Date(
													report.reportMonth + "-01"
												).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
												})}
											</p>
										</div>
										<div className="text-left sm:text-right">
											<div className="text-2xl sm:text-3xl font-bold text-blue-800">
												{typeof report.performancePercentage === "number"
													? report.performancePercentage.toFixed(1)
													: "0.0"}
												%
											</div>
											<p className="text-sm text-blue-600">
												{report.summary.achievedIndicators}/
												{report.summary.totalIndicators} indicators achieved
											</p>
										</div>
									</div>
								</div>

								{/* Workers Section */}
								{["UPHC", "U_HWC"].includes(report.facility.type) ? (
									// UPHC and UHWC are completely team-based - no individual workers
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
										<div className="flex items-start gap-3">
											<Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5" />
											<div>
												<h4 className="text-base sm:text-lg font-semibold text-blue-800">
													Team-Based Facility
												</h4>
												<p className="text-blue-700 text-sm">
													This facility operates on a team-based incentive
													system. Medical Officers receive team-based incentives
													included in the facility total. No individual worker
													incentives are calculated.
												</p>
											</div>
										</div>
									</div>
								) : report.workers.length > 0 ? (
									// Other facilities show individual workers
									<div>
										<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<Users className="h-5 w-5" /> Workers (
											{report.workers.length})
										</h4>
										<div className="overflow-x-auto">
											<table className="w-full min-w-full">
												<thead>
													<tr className="border-b">
														<th className="text-left py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
															Name
														</th>
														<th className="text-left py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
															Role
														</th>
														<th className="text-center py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
															Allocated Amount
														</th>
														<th className="text-center py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
															Performance
														</th>
														<th className="text-center py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
															Calculated Amount
														</th>
													</tr>
												</thead>
												<tbody>
													{report.workers.map((worker) => (
														<tr
															key={worker.id}
															className="border-b hover:bg-gray-50"
														>
															<td className="py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
																{worker.name}
															</td>
															<td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
																{worker.worker_role}
															</td>
															<td className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm">
																₹{worker.allocated_amount.toFixed(2)}
															</td>
															<td className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm">
																<span className="font-medium text-blue-600">
																	{typeof worker.performance_percentage ===
																	"number"
																		? worker.performance_percentage.toFixed(1)
																		: "0.0"}
																	%
																</span>
															</td>
															<td className="text-center py-2 px-2 sm:px-3 font-medium text-xs sm:text-sm">
																₹{worker.calculated_amount.toFixed(2)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								) : null}

								{/* Total Remuneration */}
								{["UPHC", "U_HWC"].includes(report.facility.type) ? (
									// UPHC and UHWC - team-based incentives only
									<div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
											<div>
												<h3 className="text-base sm:text-lg font-semibold text-green-800">
													Team-Based Incentives
												</h3>
												<p className="text-green-700 text-sm sm:text-base">
													Medical Officer incentives included in facility total
												</p>
											</div>
											<div className="text-left sm:text-right">
												<div className="text-2xl sm:text-3xl font-bold text-green-800">
													₹0.00
												</div>
												<p className="text-sm text-green-600">
													No individual worker incentives
												</p>
											</div>
										</div>
									</div>
								) : (
									// Other facilities - individual worker incentives
									<div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
											<div>
												<h3 className="text-base sm:text-lg font-semibold text-purple-800">
													Total Worker Remuneration
												</h3>
												<p className="text-purple-600 text-sm sm:text-base">
													Based on performance and allocated amounts
												</p>
											</div>
											<div className="text-left sm:text-right">
												<div className="text-2xl sm:text-3xl font-bold text-purple-800">
													₹{report.totalPersonalIncentives.toFixed(2)}
												</div>
												<p className="text-sm text-purple-600">
													{
														report.workers.filter((w) =>
															["hw", "asha", "colocated_sc_hw"].includes(
																w.worker_type.toLowerCase()
															)
														).length
													}{" "}
													performance-based workers at{" "}
													{typeof report.performancePercentage === "number"
														? report.performancePercentage.toFixed(1)
														: "0.0"}
													% performance
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
