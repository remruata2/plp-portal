"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import IndicatorWorkerAllocationForm, {
	WORKER_TYPE_LABELS,
} from "./IndicatorWorkerAllocationForm";

type Indicator = { id: number; code: string; name: string };

type IndicatorWorkerAllocation = {
	id: string;
	indicator_id: number;
	worker_type: string;
	allocated_amount: number;
	created_at: string;
	updated_at: string;
	indicator?: Indicator;
};

export default function IndicatorWorkerAllocationsPage() {
	const [loading, setLoading] = useState(true);
	const [allocations, setAllocations] = useState<IndicatorWorkerAllocation[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingAllocation, setEditingAllocation] =
		useState<IndicatorWorkerAllocation | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		loadAllocations();
	}, []);

	async function loadAllocations() {
		try {
			setLoading(true);
			const res = await fetch("/api/admin/indicator-worker-allocations", {
				cache: "no-store",
			});
			if (!res.ok) {
				const error = await res.json().catch(() => ({}));
				throw new Error(error.error || `Failed (${res.status})`);
			}
			const body = await res.json();
			setAllocations(body.data || []);
		} catch (e: any) {
			console.error(e);
			toast.error(e.message || "Failed to load allocations");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this allocation?")) return;

		try {
			const res = await fetch(`/api/admin/indicator-worker-allocations/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const error = await res.json().catch(() => ({}));
				throw new Error(error.error || `Failed (${res.status})`);
			}

			toast.success("Allocation deleted successfully");
			await loadAllocations();
		} catch (e: any) {
			console.error(e);
			toast.error(e.message || "Failed to delete allocation");
		}
	}

	function handleEdit(allocation: IndicatorWorkerAllocation) {
		setEditingAllocation(allocation);
		setIsEditModalOpen(true);
	}

	function handleCreate() {
		setIsCreateModalOpen(true);
	}

	function handleFormSuccess() {
		setIsCreateModalOpen(false);
		setIsEditModalOpen(false);
		setEditingAllocation(null);
		loadAllocations();
	}

	function handleFormCancel() {
		setIsCreateModalOpen(false);
		setIsEditModalOpen(false);
		setEditingAllocation(null);
	}

	const filteredAllocations = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return allocations;

		return allocations.filter((allocation) => {
			const indicatorCode =
				allocation.indicator?.code?.toLowerCase() || "";
			const indicatorName =
				allocation.indicator?.name?.toLowerCase() || "";
			const workerType = WORKER_TYPE_LABELS[allocation.worker_type]
				?.toLowerCase() || "";
			const allocatedAmount = allocation.allocated_amount.toString();

			return (
				indicatorCode.includes(query) ||
				indicatorName.includes(query) ||
				workerType.includes(query) ||
				allocatedAmount.includes(query)
			);
		});
	}, [allocations, searchQuery]);

	return (
		<div className="min-h-screen bg-gray-50 p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Indicator Worker Allocations</h1>
				<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={handleCreate}
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
						>
							<PlusCircle className="mr-2 h-4 w-4" />
							Create New Allocation
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Create Worker Allocation</DialogTitle>
						</DialogHeader>
						<IndicatorWorkerAllocationForm
							mode="create"
							onSuccess={handleFormSuccess}
							onCancel={handleFormCancel}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search */}
			<div className="bg-white rounded-md border p-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						type="text"
						placeholder="Search by indicator code, name, worker type, or amount..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-md border">
				{loading ? (
					<div className="p-8 text-center text-gray-500">Loading...</div>
				) : filteredAllocations.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						{searchQuery
							? "No allocations found matching your search"
							: "No allocations found. Create one to get started."}
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Indicator</TableHead>
								<TableHead>Worker Type</TableHead>
								<TableHead>Allocated Amount</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Updated</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAllocations.map((allocation) => (
								<TableRow key={allocation.id}>
									<TableCell>
										<div>
											<div className="font-medium">
												{allocation.indicator?.code || "N/A"}
											</div>
											<div className="text-sm text-gray-500">
												{allocation.indicator?.name || "Unknown"}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="secondary">
											{WORKER_TYPE_LABELS[allocation.worker_type] ||
												allocation.worker_type}
										</Badge>
									</TableCell>
									<TableCell>
										₹{allocation.allocated_amount.toLocaleString()}
									</TableCell>
									<TableCell>
										{new Date(allocation.created_at).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(allocation.updated_at).toLocaleDateString()}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEdit(allocation)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDelete(allocation.id)}
											>
												<Trash2 className="h-4 w-4 text-red-600" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Edit Modal */}
			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Worker Allocation</DialogTitle>
					</DialogHeader>
					{editingAllocation && (
						<IndicatorWorkerAllocationForm
							mode="edit"
							id={editingAllocation.id}
							initialValues={{
								indicator_id: editingAllocation.indicator_id.toString(),
								worker_type: editingAllocation.worker_type,
								allocated_amount: editingAllocation.allocated_amount.toString(),
							}}
							onSuccess={handleFormSuccess}
							onCancel={handleFormCancel}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

