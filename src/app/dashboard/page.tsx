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
import TemplateGenerator from "@/components/dashboard/template-generator";
import EnhancedIndicators from "@/components/dashboard/enhanced-indicators";
 
import { Download, BarChart3, Target } from "lucide-react";

type ActiveTab = "overview" | "template" | "enhanced-indicators";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

	const navigateToTab = (tab: ActiveTab) => {
		setActiveTab(tab);
	};

	const tabs = [
		{
			id: "overview" as const,
			label: "Dashboard",
			icon: BarChart3,
			description: "Dashboard overview and key metrics",
			badge: null,
		},
		{
			id: "template" as const,
			label: "Generate Template",
			icon: Download,
			description: "Create Excel templates for data collection",
			badge: "Excel",
		},
		{
			id: "enhanced-indicators" as const,
			label: "Enhanced Indicators",
			icon: Target,
			description: "Complex healthcare indicators with configurations",
			badge: "New",
		},
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return <DashboardOverview />;
			case "template":
				return <TemplateGenerator />;
			case "enhanced-indicators":
				return <EnhancedIndicators />;
			default:
				return <DashboardOverview />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Health & Family Welfare Dashboard
							</h1>
							<p className="text-gray-600 mt-1">
								Mizoram State - Monthly PLP Report Management System
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-gray-500">Government of Mizoram</div>
						</div>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors relative ${
										activeTab === tab.id
											? "border-blue-500 text-blue-600 bg-blue-50"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
									}`}
								>
									<Icon className="h-5 w-5" />
									<span>{tab.label}</span>
									{tab.badge && (
										<span
											className={`px-2 py-1 text-xs rounded-full font-medium ${
												activeTab === tab.id
													? "bg-blue-200 text-blue-800"
													: "bg-gray-200 text-gray-600"
											}`}
										>
											{tab.badge}
										</span>
									)}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{tabs.find((tab) => tab.id === activeTab)?.label}
							</h2>
							<p className="text-gray-600 mt-1">
								{tabs.find((tab) => tab.id === activeTab)?.description}
							</p>
						</div>
						<div className="text-sm text-gray-500">
							{activeTab === "template" && "📥 Excel Download"}
							{activeTab === "overview" && "🏠 Dashboard Home"}
						</div>
					</div>
				</div>

				{renderTabContent()}
			</main>
		</div>
	);
}

// Dashboard Overview Component
function DashboardOverview() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Districts
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">Mizoram State</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Health Facilities
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">114</div>
						<p className="text-xs text-muted-foreground">Active facilities</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Enhanced Indicators
						</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">24</div>
						<p className="text-xs text-muted-foreground">
							Complex healthcare indicators
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Download className="h-5 w-5" />
							Generate Template
						</CardTitle>
						<CardDescription>
							Create Excel templates for monthly data collection
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600 mb-4">
							Generate customized Excel templates with pre-configured
							indicators, facilities, and validation rules for efficient data
							collection.
						</p>
						<Button className="w-full">
							<Download className="h-4 w-4 mr-2" />
							Create Template
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* System Status */}
			<Card>
				<CardHeader>
					<CardTitle>System Status</CardTitle>
					<CardDescription>
						Current status of the PLP report management system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-sm">Database Online</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-sm">Template Generator Ready</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Analytics tab and related charts have been removed as the corresponding API route was deprecated.
