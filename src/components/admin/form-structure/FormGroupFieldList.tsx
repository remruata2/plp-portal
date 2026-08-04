"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, AlertCircle, GitFork, FolderInput, Plus, X, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BinaryFieldOption {
  id: number;
  code: string;
  name: string;
}

export interface FieldItem {
  mappingId: number;
  fieldId: number;
  code: string;
  name: string;
  fieldType: string;
  isRequired: boolean;
  displayOrder: number;
  groupId: number | null;
  parentFieldId?: number | null;
  parentFieldCode?: string | null;
  parentFieldName?: string | null;
  showOnValue?: string | null;
  parentFieldId2?: number | null;
  parentFieldCode2?: string | null;
  parentFieldName2?: string | null;
  showOnValue2?: string | null;
}

interface GroupOption {
  id: number;
  name: string;
  code: string;
}

interface FormGroupFieldListProps {
  fields: FieldItem[];
  allGroups: GroupOption[];
  binaryFields: BinaryFieldOption[];
  currentGroupId: number;
  onMoveField: (fieldMappingId: number, direction: "up" | "down") => void;
  onReorderFields?: (
    sourceFieldMappingId: number,
    targetFieldMappingId: number | null,
    sourceGroupId: number,
    targetGroupId: number
  ) => void;
  onChangeFieldGroup: (fieldMappingId: number, targetGroupId: number) => void;
  onToggleRequired: (fieldMappingId: number) => void;
  onUpdateFieldConditional?: (
    fieldMappingId: number,
    parentFieldId: number | null,
    showOnValue: string | null,
    parentFieldId2?: number | null,
    showOnValue2?: string | null
  ) => void;
  onRemoveFieldMapping?: (fieldMappingId: number, fieldName: string) => void;
}

export default function FormGroupFieldList({
  fields,
  allGroups,
  binaryFields,
  currentGroupId,
  onMoveField,
  onReorderFields,
  onChangeFieldGroup,
  onToggleRequired,
  onUpdateFieldConditional,
  onRemoveFieldMapping,
}: FormGroupFieldListProps) {
  const [draggedMappingId, setDraggedMappingId] = useState<number | null>(null);
  const [dragOverMappingId, setDragOverMappingId] = useState<number | null>(null);

  if (fields.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
        No fields in this section yet. Use the "Move to Section" dropdown on any field in another group or Unassigned list below to add fields here.
      </div>
    );
  }

  // Target groups (exclude virtual group 0 from select target options)
  const targetGroups = allGroups.filter((g) => g.id !== 0);

  return (
    <div className="overflow-x-auto">
      {currentGroupId === 0 && (
        <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <FolderInput className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            These fields are not assigned to any group. Use the <strong>"Move to Section"</strong> dropdown on each field below to assign it to an indicator group, then click <strong>Save Order</strong>.
          </span>
        </div>
      )}

      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-2.5 px-3 w-14 text-center">Seq</th>
            <th className="py-2.5 px-3 min-w-[180px]">Field Title</th>
            <th className="py-2.5 px-3 font-mono">Code</th>
            <th className="py-2.5 px-3">Type</th>
            <th className="py-2.5 px-3 text-center">Required</th>
            <th className="py-2.5 px-3 font-bold text-indigo-700 dark:text-indigo-300 min-w-[200px]">
              Assign / Move to Section
            </th>
            <th className="py-2.5 px-3 min-w-[260px]">Conditional Gates (1 or 2 Binary Fields)</th>
            <th className="py-2.5 px-3 text-right w-20">Reorder</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {fields.map((field, index) => {
            const isDragging = draggedMappingId === field.mappingId;
            const isDragOver = dragOverMappingId === field.mappingId;

            return (
              <tr
                key={field.mappingId}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverMappingId(field.mappingId);
                }}
                onDragLeave={(e) => {
                  e.stopPropagation();
                  setDragOverMappingId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverMappingId(null);
                  setDraggedMappingId(null);
                  try {
                    const dataStr = e.dataTransfer.getData("application/json");
                    if (!dataStr) return;
                    const data = JSON.parse(dataStr);

                    if (data.type === "field" && onReorderFields) {
                      onReorderFields(
                        data.mappingId,
                        field.mappingId,
                        data.sourceGroupId,
                        currentGroupId
                      );
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className={`transition-colors ${
                  isDragging
                    ? "opacity-30 bg-indigo-50/50 dark:bg-indigo-950/20"
                    : isDragOver
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-t-2 border-indigo-500"
                    : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                }`}
              >
                {/* Index Badge & Drag Handle */}
                <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-400">
                  <div className="flex items-center justify-center gap-1">
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        e.dataTransfer.setData(
                          "application/json",
                          JSON.stringify({
                            type: "field",
                            mappingId: field.mappingId,
                            sourceGroupId: currentGroupId,
                          })
                        );
                        e.dataTransfer.effectAllowed = "move";
                        setDraggedMappingId(field.mappingId);
                      }}
                      onDragEnd={() => {
                        setDraggedMappingId(null);
                        setDragOverMappingId(null);
                      }}
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
                      title="Drag to reorder field"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                    <span>{index + 1}</span>
                  </div>
                </td>

              {/* Title */}
              <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                {field.name}
              </td>

              {/* Code */}
              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {field.code}
              </td>

              {/* Field Type Badge */}
              <td className="py-2.5 px-3">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-wider font-semibold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {field.fieldType}
                </Badge>
              </td>

              {/* Required Toggle */}
              <td className="py-2.5 px-3 text-center">
                <button
                  onClick={() => onToggleRequired(field.mappingId)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                    field.isRequired
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {field.isRequired ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Required
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                      Optional
                    </>
                  )}
                </button>
              </td>

              {/* Prominent Move to Group Dropdown */}
              <td className="py-2.5 px-3">
                <div className="min-w-[190px]">
                  <Select
                    value={currentGroupId === 0 ? "unassigned" : String(currentGroupId)}
                    onValueChange={(newGroupId) => {
                      if (newGroupId !== "unassigned") {
                        onChangeFieldGroup(field.mappingId, parseInt(newGroupId, 10));
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold px-2.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <FolderInput className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <SelectValue placeholder="Select Target Section..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" disabled className="text-xs text-slate-400 font-italic">
                        -- Select Target Section --
                      </SelectItem>
                      {targetGroups.map((g) => (
                        <SelectItem
                          key={g.id}
                          value={String(g.id)}
                          className="text-xs font-medium"
                        >
                          {g.name} ({g.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </td>

              {/* Dual Conditional Gates (Gate 1 & Gate 2 AND) */}
              <td className="py-2.5 px-3">
                <div className="space-y-1.5">
                  {/* Gate 1 */}
                  <div className="flex items-center gap-1.5">
                    <Select
                      value={field.parentFieldId ? String(field.parentFieldId) : "none"}
                      onValueChange={(val) => {
                        const newParentId = val === "none" ? null : parseInt(val, 10);
                        const defaultVal = newParentId ? (field.showOnValue ?? "1") : null;
                        if (onUpdateFieldConditional) {
                          onUpdateFieldConditional(
                            field.mappingId,
                            newParentId,
                            defaultVal,
                            newParentId ? field.parentFieldId2 : null,
                            newParentId ? (field.showOnValue2 ?? "1") : null
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-2.5 py-1 w-[260px] sm:w-[320px] shrink-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <GitFork className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <SelectValue placeholder="Gate 1: Always Visible" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                        <SelectItem value="none" className="text-xs text-slate-500 py-2">
                          Gate 1: Always Visible (No Gate)
                        </SelectItem>
                        {binaryFields
                          .filter((bf) => bf.id !== field.fieldId && bf.id !== field.parentFieldId2)
                          .map((bf) => (
                            <SelectItem
                              key={bf.id}
                              value={String(bf.id)}
                              className="text-xs py-2.5 whitespace-normal leading-snug cursor-pointer"
                            >
                              Gate 1: {bf.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {field.parentFieldId && (
                      <Select
                        value={field.showOnValue ?? "1"}
                        onValueChange={(val) => {
                          if (onUpdateFieldConditional) {
                            onUpdateFieldConditional(
                              field.mappingId,
                              field.parentFieldId ?? null,
                              val,
                              field.parentFieldId2 ?? null,
                              field.showOnValue2 ?? "1"
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0 min-w-[85px]">
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
                  {field.parentFieldId && (
                    <div className="flex items-center gap-1.5 pl-2 border-l-2 border-purple-300 dark:border-purple-700">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider shrink-0">
                        AND
                      </span>
                      <Select
                        value={field.parentFieldId2 ? String(field.parentFieldId2) : "none"}
                        onValueChange={(val) => {
                          const newParentId2 = val === "none" ? null : parseInt(val, 10);
                          const defaultVal2 = newParentId2 ? (field.showOnValue2 ?? "1") : null;
                          if (onUpdateFieldConditional) {
                            onUpdateFieldConditional(
                              field.mappingId,
                              field.parentFieldId ?? null,
                              field.showOnValue ?? "1",
                              newParentId2,
                              defaultVal2
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 px-2 py-0.5 w-[240px] sm:w-[290px] shrink-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <Plus className="w-3 h-3 text-purple-500 shrink-0" />
                            <SelectValue placeholder="Add 2nd Gate (AND)..." />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                          <SelectItem value="none" className="text-xs text-slate-400 font-italic py-2">
                            -- No 2nd Gate --
                          </SelectItem>
                          {binaryFields
                            .filter((bf) => bf.id !== field.fieldId && bf.id !== field.parentFieldId)
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

                      {field.parentFieldId2 && (
                        <Select
                          value={field.showOnValue2 ?? "1"}
                          onValueChange={(val) => {
                            if (onUpdateFieldConditional) {
                              onUpdateFieldConditional(
                                field.mappingId,
                                field.parentFieldId ?? null,
                                field.showOnValue ?? "1",
                                field.parentFieldId2 ?? null,
                                val
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="h-6 text-[10px] bg-purple-100 dark:bg-purple-900/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 font-semibold px-1.5 py-0 min-w-[75px]">
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
              </td>

              {/* Move Up / Down & Remove Buttons */}
              <td className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => onMoveField(field.mappingId, "up")}
                    className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Move Field Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === fields.length - 1}
                    onClick={() => onMoveField(field.mappingId, "down")}
                    className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Move Field Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                  {onRemoveFieldMapping && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFieldMapping(field.mappingId, field.name)}
                      className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Remove field mapping from this facility type"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
