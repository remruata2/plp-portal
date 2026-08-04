"use client";

import React, { useState, useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, CheckSquare, Square } from "lucide-react";
import { FieldItem } from "./FormGroupFieldList";
import { Badge } from "@/components/ui/badge";

interface BatchAddFieldModalProps {
	isOpen: boolean;
	onClose: () => void;
	groupName: string;
	unassignedFields: FieldItem[];
	onAddFields: (mappingIds: number[]) => void;
}

export default function BatchAddFieldModal({
	isOpen,
	onClose,
	groupName,
	unassignedFields,
	onAddFields,
}: BatchAddFieldModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	// Filter fields based on search query
	const filteredFields = useMemo(() => {
		if (!searchQuery.trim()) return unassignedFields;
		const query = searchQuery.toLowerCase();
		return unassignedFields.filter(
			(f) =>
				f.name.toLowerCase().includes(query) ||
				f.code.toLowerCase().includes(query)
		);
	}, [unassignedFields, searchQuery]);

	const isAllFilteredSelected = useMemo(() => {
		if (filteredFields.length === 0) return false;
		return filteredFields.every((f) => selectedIds.has(f.mappingId));
	}, [filteredFields, selectedIds]);

	const toggleSelectAll = () => {
		if (isAllFilteredSelected) {
			const next = new Set(selectedIds);
			filteredFields.forEach((f) => next.delete(f.mappingId));
			setSelectedIds(next);
		} else {
			const next = new Set(selectedIds);
			filteredFields.forEach((f) => next.add(f.mappingId));
			setSelectedIds(next);
		}
	};

	const toggleField = (mappingId: number) => {
		const next = new Set(selectedIds);
		if (next.has(mappingId)) {
			next.delete(mappingId);
		} else {
			next.add(mappingId);
		}
		setSelectedIds(next);
	};

	const handleSubmit = () => {
		if (selectedIds.size === 0) return;
		onAddFields(Array.from(selectedIds));
		setSelectedIds(new Set());
		setSearchQuery("");
		onClose();
	};

	const handleClose = () => {
		setSelectedIds(new Set());
		setSearchQuery("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
				<DialogHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
					<DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
						<Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
						<span>Add Fields to "{groupName}"</span>
					</DialogTitle>
					<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
						Select multiple unassigned fields below to add them directly into this section.
					</p>
				</DialogHeader>

				<div className="py-3 space-y-3 flex-1 overflow-hidden flex flex-col">
					{/* Search & Select All Toolbar */}
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="relative flex-1 min-w-[200px]">
							<Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
							<Input
								placeholder="Search unassigned fields by name or code..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
							/>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={toggleSelectAll}
							className="h-9 text-xs font-semibold flex items-center gap-1.5"
						>
							{isAllFilteredSelected ? (
								<>
									<CheckSquare className="w-4 h-4 text-indigo-600" />
									<span>Deselect All</span>
								</>
							) : (
								<>
									<Square className="w-4 h-4 text-slate-400" />
									<span>Select All Filtered</span>
								</>
							)}
						</Button>
					</div>

					{/* Checkbox List */}
					<div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[380px]">
						{filteredFields.length === 0 ? (
							<div className="p-8 text-center text-xs text-slate-400">
								No unassigned fields matching "{searchQuery}"
							</div>
						) : (
							filteredFields.map((field) => {
								const isSelected = selectedIds.has(field.mappingId);
								return (
									<label
										key={field.mappingId}
										className={`flex items-start gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${
											isSelected
												? "bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 font-medium"
												: "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
										}`}
									>
										<input
											type="checkbox"
											checked={isSelected}
											onChange={() => toggleField(field.mappingId)}
											className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-xs font-semibold">{field.name}</span>
												<Badge
													variant="outline"
													className="text-[10px] uppercase font-mono border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
												>
													{field.fieldType}
												</Badge>
											</div>
											<div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 break-all">
												[{field.code}]
											</div>
										</div>
									</label>
								);
							})
						)}
					</div>
				</div>

				<DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
					<div className="text-xs font-medium text-slate-500">
						{selectedIds.size} of {unassignedFields.length} fields selected
					</div>
					<div className="flex items-center gap-2">
						<Button type="button" variant="ghost" size="sm" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={selectedIds.size === 0}
							onClick={handleSubmit}
							className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4"
						>
							Add {selectedIds.size > 0 ? `(${selectedIds.size})` : ""} Fields to Section
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
