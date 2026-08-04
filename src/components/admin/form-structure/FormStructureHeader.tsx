"use client";

import React from "react";
import { Plus, Save, RefreshCw, Filter, Layers, ChevronsDown, ChevronsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FacilityType {
  id: string;
  name: string;
  display_name: string;
}

interface FormStructureHeaderProps {
  facilityTypes: FacilityType[];
  selectedFacilityTypeId: string;
  onFacilityTypeChange: (typeId: string) => void;
  onAddGroupClick: () => void;
  onSaveClick: () => void;
  onResetClick: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export default function FormStructureHeader({
  facilityTypes,
  selectedFacilityTypeId,
  onFacilityTypeChange,
  onAddGroupClick,
  onSaveClick,
  onResetClick,
  onExpandAll,
  onCollapseAll,
  isSaving,
  isDirty,
}: FormStructureHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Dynamic Form Ordering & Grouping
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize indicator groups, form section sequences, and field arrangements for facility data submission.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Type Filter */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <Select
              value={selectedFacilityTypeId}
              onValueChange={onFacilityTypeChange}
            >
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Select Facility Type" />
              </SelectTrigger>
              <SelectContent>
                {facilityTypes.map((ft) => (
                  <SelectItem key={ft.id} value={ft.id}>
                    {ft.display_name} ({ft.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Accordion Expand/Collapse All */}
          {(onExpandAll || onCollapseAll) && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {onExpandAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpandAll}
                  className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 px-2.5"
                  title="Expand all form sections"
                >
                  <ChevronsDown className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Expand All
                </Button>
              )}
              {onCollapseAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCollapseAll}
                  className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 px-2.5"
                  title="Collapse all form sections"
                >
                  <ChevronsUp className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Collapse All
                </Button>
              )}
            </div>
          )}

          {/* Add Group Button */}
          <Button
            variant="outline"
            onClick={onAddGroupClick}
            className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Group</span>
          </Button>

          {/* Reset Button */}
          <Button
            variant="ghost"
            onClick={onResetClick}
            disabled={!isDirty || isSaving}
            className="text-slate-600 dark:text-slate-400"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>Reset</span>
          </Button>

          {/* Save Button */}
          <Button
            onClick={onSaveClick}
            disabled={isSaving || !isDirty}
            className={`flex items-center gap-2 text-white font-medium ${
              isDirty
                ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm"
                : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Order"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
