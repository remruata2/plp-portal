"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/generated/prisma";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { updateUserAction } from "../../actions"; // Adjusted path to actions.ts
import { toast } from "sonner";

export type UserEditData = {
	id: number;
	username: string;
	role: UserRole;
	is_active: boolean;
	// Dates are not directly edited here but could be displayed if needed
};

interface UserEditFormProps {
	user: UserEditData;
}

export default function UserEditForm({ user }: UserEditFormProps) {
	const [formData, setFormData] = useState({
		username: user.username,
		password: "", // New password, optional
		role: user.role,
		is_active: user.is_active,
		district_id: "",
		facility_type_filter_id: "",
		facility_id: (user as any).facility_id ?? "",
	});
	const [districts, setDistricts] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [facilityTypes, setFacilityTypes] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [facilities, setFacilities] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Re-initialize form if user prop changes (e.g., after a save and re-fetch)
		setFormData((prev) => ({
			...prev,
			username: user.username,
			password: "",
			role: user.role,
			is_active: user.is_active,
			facility_id: (user as any).facility_id ?? "",
		}));
	}, [user]);

	// Load reference lists
	useEffect(() => {
		(async () => {
			try {
				const [dRes, ftRes] = await Promise.all([
					fetch("/api/districts"),
					fetch("/api/facility-types"),
				]);
				if (dRes.ok) {
					const dJson = await dRes.json();
					setDistricts(
						(dJson.districts || dJson).map((d: any) => ({
							id: d.id,
							name: d.name,
						}))
					);
				}
				if (ftRes.ok) {
					const ftJson = await ftRes.json();
					setFacilityTypes(
						(ftJson.facilityTypes || ftJson).map((t: any) => ({
							id: t.id,
							name: t.display_name || t.name,
						}))
					);
				}
			} catch (e) {}
		})();
	}, []);

	// When district or facility type filter changes (and role is facility), fetch facilities
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
					setFacilities(
						(json.data || json.facilities || []).map((f: any) => ({
							id: f.id,
							name: f.name,
						}))
					);
				}
			} catch (e) {}
		})();
	}, [formData.role, formData.district_id, formData.facility_type_filter_id]);

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

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setSaving(true);

		if (!formData.username) {
			setError("Username is required.");
			setSaving(false);
			return;
		}

		// If role is facility, allow updating facility_id
		const result = await updateUserAction(user.id, {
			username: formData.username,
			password: formData.password || undefined,
			role: formData.role as any,
			is_active: formData.is_active,
			facility_id:
				formData.role === "facility" ? formData.facility_id || null : null,
		} as any);
		setSaving(false);

		if (result.success && result.user) {
			toast.success("User updated successfully.");
			// router.push(`/admin/users/${result.user.id}`); // Redirect to user detail page
			// OR, stay on the edit page but show success. For now, let's redirect to details.
			router.push(`/admin/users/${result.user.id}`);
			// Optionally, if staying on the page, you might want to refresh data or clear password field:
			// setFormData(prev => ({ ...prev, password: '' }));
		} else {
			setError(result.error || "Failed to update user. Please try again.");
			toast.error(result.error || "Failed to update user. Please try again.");
		}
	};

	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<Link
						href={`/admin/users/${user.id}`}
						className="mr-4 text-gray-500 hover:text-gray-700"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1 className="text-2xl font-semibold text-gray-900">
						Edit User: {user.username}
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
						<div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
							<div className="sm:col-span-4">
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
										className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
									/>
								</div>
							</div>

							<div className="sm:col-span-4">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password (leave blank to keep current)
								</label>
								<div className="mt-1">
									<input
										type="password"
										name="password"
										id="password"
										value={formData.password}
										onChange={handleInputChange}
										className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
									/>
								</div>
							</div>

							<div className="sm:col-span-3">
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
										className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
									>
										<option value={UserRole.facility}>Facility</option>
										<option value={UserRole.admin}>Admin</option>
									</select>
								</div>
							</div>

							{formData.role === "facility" && (
								<>
									<div className="sm:col-span-3">
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
												className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
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

									<div className="sm:col-span-3">
										<label
											htmlFor="facility_type_filter_id"
											className="block text-sm font-medium text-gray-700"
										>
											Facility Type (optional)
										</label>
										<div className="mt-1">
											<select
												id="facility_type_filter_id"
												name="facility_type_filter_id"
												value={formData.facility_type_filter_id}
												onChange={handleInputChange}
												className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
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

									<div className="sm:col-span-4">
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
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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

							<div className="sm:col-span-6">
								<div className="flex items-center">
									<input
										id="is_active"
										name="is_active"
										type="checkbox"
										checked={formData.is_active}
										onChange={handleInputChange}
										className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
					</div>
					<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
						<Link
							href={`/admin/users/${user.id}`}
							className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={saving}
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{saving ? (
								<>
									<Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
									Saving...
								</>
							) : (
								<>
									<Save className="-ml-1 mr-3 h-5 w-5" />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
