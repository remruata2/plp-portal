"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
	BarChart3,
	Calendar,
	DollarSign,
	Users,
	TrendingUp,
	TrendingDown,
	Target,
	ArrowLeft,
} from "lucide-react";
import { getIndicatorNumber } from "@/lib/utils/indicator-sort-order";
import { CalculationDetailsModal } from "@/components/calculation-details-modal";

interface PerformanceIndicator {
	id: number;
	name: string;
	code: string;
	target: string;
	actual: number;
	percentage: number;
	status: "achieved" | "partial" | "not_achieved";
	incentive_amount: number;
	numerator_value?: number;
	denominator_value?: number;
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

interface ReportResponse {
	facility: {
		id: string;
		name: string;
		display_name: string;
		type: string;
		type_display_name: string;
		district: string;
	};
	reportMonth: string;
	totalIncentive: number;
	totalWorkerRemuneration: number;
	totalRemuneration: number;
	performancePercentage: number;
	indicators: PerformanceIndicator[];
	workers: WorkerRemuneration[];
	summary: {
		totalIndicators: number;
		achievedIndicators: number;
		partialIndicators: number;
		notAchievedIndicators: number;
	};
	lastUpdated?: string;
}

export default function AdminFacilityReportPage({
	params,
}: {
	params: Promise<{ facilityId: string; reportMonth: string }>;
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [report, setReport] = useState<ReportResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (session?.user?.role === "admin") {
			loadReport();
		}
	}, [session]);

	const loadReport = async () => {
		try {
			setLoading(true);
			const { facilityId, reportMonth } = await params;
			const res = await fetch(
				`/api/admin/performance-reports/${facilityId}/${reportMonth}`
			);
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Failed to load report");
			}
			const data = await res.json();
			setReport(data);
		} catch (e: any) {
			setError(e.message || "Failed to load report");
		} finally {
			setLoading(false);
		}
	};

	if (!session?.user || session.user.role !== "admin") {
		return null;
	}

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

	if (error || !report) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-center text-gray-500">
							{error || "Report not found"}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		const config = {
			achieved: {
				text: "Achieved",
				className: "bg-green-100 text-green-800",
			},
			partial: {
				text: "Partial",
				className: "bg-yellow-100 text-yellow-800",
			},
			not_achieved: {
				text: "Not Achieved",
				className: "bg-red-100 text-red-800",
			},
		};
		const s = config[status as keyof typeof config] || config.not_achieved;
		return <Badge className={s.className}>{s.text}</Badge>;
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

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	const formatMonth = (month: string) =>
		new Date(month + "-01").toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
		});

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Incentive Report
					</h1>
					<p className="text-gray-600 flex items-center gap-2">
						{report.facility.display_name} • {report.facility.type_display_name}{" "}
						• <Calendar className="h-4 w-4" /> {formatMonth(report.reportMonth)}
					</p>
				</div>
				<Button variant="outline" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4 mr-2" /> Back
				</Button>
			</div>

			{/* Summary Cards (mirrors facility page) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<DollarSign className="h-4 w-4 text-gray-500" /> Facility
							Incentives
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold leading-none tabular-nums">
							{formatCurrency(report.totalIncentive)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							MO team-based incentive or facility sum
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<Users className="h-4 w-4 text-blue-500" /> Personal Incentives
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold text-blue-600 leading-none tabular-nums">
							{formatCurrency(report.totalWorkerRemuneration)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							Sum of HW/ASHA incentives
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<DollarSign className="h-4 w-4 text-purple-500" /> Total
							Remuneration
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold text-purple-600 leading-none tabular-nums">
							{formatCurrency(report.totalRemuneration)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							Facility + Personal incentives
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<TrendingUp className="h-4 w-4 text-green-600" /> Performance
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold text-green-600 leading-none tabular-nums">
							{report.performancePercentage.toFixed(1)}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							Average across indicators (capped at 100%)
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<BarChart3 className="h-4 w-4 text-blue-600" /> Total Indicators
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold text-blue-600 leading-none tabular-nums">
							{report.summary.totalIndicators}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							Configured for this facility type
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2 h-12">
						<CardTitle className="text-sm flex items-center gap-2 truncate">
							<TrendingUp className="h-4 w-4 text-green-600" /> Achieved
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="text-2xl sm:text-3xl font-bold text-green-600 leading-none tabular-nums">
							{report.summary.achievedIndicators}
						</div>
						<div className="text-xs text-gray-500 mt-1">Indicators at 100%</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Performance Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Detailed Performance Report
					</CardTitle>
					<CardDescription>
						Indicators are numbered according to the official order.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 sm:p-6">
					<div className="overflow-x-auto">
						<table className="w-full min-w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">
										#
									</th>
									<th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Indicator
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Target
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Actual
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Achievement %
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Status
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Incentive
									</th>
									<th className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
										Calculation
									</th>
								</tr>
							</thead>
							<tbody>
								{[...report.indicators]
									.sort((a, b) => getIndicatorNumber(a) - getIndicatorNumber(b))
									.map((ind) => (
										<tr key={ind.id} className="border-b">
											<td className="py-2 px-2 sm:px-4 text-center">
												<span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
													{getIndicatorNumber(ind)}
												</span>
											</td>
											<td className="py-2 px-2 sm:px-4">
												<div className="flex flex-col">
													<span className="font-medium text-xs sm:text-sm">
														{ind.name}
													</span>
													<span className="text-xs text-gray-500 font-mono">
														{ind.code}
													</span>
												</div>
											</td>
											<td className="text-center text-xs sm:text-sm">
												{ind.target}
											</td>
											<td className="text-center text-xs sm:text-sm">
												{ind.actual}
											</td>
											<td className="text-center text-xs sm:text-sm">
												{ind.percentage.toFixed(1)}%
											</td>
											<td className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
												<div className="flex items-center justify-center gap-2">
													{getStatusIcon(ind.status)}
													{getStatusBadge(ind.status)}
												</div>
											</td>
											<td className="text-center font-medium text-xs sm:text-sm">
												{formatCurrency(ind.incentive_amount)}
											</td>
											<td className="text-center py-2 px-2 sm:px-4 text-xs sm:text-sm">
												<CalculationDetailsModal
													indicator={{
														...(ind as any),
														indicator_code: ind.code,
													}}
													facilityType={report.facility.type}
												/>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Workers */}
			{report.workers.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Workers ({report.workers.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full min-w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm">
											Name
										</th>
										<th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm">
											Role
										</th>
										<th className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm">
											Allocated
										</th>
										<th className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm">
											Performance
										</th>
										<th className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm">
											Calculated
										</th>
									</tr>
								</thead>
								<tbody>
									{report.workers.map((w) => (
										<tr key={w.id} className="border-b">
											<td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
												{w.name}
											</td>
											<td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
												{w.worker_role}
											</td>
											<td className="text-center text-xs sm:text-sm">
												{formatCurrency(w.allocated_amount)}
											</td>
											<td className="text-center text-xs sm:text-sm">
												{w.performance_percentage.toFixed(1)}%
											</td>
											<td className="text-center text-xs sm:text-sm">
												{formatCurrency(w.calculated_amount)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
