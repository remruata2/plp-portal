"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import FormStructureHeader from "@/components/admin/form-structure/FormStructureHeader";
import FormGroupCard from "@/components/admin/form-structure/FormGroupCard";
import AddGroupModal from "@/components/admin/form-structure/AddGroupModal";
import { FieldItem, BinaryFieldOption } from "@/components/admin/form-structure/FormGroupFieldList";
import { AlertCircle, Layers } from "lucide-react";

interface FacilityType {
  id: string;
  name: string;
  display_name: string;
}

interface GroupData {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  facilityTypeId?: string | null;
  parentFieldId?: number | null;
  parentFieldCode?: string | null;
  parentFieldName?: string | null;
  showOnValue?: string | null;
  fields: FieldItem[];
}

export default function DynamicFormStructurePage() {
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [selectedFacilityTypeId, setSelectedFacilityTypeId] = useState<string>("");
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [binaryFields, setBinaryFields] = useState<BinaryFieldOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch form structure for selected facility type
  const fetchFormStructure = async (facilityTypeId?: string, showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const url = facilityTypeId
        ? `/api/admin/form-structure?facilityTypeId=${facilityTypeId}`
        : `/api/admin/form-structure`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load form structure");

      const data = await res.json();
      setFacilityTypes(data.facilityTypes || []);
      setSelectedFacilityTypeId(data.activeFacilityTypeId || "");
      setGroups(data.groups || []);
      setBinaryFields(data.binaryFields || []);
      setIsDirty(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load form structure: " + err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFormStructure();
  }, []);

  const handleFacilityTypeChange = (newTypeId: string) => {
    if (isDirty) {
      if (
        !window.confirm(
          "You have unsaved changes to the current form structure. Switch facility type without saving?"
        )
      ) {
        return;
      }
    }
    setSelectedFacilityTypeId(newTypeId);
    fetchFormStructure(newTypeId, true);
  };

  // Move group up/down
  const handleMoveGroup = (groupIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? groupIndex - 1 : groupIndex + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;

    const updated = [...groups];
    const temp = updated[groupIndex];
    updated[groupIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sortOrders
    updated.forEach((g, idx) => {
      g.sortOrder = idx + 1;
    });

    setGroups(updated);
    setIsDirty(true);
  };

  // Reorder groups via drag & drop
  const handleReorderGroups = (sourceIndex: number, targetIndex: number) => {
    if (
      sourceIndex === targetIndex ||
      sourceIndex < 0 ||
      targetIndex < 0 ||
      sourceIndex >= groups.length ||
      targetIndex >= groups.length
    ) {
      return;
    }
    const updated = [...groups];
    const [movedGroup] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, movedGroup);

    updated.forEach((g, idx) => {
      g.sortOrder = idx + 1;
    });

    setGroups(updated);
    setIsDirty(true);
  };

  // Update Section / Group Conditional Binary Parent
  const handleUpdateGroupConditional = (
    groupId: number,
    parentFieldId: number | null,
    showOnValue: string | null,
    parentFieldId2?: number | null,
    showOnValue2?: string | null
  ) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          parentFieldId,
          showOnValue,
          parentFieldId2: parentFieldId2 ?? null,
          showOnValue2: showOnValue2 ?? null,
        };
      }
      return g;
    });

    setGroups(updated);
    setIsDirty(true);
  };

  // Move field between groups or up/down in same group
  const handleMoveField = (
    fieldMappingId: number,
    direction: "up" | "down"
  ) => {
    const updated = groups.map((g) => {
      const fieldIndex = g.fields.findIndex((f) => f.mappingId === fieldMappingId);
      if (fieldIndex === -1) return g;

      const targetIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
      if (targetIndex < 0 || targetIndex >= g.fields.length) return g;

      const newFields = [...g.fields];
      const temp = newFields[fieldIndex];
      newFields[fieldIndex] = newFields[targetIndex];
      newFields[targetIndex] = temp;

      // Recalculate display orders
      newFields.forEach((f, idx) => {
        f.displayOrder = idx + 1;
      });

      return { ...g, fields: newFields };
    });

    setGroups(updated);
    setIsDirty(true);
  };

  // Reorder field via drag & drop (within same group or across groups)
  const handleReorderFields = (
    sourceMappingId: number,
    targetMappingId: number | null,
    sourceGroupId: number,
    targetGroupId: number
  ) => {
    setGroups((prevGroups) => {
      let movedField: FieldItem | null = null;

      // Extract field from source group
      const nextGroups = prevGroups.map((g) => {
        if (g.id === sourceGroupId) {
          const field = g.fields.find((f) => f.mappingId === sourceMappingId);
          if (field) {
            movedField = { ...field, groupId: targetGroupId };
            return {
              ...g,
              fields: g.fields.filter((f) => f.mappingId !== sourceMappingId),
            };
          }
        }
        return g;
      });

      if (!movedField) return prevGroups;

      // Insert field into target group at target position
      return nextGroups.map((g) => {
        if (g.id === targetGroupId) {
          const currentFields = [...g.fields];
          let targetIndex = currentFields.length;

          if (targetMappingId !== null) {
            const idx = currentFields.findIndex((f) => f.mappingId === targetMappingId);
            if (idx !== -1) {
              targetIndex = idx;
            }
          }

          currentFields.splice(targetIndex, 0, movedField!);

          // Recalculate display orders
          currentFields.forEach((f, idx) => {
            f.displayOrder = idx + 1;
          });

          return { ...g, fields: currentFields };
        }
        return g;
      });
    });

    setIsDirty(true);
  };

  // Change field group assignment
  const handleChangeFieldGroup = (
    fieldMappingId: number,
    targetGroupId: number
  ) => {
    let targetField: FieldItem | null = null;

    // Remove field from source group
    const updatedGroups = groups.map((g) => {
      const field = g.fields.find((f) => f.mappingId === fieldMappingId);
      if (field) {
        targetField = { ...field, groupId: targetGroupId };
        return {
          ...g,
          fields: g.fields.filter((f) => f.mappingId !== fieldMappingId),
        };
      }
      return g;
    });

    if (!targetField) return;

    // Add field to target group
    const finalGroups = updatedGroups.map((g) => {
      if (g.id === targetGroupId) {
        const newFields = [...g.fields, targetField!];
        newFields.forEach((f, idx) => {
          f.displayOrder = idx + 1;
        });
        return { ...g, fields: newFields };
      }
      return g;
    });

    setGroups(finalGroups);
    setIsDirty(true);
  };

  // Toggle field required status
  const handleToggleRequired = (fieldMappingId: number) => {
    const updated = groups.map((g) => ({
      ...g,
      fields: g.fields.map((f) =>
        f.mappingId === fieldMappingId ? { ...f, isRequired: !f.isRequired } : f
      ),
    }));

    setGroups(updated);
    setIsDirty(true);
  };

  // Update Field Conditional Binary Parent
  const handleUpdateFieldConditional = (
    fieldMappingId: number,
    parentFieldId: number | null,
    showOnValue: string | null,
    parentFieldId2?: number | null,
    showOnValue2?: string | null
  ) => {
    const updated = groups.map((g) => ({
      ...g,
      fields: g.fields.map((f) =>
        f.mappingId === fieldMappingId
          ? {
              ...f,
              parentFieldId,
              showOnValue,
              parentFieldId2: parentFieldId2 ?? null,
              showOnValue2: showOnValue2 ?? null,
            }
          : f
      ),
    }));

    setGroups(updated);
    setIsDirty(true);
  };

  // Add new custom indicator group
  const handleAddGroup = async (newGroupData: {
    name: string;
    code: string;
    description?: string;
    parentFieldId?: number | null;
    showOnValue?: string | null;
    parentFieldId2?: number | null;
    showOnValue2?: string | null;
  }) => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/form-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGroupData,
          sortOrder: groups.length + 1,
          facilityTypeId: selectedFacilityTypeId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create group");
      }

      toast.success(`Group "${newGroupData.name}" created successfully!`);
      fetchFormStructure(selectedFacilityTypeId, false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add group");
    } finally {
      setSaving(false);
    }
  };

  // Delete or Unlink indicator group (zero-flicker optimistic update)
  const handleDeleteGroup = async (
    groupId: number,
    mode: "unlink" | "delete" = "unlink"
  ) => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;

    if (mode === "unlink") {
      if (
        !confirm(
          `Are you sure you want to remove section "${targetGroup.name}" from this facility type? The fields inside will move to Unassigned.`
        )
      ) {
        return;
      }
    } else {
      if (
        !confirm(
          `Are you sure you want to PERMANENTLY DELETE "${targetGroup.name}" across ALL facility types?`
        )
      ) {
        return;
      }
    }

    // Optimistic UI update - move fields/remove section instantly
    setGroups((prevGroups) => {
      if (mode === "unlink") {
        const unlinkedFields = targetGroup.fields.map((f) => ({
          ...f,
          groupId: null,
        }));
        const remainingGroups = prevGroups.filter((g) => g.id !== groupId);
        const unassignedIndex = remainingGroups.findIndex((g) => g.id === 0);

        if (unassignedIndex !== -1) {
          remainingGroups[unassignedIndex] = {
            ...remainingGroups[unassignedIndex],
            fields: [...remainingGroups[unassignedIndex].fields, ...unlinkedFields],
          };
          return [...remainingGroups];
        } else if (unlinkedFields.length > 0) {
          return [
            ...remainingGroups,
            {
              id: 0,
              code: "UNASSIGNED",
              name: "Unassigned / Other Fields",
              description:
                "Fields mapped to this facility type that have not yet been assigned to an indicator group.",
              sortOrder: 9999,
              facilityTypeId: selectedFacilityTypeId,
              parentFieldId: null,
              parentFieldCode: null,
              parentFieldName: null,
              showOnValue: null,
              parentFieldId2: null,
              parentFieldCode2: null,
              parentFieldName2: null,
              showOnValue2: null,
              fields: unlinkedFields,
            },
          ];
        }
        return remainingGroups;
      } else {
        return prevGroups.filter((g) => g.id !== groupId);
      }
    });

    try {
      const url =
        mode === "unlink"
          ? `/api/admin/form-structure?groupId=${groupId}&mode=unlink&facilityTypeId=${selectedFacilityTypeId}`
          : `/api/admin/form-structure?groupId=${groupId}&mode=delete`;

      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to process request");

      if (mode === "unlink") {
        toast.success("Section removed from this facility form.");
      } else {
        toast.success("Group deleted permanently across all facility types.");
      }
      fetchFormStructure(selectedFacilityTypeId, false);
    } catch (err: any) {
      toast.error(err.message || "Failed to process request");
      fetchFormStructure(selectedFacilityTypeId, false);
    }
  };

  // Remove individual field mapping from selected facility type (zero-flicker optimistic update)
  const handleRemoveFieldMapping = async (
    fieldMappingId: number,
    fieldName: string
  ) => {
    const activeType = facilityTypes.find((ft) => ft.id === selectedFacilityTypeId);
    const typeName = activeType ? activeType.display_name : "this facility type";

    if (
      !confirm(
        `Are you sure you want to remove "${fieldName}" from ${typeName}? The field will no longer appear in forms for this facility type.`
      )
    ) {
      return;
    }

    // Optimistic UI update - remove field mapping instantly with zero page flicker
    setGroups((prevGroups) =>
      prevGroups
        .map((g) => ({
          ...g,
          fields: g.fields.filter((f) => f.mappingId !== fieldMappingId),
        }))
        .filter((g) => g.id === 0 || g.fields.length > 0)
    );

    try {
      const res = await fetch(
        `/api/admin/form-structure?mappingId=${fieldMappingId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove field mapping");
      }

      toast.success(`"${fieldName}" removed from ${typeName}!`);
      fetchFormStructure(selectedFacilityTypeId, false);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove field mapping");
      fetchFormStructure(selectedFacilityTypeId, false);
    }
  };

  // Save full form structure changes (groups sortOrder + parentFieldId + field displayOrder and group_id)
  const handleSave = async () => {
    try {
      setSaving(true);

      const groupOrders = groups.map((g, idx) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        sortOrder: idx + 1,
        parentFieldId: g.parentFieldId,
        showOnValue: g.showOnValue,
      }));

      const fieldOrders: any[] = [];
      groups.forEach((g) => {
        g.fields.forEach((f, idx) => {
          fieldOrders.push({
            mappingId: f.mappingId,
            groupId: g.id,
            displayOrder: idx + 1,
            isRequired: f.isRequired,
            parentFieldId: f.parentFieldId,
            showOnValue: f.showOnValue,
          });
        });
      });

      const res = await fetch("/api/admin/form-structure", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupOrders, fieldOrders }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save form structure");
      }

      toast.success("Form structure, section ordering, and conditional gating saved successfully!");
      setIsDirty(false);
      fetchFormStructure(selectedFacilityTypeId);
    } catch (err: any) {
      toast.error(err.message || "Failed to save form structure");
    } finally {
      setSaving(false);
    }
  };

  // Update Group Title and Description
  const handleUpdateGroupDetails = (
    groupId: number,
    name: string,
    description?: string
  ) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          name,
          description: description || null,
        };
      }
      return g;
    });

    setGroups(updated);
    setIsDirty(true);
  };

  const groupOptions = groups.map((g) => ({
    id: g.id,
    name: g.name,
    code: g.code,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <FormStructureHeader
        facilityTypes={facilityTypes}
        selectedFacilityTypeId={selectedFacilityTypeId}
        onFacilityTypeChange={handleFacilityTypeChange}
        onAddGroupClick={() => setIsAddModalOpen(true)}
        onSaveClick={handleSave}
        onResetClick={() => fetchFormStructure(selectedFacilityTypeId)}
        isSaving={saving}
        isDirty={isDirty}
      />

      {/* Unsaves Warning */}
      {isDirty && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            You have unsaved changes in group sequence, group titles, or field order. Click <strong>Save Order</strong> to persist changes.
          </span>
        </div>
      )}

      {/* Main Form Group List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
          <p className="text-sm font-medium">Loading dynamic form structure...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Indicator Groups Configured
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Create your first indicator group to organize fields for data submission.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
          >
            Add Indicator Group
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => (
            <FormGroupCard
              key={group.id}
              group={group}
              groupIndex={index}
              totalGroups={groups.length}
              allGroups={groupOptions}
              binaryFields={binaryFields}
              onMoveGroup={handleMoveGroup}
              onReorderGroups={handleReorderGroups}
              onDeleteGroup={handleDeleteGroup}
              onMoveField={handleMoveField}
              onReorderFields={handleReorderFields}
              onChangeFieldGroup={handleChangeFieldGroup}
              onToggleRequired={handleToggleRequired}
              onUpdateGroupConditional={handleUpdateGroupConditional}
              onUpdateFieldConditional={handleUpdateFieldConditional}
              onUpdateGroupDetails={handleUpdateGroupDetails}
              onRemoveFieldMapping={handleRemoveFieldMapping}
            />
          ))}
        </div>
      )}

      {/* Add Group Modal */}
      <AddGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        binaryFields={binaryFields}
        onAddGroup={handleAddGroup}
      />
    </div>
  );
}
