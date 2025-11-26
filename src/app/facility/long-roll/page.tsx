"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Home,
	MapPin,
	Users,
	UserCircle,
	Loader2,
	AlertCircle,
} from "lucide-react";
import VillageManagement from "@/components/facility/long-roll/VillageManagement";
import SectionManagement from "@/components/facility/long-roll/SectionManagement";
import FamilyManagement from "@/components/facility/long-roll/FamilyManagement";
import FamilyMemberManagement from "@/components/facility/long-roll/FamilyMemberManagement";

export default function LongRollPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("villages");
	const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
	const [hasAccess, setHasAccess] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);

	// Debug logging
	console.log("Page state:", {
		activeTab,
		selectedVillage,
		selectedSection,
		selectedFamily,
	});

	useEffect(() => {
		const checkAccess = async () => {
			try {
				const response = await fetch("/api/facility/my-facility");
				const data = await response.json();

				if (data.facility && data.facility.has_clinic) {
					setHasAccess(true);
				} else {
					setHasAccess(false);
				}
			} catch (error) {
				console.error("Error checking access:", error);
				setHasAccess(false);
			} finally {
				setLoading(false);
			}
		};

		checkAccess();
	}, []);

	const handleVillageSelect = (villageId: string) => {
		console.log("Village selected:", villageId);
		setSelectedVillage(villageId);
		console.log("Setting active tab to sections");
		setActiveTab("sections");
	};

	const handleSectionSelect = (sectionId: string) => {
		setSelectedSection(sectionId);
		setActiveTab("families");
	};

	const handleFamilySelect = (familyId: string) => {
		setSelectedFamily(familyId);
		setActiveTab("members");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (hasAccess === false) {
		return (
			<div className="container mx-auto p-4 md:p-6">
				<Card className="max-w-2xl mx-auto mt-12">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-6 w-6" />
							Access Denied
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground mb-4">
							Long Roll Registration is only available for facilities with
							clinic infrastructure.
						</p>
						<p className="text-sm text-muted-foreground">
							Your facility does not have clinic access enabled. Please contact
							your administrator if you believe this is an error.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 md:p-6 space-y-6">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold">Long Roll Registration</h1>
					<p className="text-muted-foreground mt-2">
						Manage household registry data for your facility
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Household Registry Management</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger
									value="villages"
									className="flex items-center gap-2"
								>
									<Home className="h-4 w-4" />
									<span className="hidden sm:inline">Villages</span>
								</TabsTrigger>
								<TabsTrigger
									value="sections"
									className="flex items-center gap-2"
									disabled={!selectedVillage}
								>
									<MapPin className="h-4 w-4" />
									<span className="hidden sm:inline">Sections</span>
								</TabsTrigger>
								<TabsTrigger
									value="families"
									className="flex items-center gap-2"
									disabled={!selectedSection}
								>
									<Users className="h-4 w-4" />
									<span className="hidden sm:inline">Household/Families</span>
								</TabsTrigger>
								<TabsTrigger
									value="members"
									className="flex items-center gap-2"
									disabled={!selectedFamily}
								>
									<UserCircle className="h-4 w-4" />
									<span className="hidden sm:inline">Members</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent value="villages" className="mt-6">
								<VillageManagement onVillageSelect={handleVillageSelect} />
							</TabsContent>

							<TabsContent value="sections" className="mt-6">
								{(() => {
									console.log(
										"Sections TabsContent is rendering, selectedVillage:",
										selectedVillage
									);
									return (
										<SectionManagement
											selectedVillage={selectedVillage}
											onSectionSelect={handleSectionSelect}
											onBackToVillages={() => setActiveTab("villages")}
										/>
									);
								})()}
							</TabsContent>

							<TabsContent value="families" className="mt-6">
								<FamilyManagement
									selectedSection={selectedSection}
									onFamilySelect={handleFamilySelect}
									onBackToSections={() => setActiveTab("sections")}
								/>
							</TabsContent>

							<TabsContent value="members" className="mt-6">
								<FamilyMemberManagement
									selectedFamily={selectedFamily}
									onBackToHouseholds={() => setActiveTab("families")}
								/>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
