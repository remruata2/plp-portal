"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  GitFork,
  Link2Off,
  Pencil,
  Check,
  X,
  Plus,
} from "lucide-react";
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
import FormGroupFieldList, { FieldItem, BinaryFieldOption } from "./FormGroupFieldList";

interface GroupOption {
  id: number;
  name: string;
  code: string;
}

interface FormGroupCardProps {
  group: {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    sortOrder: number;
    parentFieldId?: number | null;
    parentFieldCode?: string | null;
    parentFieldName?: string | null;
    showOnValue?: string | null;
    parentFieldId2?: number | null;
    parentFieldCode2?: string | null;
    parentFieldName2?: string | null;
    showOnValue2?: string | null;
    fields: FieldItem[];
  };
  groupIndex: number;
  totalGroups: number;
  allGroups: GroupOption[];
  binaryFields: BinaryFieldOption[];
  onMoveGroup: (groupIndex: number, direction: "up" | "down") => void;
  onDeleteGroup: (groupId: number, mode: "unlink" | "delete") => void;
  onMoveField: (fieldMappingId: number, direction: "up" | "down") => void;
  onChangeFieldGroup: (fieldMappingId: number, targetGroupId: number) => void;
  onToggleRequired: (fieldMappingId: number) => void;
  onUpdateGroupConditional: (
    groupId: number,
    parentFieldId: number | null,
    showOnValue: string | null,
    parentFieldId2?: number | null,
    showOnValue2?: string | null
  ) => void;
  onUpdateFieldConditional: (
    fieldMappingId: number,
    parentFieldId: number | null,
    showOnValue: string | null,
    parentFieldId2?: number | null,
    showOnValue2?: string | null
  ) => void;
  onUpdateGroupDetails?: (
    groupId: number,
    name: string,
    description?: string
  ) => void;
  onRemoveFieldMapping?: (fieldMappingId: number, fieldName: string) => void;
}

export default function FormGroupCard({
  group,
  groupIndex,
  totalGroups,
  allGroups,
  binaryFields,
  onMoveGroup,
  onDeleteGroup,
  onMoveField,
  onChangeFieldGroup,
  onToggleRequired,
  onUpdateGroupConditional,
  onUpdateFieldConditional,
  onUpdateGroupDetails,
  onRemoveFieldMapping,
}: FormGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [editedDesc, setEditedDesc] = useState(group.description || "");

  const handleSaveTitle = () => {
    if (!editedName.trim()) return;
    if (onUpdateGroupDetails) {
      onUpdateGroupDetails(group.id, editedName.trim(), editedDesc.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditedName(group.name);
    setEditedDesc(group.description || "");
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Group Header Bar */}
      <div className="px-5 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          {/* Order Badge */}
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0">
            {groupIndex + 1}
          </div>

          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="space-y-2 py-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Group Title"
                    className="h-8 text-sm font-bold bg-white dark:bg-slate-900"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveTitle}
                    className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    title="Save Group Name"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelTitle}
                    className="h-8 px-2 text-slate-500 hover:text-slate-900"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Input
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  placeholder="Optional description"
                  className="h-7 text-xs bg-white dark:bg-slate-900 text-slate-600"
                />
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {group.name}
                  </h3>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    title="Rename Group"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono uppercase bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {group.code}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  >
                    {group.fields.length} {group.fields.length === 1 ? "field" : "fields"}
                  </Badge>

                  {/* Conditional Group Badges */}
                  {group.parentFieldId && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800 flex items-center gap-1"
                    >
                      <GitFork className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      Gate 1: {group.showOnValue === "0" ? "NO" : "YES"}
                    </Badge>
                  )}
                  {group.parentFieldId2 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-300 dark:border-purple-700 flex items-center gap-1"
                    >
                      <GitFork className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      AND Gate 2: {group.showOnValue2 === "0" ? "NO" : "YES"}
                    </Badge>
                  )}
                </div>

                {group.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {group.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section Conditional Gating Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {group.id !== 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              {/* Gate 1 */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-slate-500 pl-1 flex items-center gap-1">
                  <GitFork className="w-3 h-3 text-purple-500" /> Gate 1:
                </span>
                <Select
                  value={group.parentFieldId ? String(group.parentFieldId) : "none"}
                  onValueChange={(val) => {
                    const newParentId = val === "none" ? null : parseInt(val, 10);
                    const defaultVal = newParentId ? (group.showOnValue ?? "1") : null;
                    onUpdateGroupConditional(
                      group.id,
                      newParentId,
                      defaultVal,
                      newParentId ? group.parentFieldId2 : null,
                      newParentId ? (group.showOnValue2 ?? "1") : null
                    );
                  }}
                >
                  <SelectTrigger className="h-7 text-xs bg-slate-50 dark:bg-slate-800 border-0 px-2.5 py-0 w-[220px] sm:w-[280px]">
                    <SelectValue placeholder="Always Visible" />
                  </SelectTrigger>
                  <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                    <SelectItem value="none" className="text-xs text-slate-500 py-2">
                      Always Visible (No Gate)
                    </SelectItem>
                    {binaryFields
                      .filter((bf) => bf.id !== group.parentFieldId2)
                      .map((bf) => (
                        <SelectItem
                          key={bf.id}
                          value={String(bf.id)}
                          className="text-xs py-2.5 whitespace-normal leading-snug cursor-pointer"
                        >
                          Depends on: {bf.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {group.parentFieldId && (
                  <Select
                    value={group.showOnValue ?? "1"}
                    onValueChange={(val) => {
                      onUpdateGroupConditional(
                        group.id,
                        group.parentFieldId ?? null,
                        val,
                        group.parentFieldId2 ?? null,
                        group.showOnValue2 ?? "1"
                      );
                    }}
                  >
                    <SelectTrigger className="h-7 text-[11px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold border-0 px-2 py-0 min-w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-xs">
                        Is YES
                      </SelectItem>
                      <SelectItem value="0" className="text-xs">
                        Is NO
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Gate 2 (AND Condition) */}
              {group.parentFieldId && (
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider shrink-0">
                    AND
                  </span>
                  <Select
                    value={group.parentFieldId2 ? String(group.parentFieldId2) : "none"}
                    onValueChange={(val) => {
                      const newParentId2 = val === "none" ? null : parseInt(val, 10);
                      const defaultVal2 = newParentId2 ? (group.showOnValue2 ?? "1") : null;
                      onUpdateGroupConditional(
                        group.id,
                        group.parentFieldId ?? null,
                        group.showOnValue ?? "1",
                        newParentId2,
                        defaultVal2
                      );
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs bg-purple-50/50 dark:bg-purple-950/30 border-0 px-2 py-0 w-[200px] sm:w-[260px]">
                      <div className="flex items-center gap-1 truncate">
                        <Plus className="w-3 h-3 text-purple-500 shrink-0" />
                        <SelectValue placeholder="2nd Gate (AND)..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                      <SelectItem value="none" className="text-xs text-slate-400 font-italic py-2">
                        -- No 2nd Gate --
                      </SelectItem>
                      {binaryFields
                        .filter((bf) => bf.id !== group.parentFieldId)
                        .map((bf) => (
                          <SelectItem
                            key={bf.id}
                            value={String(bf.id)}
                            className="text-xs py-2.5 whitespace-normal leading-snug cursor-pointer"
                          >
                            Gate 2: {bf.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {group.parentFieldId2 && (
                    <Select
                      value={group.showOnValue2 ?? "1"}
                      onValueChange={(val) => {
                        onUpdateGroupConditional(
                          group.id,
                          group.parentFieldId ?? null,
                          group.showOnValue ?? "1",
                          group.parentFieldId2 ?? null,
                          val
                        );
                      }}
                    >
                      <SelectTrigger className="h-6 text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-semibold border-0 px-1.5 py-0 min-w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="text-xs">
                          Is YES
                        </SelectItem>
                        <SelectItem value="0" className="text-xs">
                          Is NO
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Group Order Movement Buttons */}
          {group.id !== 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={groupIndex === 0}
                onClick={() => onMoveGroup(groupIndex, "up")}
                className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400"
                title="Move Group Up (#"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={groupIndex === totalGroups - 1}
                onClick={() => onMoveGroup(groupIndex, "down")}
                className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400"
                title="Move Group Down"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Unlink / Delete Section Options */}
          {group.id !== 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteGroup(group.id, "unlink")}
                className="h-8 px-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                title="Unlink section for this facility type (fields move to Unassigned)"
              >
                <Link2Off className="w-3.5 h-3.5 mr-1" />
                Unlink
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteGroup(group.id, "delete")}
                className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                title="Permanently Delete Group Globally"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Expand/Collapse Chevron */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Group Content Body */}
      {isExpanded && (
        <div className="p-4">
          <FormGroupFieldList
            fields={group.fields}
            allGroups={allGroups}
            binaryFields={binaryFields}
            currentGroupId={group.id}
            onMoveField={onMoveField}
            onChangeFieldGroup={onChangeFieldGroup}
            onToggleRequired={onToggleRequired}
            onUpdateFieldConditional={onUpdateFieldConditional}
            onRemoveFieldMapping={onRemoveFieldMapping}
          />
        </div>
      )}
    </div>
  );
}
