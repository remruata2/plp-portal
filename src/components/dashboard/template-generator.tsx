"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, MapPin, Building } from "lucide-react";

interface District {
	id: number;
	name: string;
}

interface Facility {
	id: number;
	name: string;
	district_id: number;
	facility_type: {
		name: string;
	};
}

export default function TemplateGenerator() {
	const [districts, setDistricts] = useState<District[]>([]);
	const [facilities, setFacilities] = useState<Facility[]>([]);
	const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
	const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
	const [reportMonth, setReportMonth] = useState("");
	const [includeSubCentres, setIncludeSubCentres] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);

	useEffect(() => {
		// Set default month to current month
		const now = new Date();
		const defaultMonth = `${now.getFullYear()}-${String(
			now.getMonth() + 1
		).padStart(2, "0")}`;
		setReportMonth(defaultMonth);

		// Load districts
		fetchDistricts();
	}, []);

	useEffect(() => {
		if (selectedDistrict) {
			fetchFacilities(selectedDistrict);
		} else {
			setFacilities([]);
			setSelectedFacilities([]);
		}
	}, [selectedDistrict]);

	const fetchDistricts = async () => {
		try {
			const response = await fetch("/api/districts");
			const data = await response.json();
			setDistricts(data.districts || []);
		} catch (error) {
			console.error("Error fetching districts:", error);
		}
	};

	const fetchFacilities = async (districtId: number) => {
		try {
			const response = await fetch(`/api/facilities?districtId=${districtId}`);
			const data = await response.json();
			setFacilities(data.facilities || []);
		} catch (error) {
			console.error("Error fetching facilities:", error);
		}
	};

	const handleFacilityToggle = (facilityId: number) => {
		setSelectedFacilities((prev) =>
			prev.includes(facilityId)
				? prev.filter((id) => id !== facilityId)
				: [...prev, facilityId]
		);
	};

	const handleSelectAllFacilities = () => {
		if (selectedFacilities.length === facilities.length) {
			setSelectedFacilities([]);
		} else {
			setSelectedFacilities(facilities.map((f) => f.id));
		}
	};

	const generateTemplate = async () => {
		if (!reportMonth) {
			alert("Please select a report month");
			return;
		}

		setIsGenerating(true);

		try {
			const params = new URLSearchParams({
				reportMonth,
				includeSubCentres: includeSubCentres.toString(),
			});

			if (selectedDistrict) {
				params.append("districtId", selectedDistrict.toString());
			}

			if (selectedFacilities.length > 0) {
				params.append("facilityIds", selectedFacilities.join(","));
			}

			const response = await fetch(`/api/data/template?${params.toString()}`);

			if (!response.ok) {
				throw new Error("Failed to generate template");
			}

			// Download the file
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `health_data_template_${reportMonth}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Error generating template:", error);
			alert("Failed to generate template. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Download className="h-6 w-6" />
					Generate Excel Template
				</CardTitle>
				<CardDescription>
					Generate customized Excel templates for monthly PLP report collection
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Report Month Selection */}
				<div className="space-y-2">
					<label className="text-sm font-medium flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						Report Month
					</label>
					<input
						type="month"
						value={reportMonth}
						onChange={(e) => setReportMonth(e.target.value)}
						className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				{/* District Selection */}
				<div className="space-y-2">
					<label className="text-sm font-medium flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						District (Optional)
					</label>
					<select
						value={selectedDistrict || ""}
						onChange={(e) =>
							setSelectedDistrict(
								e.target.value ? parseInt(e.target.value) : null
							)
						}
						className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Districts</option>
						{districts.map((district) => (
							<option key={district.id} value={district.id}>
								{district.name}
							</option>
						))}
					</select>
				</div>

				{/* Facility Selection */}
				{selectedDistrict && facilities.length > 0 && (
					<div className="space-y-2">
						<label className="text-sm font-medium flex items-center gap-2">
							<Building className="h-4 w-4" />
							Facilities (Optional - leave empty for all facilities)
						</label>

						<div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
							<div className="flex items-center justify-between mb-3">
								<span className="text-sm text-gray-600">
									{selectedFacilities.length} of {facilities.length} selected
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={handleSelectAllFacilities}
								>
									{selectedFacilities.length === facilities.length
										? "Deselect All"
										: "Select All"}
								</Button>
							</div>

							<div className="grid grid-cols-1 gap-2">
								{facilities.map((facility) => (
									<label
										key={facility.id}
										className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
									>
										<input
											type="checkbox"
											checked={selectedFacilities.includes(facility.id)}
											onChange={() => handleFacilityToggle(facility.id)}
											className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<div className="flex-1">
											<div className="text-sm font-medium">{facility.name}</div>
											<div className="text-xs text-gray-500">
												{facility.facility_type.name}
											</div>
										</div>
									</label>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Sub-centres Option */}
				<div className="space-y-2">
					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={includeSubCentres}
							onChange={(e) => setIncludeSubCentres(e.target.checked)}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="text-sm font-medium">Include Sub-centres</span>
					</label>
					<p className="text-xs text-gray-500">
						Include sub-centre level data collection rows in the template
					</p>
				</div>

				{/* Generate Button */}
				<div className="pt-4 border-t">
					<Button
						onClick={generateTemplate}
						disabled={isGenerating || !reportMonth}
						className="w-full"
						size="lg"
					>
						{isGenerating ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Generating Template...
							</>
						) : (
							<>
								<Download className="h-4 w-4 mr-2" />
								Generate Excel Template
							</>
						)}
					</Button>
				</div>

				{/* Instructions */}
				<div className="bg-blue-50 p-4 rounded-lg">
					<h4 className="text-sm font-medium text-blue-900 mb-2">
						Instructions:
					</h4>
					<ul className="text-xs text-blue-800 space-y-1">
						<li>• Select the month for data collection</li>
						<li>• Optionally filter by district and specific facilities</li>
						<li>
							• The generated Excel will include all active health indicators
						</li>
						<li>
							• Templates include data validation and calculation formulas
						</li>
						<li>• Fill the template and upload it back for processing</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
