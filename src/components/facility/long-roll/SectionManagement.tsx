"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, ChevronRight, ChevronLeft, Search, Home } from "lucide-react";
import { toast } from "sonner";

interface Village {
  id: string;
  name: string;
}

interface Section {
  id: string;
  name: string;
  village_id: string;
  _count?: {
    family: number;
  };
}

interface SectionManagementProps {
  selectedVillage?: string | null;
  onSectionSelect: (sectionId: string) => void;
  onBackToVillages: () => void;
}

export default function SectionManagement({
  selectedVillage: villageId,
  onSectionSelect,
  onBackToVillages,
}: SectionManagementProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [villageInfo, setVillageInfo] = useState<Village | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("SectionManagement: villageId =", villageId);
    if (villageId) {
      loadSections(villageId);
      loadVillageInfo(villageId);
    }
  }, [villageId]);

  const loadVillageInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/long-roll/villages/${id}`);
      const data = await response.json();

      if (data.success) {
        setVillageInfo(data.village);
      }
    } catch (error) {
      console.error("Error loading village info:", error);
    }
  };

  const loadSections = async (id: string) => {
    try {
      setLoading(true);
      console.log("Loading sections for village:", id);
      const response = await fetch(`/api/facility/long-roll/sections?village_id=${id}`);
      console.log("Sections API response status:", response.status);
      const data = await response.json();
      console.log("Sections API data:", data);

      if (data.success) {
        setSections(data.sections);
        console.log("Loaded sections:", data.sections);
      } else {
        console.error("Failed to load sections:", data);
        toast.error("Failed to load sections");
      }
    } catch (error) {
      console.error("Error loading sections:", error);
      toast.error("Error loading sections");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setSectionName(section.name);
    } else {
      setEditingSection(null);
      setSectionName("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSection(null);
    setSectionName("");
  };

  const handleSave = async () => {
    if (!sectionName.trim()) {
      toast.error("Section name is required");
      return;
    }

    if (!villageId && !editingSection) {
      toast.error("Please select a village");
      return;
    }

    try {
      setSaving(true);
      const url = editingSection
        ? `/api/facility/long-roll/sections/${editingSection.id}`
        : "/api/facility/long-roll/sections";

      const response = await fetch(url, {
        method: editingSection ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sectionName,
          village_id: villageId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        handleCloseDialog();
        if (villageId) {
          loadSections(villageId);
        }
      } else {
        toast.error(data.error || "Failed to save section");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("Error saving section");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSection) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/facility/long-roll/sections/${deletingSection.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setIsDeleteDialogOpen(false);
        setDeletingSection(null);
        if (villageId) {
          loadSections(villageId);
        }
      } else {
        toast.error(data.error || "Failed to delete section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Error deleting section");
    } finally {
      setSaving(false);
    }
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!villageId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please select a village from the Villages tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBackToVillages}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Villages
        </Button>
      </div>

      {/* Breadcrumb */}
      {villageInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span className="font-medium">{villageInfo.name}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sections</CardTitle>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredSections.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? "No sections found matching your search" : "No sections in this village"}
              </p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Households</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSections.map((section) => (
                      <TableRow
                        key={section.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSectionSelect(section.id)}
                      >
                        <TableCell className="font-medium">
                          {section.name}
                        </TableCell>
                        <TableCell>
                          {section._count?.family || 0} households
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(section);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingSection(section);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? "Edit" : "Add"} Section</DialogTitle>
            <DialogDescription>
              {editingSection ? "Update" : "Create a new"} section for this village
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name *</Label>
              <Input
                id="section-name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g., Section A"
                disabled={saving}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingSection ? "Update" : "Add"} Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSection?.name}"? This will also delete all households and members in this section. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
