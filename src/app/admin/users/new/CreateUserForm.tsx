"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/generated/prisma";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { createUserAction } from "../actions"; // Adjusted path to actions.ts
import { toast } from "sonner";

export default function CreateUserForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		role: "facility" as UserRole,
		is_active: true,
		district_id: "",
		facility_type_filter_id: "",
		facility_id: "",
	});

	// Reference lists
	const [districts, setDistricts] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [facilityTypes, setFacilityTypes] = useState<
		Array<{ id: string; name: string; display_name?: string }>
	>([]);
	const [facilities, setFacilities] = useState<
		Array<{ id: string; name: string }>
	>([]);

	// Load districts and facility types once
	useEffect(() => {
		(async () => {
			try {
				const [dRes, ftRes] = await Promise.all([
					fetch("/api/districts"),
					fetch("/api/facility-types"),
				]);
				if (dRes.ok) {
					const dJson = await dRes.json();
					const list = (dJson.districts || dJson).map((d: any) => ({
						id: d.id,
						name: d.name,
					}));
					setDistricts(list);
				}
				if (ftRes.ok) {
					const ftJson = await ftRes.json();
					const list = (ftJson.facilityTypes || ftJson).map((t: any) => ({
						id: t.id,
						name: t.display_name || t.name,
					}));
					setFacilityTypes(list);
				}
			} catch (e) {
				console.error("Failed to load reference lists", e);
			}
		})();
	}, []);

	// Load facilities when district changes or facility type filter changes (only when role is facility)
	useEffect(() => {
		if (formData.role !== "facility" || !formData.district_id) {
			setFacilities([]);
			return;
		}
		(async () => {
			try {
				const params = new URLSearchParams({
					districtId: formData.district_id,
				});
				if (formData.facility_type_filter_id)
					params.set("facilityTypeId", formData.facility_type_filter_id);
				const res = await fetch(`/api/facilities?${params}`);
				if (res.ok) {
					const json = await res.json();
					const list = (json.data || json.facilities || []).map((f: any) => ({
						id: f.id,
						name: f.name,
					}));
					setFacilities(list);
				}
			} catch (e) {
				console.error("Failed to load facilities", e);
			}
		})();
	}, [formData.role, formData.district_id, formData.facility_type_filter_id]);

	const router = useRouter();

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target as HTMLInputElement;
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData({ ...formData, [name]: checked });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	// Reset dependent selections when role changes away from facility
	useEffect(() => {
		if (formData.role !== "facility") {
			setFormData((prev) => ({
				...prev,
				district_id: "",
				facility_type_filter_id: "",
				facility_id: "",
			}));
		}
	}, [formData.role]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (!formData.username || !formData.password) {
			setError("Username and password are required");
			setLoading(false);
			return;
		}

		if (formData.role === "facility" && !formData.facility_id) {
			setError("Please select a facility for facility users");
			setLoading(false);
			return;
		}

		const result = await createUserAction({
			username: formData.username,
			email: formData.email || undefined,
			password: formData.password,
			role: formData.role as any,
			is_active: formData.is_active,
			facility_id:
				formData.role === "facility" && formData.facility_id
					? formData.facility_id
					: undefined,
		} as any);
		setLoading(false);

		if (result.success) {
			toast.success("User created successfully.");
			router.push("/admin/users"); // Redirect to user list
		} else {
			console.error("Failed to create user:", result.error);
			setError(result.error || "Failed to create user. Please try again.");
			toast.error(result.error || "Failed to create user. Please try again.");
		}
	};

	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<Link
						href="/admin/users"
						className="mr-4 text-gray-500 hover:text-gray-700"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1 className="text-2xl font-semibold text-gray-900">
						Create New User
					</h1>
				</div>
			</div>

			<div className="bg-white shadow overflow-hidden sm:rounded-lg">
				<form onSubmit={handleSubmit}>
					<div className="px-4 py-5 sm:p-6">
						{error && (
							<div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
								{error}
							</div>
						)}

						<div className="grid grid-cols-1 gap-6">
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-gray-700"
								>
									Username
								</label>
								<div className="mt-1">
									<input
										type="text"
										name="username"
										id="username"
										value={formData.username}
										onChange={handleInputChange}
										required
										className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email (optional)
								</label>
								<div className="mt-1">
									<input
										type="email"
										name="email"
										id="email"
										value={formData.email}
										onChange={handleInputChange}
										className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<div className="mt-1">
									<input
										type="password"
										name="password"
										id="password"
										value={formData.password}
										onChange={handleInputChange}
										required
										className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="role"
									className="block text-sm font-medium text-gray-700"
								>
									Role
								</label>
								<div className="mt-1">
									<select
										id="role"
										name="role"
										value={formData.role}
										onChange={handleInputChange}
										className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
									>
										<option value="admin">Admin</option>
										<option value="facility">Facility</option>
									</select>
								</div>
							</div>

							{formData.role === "facility" && (
								<>
									<div>
										<label
											htmlFor="district_id"
											className="block text-sm font-medium text-gray-700"
										>
											District
										</label>
										<div className="mt-1">
											<select
												id="district_id"
												name="district_id"
												value={formData.district_id}
												onChange={handleInputChange}
												className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
											>
												<option value="">Select district</option>
												{districts.map((d) => (
													<option key={d.id} value={d.id}>
														{d.name}
													</option>
												))}
											</select>
										</div>
									</div>

									<div>
										<label
											htmlFor="facility_type_filter_id"
											className="block text-sm font-medium text-gray-700"
										>
											Facility Type (optional filter)
										</label>
										<div className="mt-1">
											<select
												id="facility_type_filter_id"
												name="facility_type_filter_id"
												value={formData.facility_type_filter_id}
												onChange={handleInputChange}
												className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
											>
												<option value="">All types</option>
												{facilityTypes.map((t) => (
													<option key={t.id} value={t.id}>
														{t.name}
													</option>
												))}
											</select>
										</div>
									</div>

									<div>
										<label
											htmlFor="facility_id"
											className="block text-sm font-medium text-gray-700"
										>
											Facility
										</label>
										<div className="mt-1">
											<select
												id="facility_id"
												name="facility_id"
												value={formData.facility_id}
												onChange={handleInputChange}
												className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
											>
												<option value="">Select facility</option>
												{facilities.map((f) => (
													<option key={f.id} value={f.id}>
														{f.name}
													</option>
												))}
											</select>
										</div>
									</div>
								</>
							)}

							<div className="flex items-center">
								<input
									id="is_active"
									name="is_active"
									type="checkbox"
									checked={formData.is_active}
									onChange={handleInputChange}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="is_active"
									className="ml-2 block text-sm text-gray-900"
								>
									Active
								</label>
							</div>
						</div>
					</div>

					<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
						<Link
							href="/admin/users"
							className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{loading ? (
								<>
									<Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
									Creating...
								</>
							) : (
								<>
									<Save className="-ml-1 mr-2 h-4 w-4" />
									Create User
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
