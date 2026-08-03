"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BinaryFieldOption } from "./FormGroupFieldList";
import { GitFork, Plus } from "lucide-react";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  binaryFields?: BinaryFieldOption[];
  onAddGroup: (group: {
    name: string;
    code: string;
    description?: string;
    parentFieldId?: number | null;
    showOnValue?: string | null;
    parentFieldId2?: number | null;
    showOnValue2?: string | null;
  }) => void;
}

export default function AddGroupModal({
  isOpen,
  onClose,
  binaryFields = [],
  onAddGroup,
}: AddGroupModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [parentFieldId, setParentFieldId] = useState<string>("none");
  const [showOnValue, setShowOnValue] = useState<string>("1");
  const [parentFieldId2, setParentFieldId2] = useState<string>("none");
  const [showOnValue2, setShowOnValue2] = useState<string>("1");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    if (!code.trim()) {
      setError("Group code is required.");
      return;
    }

    onAddGroup({
      name: name.trim(),
      code: code.trim().toUpperCase().replace(/\s+/g, "_"),
      description: description.trim() || undefined,
      parentFieldId: parentFieldId !== "none" ? parseInt(parentFieldId, 10) : null,
      showOnValue: parentFieldId !== "none" ? showOnValue : null,
      parentFieldId2:
        parentFieldId !== "none" && parentFieldId2 !== "none"
          ? parseInt(parentFieldId2, 10)
          : null,
      showOnValue2:
        parentFieldId !== "none" && parentFieldId2 !== "none"
          ? showOnValue2
          : null,
    });

    setName("");
    setCode("");
    setDescription("");
    setParentFieldId("none");
    setShowOnValue("1");
    setParentFieldId2("none");
    setShowOnValue2("1");
    setError("");
    onClose();
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code === name.toUpperCase().replace(/[^A-Z0-9]/g, "_")) {
      setCode(val.toUpperCase().replace(/[^A-Z0-9]/g, "_"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Add New Indicator Group / Form Section
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="group-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Group Title / Display Name *
            </Label>
            <Input
              id="group-name"
              placeholder="e.g. Elderly & Palliative Care"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="bg-white dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="group-code" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Group Code * (Unique Identifier)
            </Label>
            <Input
              id="group-code"
              placeholder="e.g. EC001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white dark:bg-slate-900 font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="group-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description / Verification Note (Optional)
            </Label>
            <Input
              id="group-desc"
              placeholder="e.g. Home visits and elderly clinic details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white dark:bg-slate-900"
            />
          </div>

          {/* Conditional Gate Config (Gate 1 & Gate 2) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Conditional Section Visibility (Up to 2 Binary Gates)
            </Label>

            {/* Gate 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] text-slate-500">Gate 1: Depends on Binary Field</Label>
                <Select value={parentFieldId} onValueChange={(val) => {
                  setParentFieldId(val);
                  if (val === "none") {
                    setParentFieldId2("none");
                  }
                }}>
                  <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900">
                    <SelectValue placeholder="Always Visible" />
                  </SelectTrigger>
                  <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                    <SelectItem value="none" className="text-xs text-slate-500 py-2">
                      Always Visible (No Gate)
                    </SelectItem>
                    {binaryFields.map((bf) => (
                      <SelectItem
                        key={bf.id}
                        value={String(bf.id)}
                        className="text-xs py-2.5 whitespace-normal leading-snug cursor-pointer"
                      >
                        {bf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {parentFieldId !== "none" && (
                <div>
                  <Label className="text-[11px] text-slate-500">Show Section When Gate 1 Is</Label>
                  <Select value={showOnValue} onValueChange={setShowOnValue}>
                    <SelectTrigger className="h-8 text-xs bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-200 font-bold border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-xs">
                        YES (1)
                      </SelectItem>
                      <SelectItem value="0" className="text-xs">
                        NO (0)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Gate 2 (AND Condition) */}
            {parentFieldId !== "none" && (
              <div className="pt-2 border-t border-purple-200 dark:border-purple-800/60 space-y-2">
                <Label className="text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  2nd Binary Gate (AND Condition)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <Select value={parentFieldId2} onValueChange={setParentFieldId2}>
                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900">
                        <SelectValue placeholder="-- No 2nd Gate --" />
                      </SelectTrigger>
                      <SelectContent className="w-[340px] sm:w-[440px] max-w-[90vw]">
                        <SelectItem value="none" className="text-xs text-slate-400 font-italic py-2">
                          -- No 2nd Gate --
                        </SelectItem>
                        {binaryFields
                          .filter((bf) => String(bf.id) !== parentFieldId)
                          .map((bf) => (
                            <SelectItem
                              key={bf.id}
                              value={String(bf.id)}
                              className="text-xs py-2.5 whitespace-normal leading-snug cursor-pointer"
                            >
                              {bf.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {parentFieldId2 !== "none" && (
                    <div>
                      <Select value={showOnValue2} onValueChange={setShowOnValue2}>
                        <SelectTrigger className="h-8 text-xs bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 font-bold border-purple-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1" className="text-xs">
                            AND Is YES (1)
                          </SelectItem>
                          <SelectItem value="0" className="text-xs">
                            AND Is NO (0)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
