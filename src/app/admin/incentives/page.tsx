"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Loader2,
	FileText,
	Download,
	Search,
	Filter,
	Users,
	Calculator,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// Local type matching the API response from `/api/admin/remuneration-report`
type RemunerationRow = {
	facilityId: string;
	facilityName: string;
	facilityType: string;
	districtName: string;
	reportMonth: string;
	performancePercentage: number;
	totalAllocatedAmount: number;
	facilityRemuneration: number;
	totalRemuneration: number;
	// Derived fields for table/UI
	healthWorkers: Array<{ id: number; calculatedAmount: number }>;
	ashaWorkers: Array<{ id: number; calculatedAmount: number }>;
	totalWorkerRemuneration: number;
};

export default function RemunerationPage() {
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(true);
	const [calculations, setCalculations] = useState<RemunerationRow[]>([]);
	const [filteredCalculations, setFilteredCalculations] = useState<
		RemunerationRow[]
	>([]);
	const [reportMonth, setReportMonth] = useState(() => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const monthString = `${year}-${month}`;
		console.log("Initial reportMonth set to:", monthString);
		return monthString;
	});
	const [filters, setFilters] = useState({
		facilityType: "all",
		district: "all",
		searchTerm: "",
	});

	useEffect(() => {
		if (status === "loading") {
			return; // Still loading session
		}

		if (session?.user && reportMonth) {
			loadRemunerationData(reportMonth);
		} else if (status === "unauthenticated") {
			setLoading(false);
			setCalculations([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, status, reportMonth]);

	useEffect(() => {
		applyFilters();
	}, [calculations, filters]);

	// Reset filters when reportMonth changes to avoid showing stale filtered data
	useEffect(() => {
		setFilters({
			facilityType: "all",
			district: "all",
			searchTerm: "",
		});
	}, [reportMonth]);

	const loadRemunerationData = async (month?: string) => {
		const monthToLoad = month || reportMonth;
		if (!monthToLoad || !monthToLoad.match(/^\d{4}-\d{2}$/)) {
			console.error("Invalid month format:", monthToLoad);
			toast.error("Invalid month format. Please use YYYY-MM format.");
			return;
		}
		try {
			setLoading(true);
			console.log("Loading remuneration data for month:", monthToLoad);
			// Add timestamp to prevent browser caching
			const timestamp = Date.now();
			const res = await fetch(
				`/api/admin/remuneration-report?reportMonth=${encodeURIComponent(
					monthToLoad
				)}&_t=${timestamp}`,
				{ cache: "no-store" }
			);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || `Request failed with ${res.status}`);
			}
			const body = (await res.json()) as {
				success: boolean;
				data: RemunerationRow[];
				error?: string;
			};
			if (!body.success) throw new Error(body.error || "Unknown error");
			console.log(
				`Loaded ${body.data?.length || 0} facilities for month ${monthToLoad}`
			);

			// Filter data to ensure it matches the requested month (safety check)
			const filteredData = (body.data || []).filter((calc) => {
				// If reportMonth is provided in the data, it must match
				if (calc.reportMonth) {
					return calc.reportMonth === monthToLoad;
				}
				// If no reportMonth in data, include it (legacy data)
				return true;
			});

			if (filteredData.length !== body.data?.length) {
				console.warn(
					`Filtered out ${
						(body.data?.length || 0) - filteredData.length
					} records with mismatched months. Expected ${monthToLoad}`
				);
			}

			setCalculations(filteredData);
		} catch (error) {
			console.error("Error loading incentives data:", error);
			toast.error("Failed to load incentives data");
			setCalculations([]);
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...calculations];

		// Filter by facility type
		if (filters.facilityType && filters.facilityType !== "all") {
			filtered = filtered.filter(
				(calc) => calc.facilityType === filters.facilityType
			);
		}

		// Filter by district
		if (filters.district && filters.district !== "all") {
			filtered = filtered.filter(
				(calc) => calc.districtName === filters.district
			);
		}

		// Filter by search term
		if (filters.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(calc) =>
					calc.facilityName.toLowerCase().includes(searchLower) ||
					calc.facilityType.toLowerCase().includes(searchLower) ||
					calc.districtName.toLowerCase().includes(searchLower)
			);
		}

		setFilteredCalculations(filtered);
	};

	// Get available facility types based on current filters (excluding the facility type filter itself)
	const getAvailableFacilityTypes = () => {
		let filtered = [...calculations];

		// Apply district filter if set
		if (filters.district && filters.district !== "all") {
			filtered = filtered.filter(
				(calc) => calc.districtName === filters.district
			);
		}

		// Apply search term filter if set
		if (filters.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(calc) =>
					calc.facilityName.toLowerCase().includes(searchLower) ||
					calc.facilityType.toLowerCase().includes(searchLower) ||
					calc.districtName.toLowerCase().includes(searchLower)
			);
		}

		const types = new Set(filtered.map((calc) => calc.facilityType));
		return Array.from(types).sort();
	};

	// Get available districts based on current filters (excluding the district filter itself)
	const getAvailableDistricts = () => {
		let filtered = [...calculations];

		// Apply facility type filter if set
		if (filters.facilityType && filters.facilityType !== "all") {
			filtered = filtered.filter(
				(calc) => calc.facilityType === filters.facilityType
			);
		}

		// Apply search term filter if set
		if (filters.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(calc) =>
					calc.facilityName.toLowerCase().includes(searchLower) ||
					calc.facilityType.toLowerCase().includes(searchLower) ||
					calc.districtName.toLowerCase().includes(searchLower)
			);
		}

		const districts = new Set(filtered.map((calc) => calc.districtName));
		return Array.from(districts).sort();
	};

	const clearFilters = () => {
		setFilters({
			facilityType: "all",
			district: "all",
			searchTerm: "",
		});
	};

	const hasActiveFilters = () => {
		return (
			(filters.facilityType && filters.facilityType !== "all") ||
			(filters.district && filters.district !== "all") ||
			filters.searchTerm !== ""
		);
	};

	const getPerformanceBadge = (percentage: number) => {
		if (percentage >= 80) {
			return <Badge variant="default">Excellent</Badge>;
		} else if (percentage >= 60) {
			return <Badge variant="secondary">Good</Badge>;
		} else if (percentage >= 40) {
			return <Badge variant="outline">Average</Badge>;
		} else {
			return <Badge variant="destructive">Poor</Badge>;
		}
	};

	const downloadCSV = () => {
		if (filteredCalculations.length === 0) {
			toast.error("No data to download");
			return;
		}

		const headers = [
			"Facility Name",
			"Facility Type",
			"District",
			"Performance %",
			"Total Allocated Amount",
			"Facility Remuneration",
			"Health Workers Count",
			"ASHA Workers Count",
			"Total Worker Remuneration",
			"Total Incentives",
		];

		const csvData = filteredCalculations.map((calc) => [
			calc.facilityName,
			calc.facilityType,
			calc.districtName,
			`${calc.performancePercentage.toFixed(1)}%`,
			`₹${calc.totalAllocatedAmount.toLocaleString()}`,
			`₹${calc.facilityRemuneration.toLocaleString()}`,
			calc.healthWorkers.length,
			calc.ashaWorkers.length,
			`₹${calc.totalWorkerRemuneration.toLocaleString()}`,
			`₹${calc.totalRemuneration.toLocaleString()}`,
		]);

		const csvContent = [headers, ...csvData]
			.map((row) => row.map((cell) => `"${cell}"`).join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `incentives-report-${reportMonth}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success("Incentives report downloaded successfully");
	};

	const totalRemuneration = filteredCalculations.reduce(
		(sum, calc) => sum + calc.totalRemuneration,
		0
	);

	const totalHealthWorkers = filteredCalculations.reduce(
		(sum, calc) => sum + calc.healthWorkers.length,
		0
	);

	const totalASHAWorkers = filteredCalculations.reduce(
		(sum, calc) => sum + calc.ashaWorkers.length,
		0
	);

	const averagePerformance =
		filteredCalculations.length > 0
			? filteredCalculations.reduce(
					(sum, calc) => sum + calc.performancePercentage,
					0
			  ) / filteredCalculations.length
			: 0;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading incentives data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Incentives Report
					</h1>
					<p className="text-gray-600">
						Health workers and ASHA workers incentives calculations
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge variant="outline" className="text-sm">
						{session?.user?.role}
					</Badge>
					<Button onClick={downloadCSV} className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Download CSV
					</Button>
				</div>
			</div>

			{/* Report Month Selector */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calculator className="h-5 w-5" />
						Report Period
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Report Month
							</label>
							<Input
								type="month"
								value={reportMonth}
								onChange={(e) => {
									const newMonth = e.target.value;
									if (newMonth && newMonth.match(/^\d{4}-\d{2}$/)) {
										setReportMonth(newMonth);
										// Load data immediately with the new month to avoid stale state
										loadRemunerationData(newMonth);
									}
								}}
								className="w-48"
							/>
						</div>
						<Button
							onClick={() => loadRemunerationData(reportMonth)}
							className="flex items-center gap-2"
							disabled={loading}
						>
							<TrendingUp className="h-4 w-4" />
							{loading ? "Loading..." : "Refresh"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Incentives
								</p>
								<p className="text-2xl font-bold text-gray-900">
									₹{totalRemuneration.toLocaleString()}
								</p>
							</div>
							<Calculator className="h-8 w-8 text-gray-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Health Workers
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalHealthWorkers}
								</p>
							</div>
							<Users className="h-8 w-8 text-gray-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									ASHA Workers
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalASHAWorkers}
								</p>
							</div>
							<Users className="h-8 w-8 text-gray-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Avg Performance
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{averagePerformance.toFixed(1)}%
								</p>
							</div>
							<TrendingUp className="h-8 w-8 text-gray-400" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Filter className="h-5 w-5" />
							Filters
						</CardTitle>
						{hasActiveFilters() && (
							<Button
								variant="outline"
								size="sm"
								onClick={clearFilters}
								className="text-xs"
							>
								Clear Filters
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Search
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search facilities..."
									value={filters.searchTerm}
									onChange={(e) =>
										setFilters({ ...filters, searchTerm: e.target.value })
									}
									className="pl-10"
								/>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Facility Type
							</label>
							<Select
								value={filters.facilityType}
								onValueChange={(value) => {
									// Update facility type filter
									const newFilters = { ...filters, facilityType: value };

									// Check if the current district filter is still valid with the new facility type
									if (value !== "all" && filters.district !== "all") {
										let filtered = [...calculations];
										// Apply search term filter if set
										if (filters.searchTerm) {
											const searchLower = filters.searchTerm.toLowerCase();
											filtered = filtered.filter(
												(calc) =>
													calc.facilityName
														.toLowerCase()
														.includes(searchLower) ||
													calc.facilityType
														.toLowerCase()
														.includes(searchLower) ||
													calc.districtName.toLowerCase().includes(searchLower)
											);
										}
										// Apply the new facility type filter
										filtered = filtered.filter(
											(calc) => calc.facilityType === value
										);
										// Check if current district exists in filtered results
										const availableDistricts = new Set(
											filtered.map((calc) => calc.districtName)
										);
										if (!availableDistricts.has(filters.district)) {
											newFilters.district = "all";
										}
									}

									// Update filters - this will trigger applyFilters via useEffect
									setFilters(newFilters);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="All types" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All types</SelectItem>
									{getAvailableFacilityTypes().map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								District
							</label>
							<Select
								value={filters.district}
								onValueChange={(value) => {
									// Update district filter
									const newFilters = { ...filters, district: value };

									// Check if the current facility type filter is still valid with the new district
									if (value !== "all" && filters.facilityType !== "all") {
										let filtered = [...calculations];
										// Apply search term filter if set
										if (filters.searchTerm) {
											const searchLower = filters.searchTerm.toLowerCase();
											filtered = filtered.filter(
												(calc) =>
													calc.facilityName
														.toLowerCase()
														.includes(searchLower) ||
													calc.facilityType
														.toLowerCase()
														.includes(searchLower) ||
													calc.districtName.toLowerCase().includes(searchLower)
											);
										}
										// Apply the new district filter
										filtered = filtered.filter(
											(calc) => calc.districtName === value
										);
										// Check if current facility type exists in filtered results
										const availableTypes = new Set(
											filtered.map((calc) => calc.facilityType)
										);
										if (!availableTypes.has(filters.facilityType)) {
											newFilters.facilityType = "all";
										}
									}

									// Update filters - this will trigger applyFilters via useEffect
									setFilters(newFilters);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="All districts" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All districts</SelectItem>
									{getAvailableDistricts().map((district) => (
										<SelectItem key={district} value={district}>
											{district}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Data Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Incentives Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredCalculations.length > 0 ? (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Facility</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>District</TableHead>
										<TableHead>Performance</TableHead>
										<TableHead>Health Workers</TableHead>
										<TableHead>ASHA Workers</TableHead>
										<TableHead>Total Incentives</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCalculations.map((calc) => (
										<TableRow key={calc.facilityId}>
											<TableCell className="font-medium">
												{calc.facilityName}
											</TableCell>
											<TableCell>{calc.facilityType}</TableCell>
											<TableCell>{calc.districtName}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{getPerformanceBadge(calc.performancePercentage)}
													<span className="text-sm text-gray-600">
														{calc.performancePercentage.toFixed(1)}%
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-center">
													<div className="font-medium">
														{calc.healthWorkers.length}
													</div>
													<div className="text-xs text-gray-500">
														₹
														{calc.healthWorkers
															.reduce((sum, w) => sum + w.calculatedAmount, 0)
															.toLocaleString()}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-center">
													<div className="font-medium">
														{calc.ashaWorkers.length}
													</div>
													<div className="text-xs text-gray-500">
														₹
														{calc.ashaWorkers
															.reduce((sum, w) => sum + w.calculatedAmount, 0)
															.toLocaleString()}
													</div>
												</div>
											</TableCell>
											<TableCell className="font-medium">
												₹{calc.totalRemuneration.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="text-center text-gray-500 py-8">
							<FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p className="text-lg font-medium mb-2">
								No incentives data found
							</p>
							<p className="text-sm">
								{calculations.length === 0
									? "No facilities have health workers or ASHA workers configured"
									: "No facilities match the current filters"}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
