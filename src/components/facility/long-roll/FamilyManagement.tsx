"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, ChevronRight, ChevronLeft, Search, Home, MapPin } from "lucide-react";
import { toast } from "sonner";
import { HABITATION_TYPE_OPTIONS } from "@/lib/long-roll-constants";

interface SectionInfo {
  id: string;
  name: string;
  village: {
    id: string;
    name: string;
  };
}

interface Family {
  id: string;
  house_no: string;
  floor_no: string | null;
  no_of_couples: number;
  habitation_type: string;
  _count?: {
    family_member: number;
  };
}

interface FamilyManagementProps {
  selectedSection: string | null;
  onFamilySelect: (familyId: string) => void;
  onBackToSections: () => void;
}

export default function FamilyManagement({
  selectedSection: sectionId,
  onFamilySelect,
  onBackToSections,
}: FamilyManagementProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [sectionInfo, setSectionInfo] = useState<SectionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    house_no: "",
    floor_no: "",
    no_of_couples: 0,
    habitation_type: "PERMANENT",
  });

  useEffect(() => {
    if (sectionId) {
      loadFamilies(sectionId);
      loadSectionInfo(sectionId);
    }
  }, [sectionId]);

  const loadSectionInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/long-roll/sections/${id}`);
      const data = await response.json();

      if (data.success) {
        setSectionInfo(data.section);
      }
    } catch (error) {
      console.error("Error loading section info:", error);
    }
  };

  const loadFamilies = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facility/long-roll/families?section_id=${id}`);
      const data = await response.json();

      if (data.success) {
        setFamilies(data.families);
      } else {
        toast.error("Failed to load families");
      }
    } catch (error) {
      console.error("Error loading families:", error);
      toast.error("Error loading families");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (family?: Family) => {
    if (family) {
      setEditingFamily(family);
      setFormData({
        house_no: family.house_no,
        floor_no: family.floor_no || "",
        no_of_couples: family.no_of_couples,
        habitation_type: family.habitation_type,
      });
    } else {
      setEditingFamily(null);
      setFormData({
        house_no: "",
        floor_no: "",
        no_of_couples: 0,
        habitation_type: "PERMANENT",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFamily(null);
  };

  const handleSave = async () => {
    if (!formData.house_no.trim()) {
      toast.error("House number is required");
      return;
    }

    if (!sectionId && !editingFamily) {
      toast.error("Please select a section");
      return;
    }

    try {
      setSaving(true);
      const url = editingFamily
        ? `/api/facility/long-roll/families/${editingFamily.id}`
        : "/api/facility/long-roll/families";

      const response = await fetch(url, {
        method: editingFamily ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          section_id: sectionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        handleCloseDialog();
        if (sectionId) {
          loadFamilies(sectionId);
        }
      } else {
        toast.error(data.error || "Failed to save family");
      }
    } catch (error) {
      console.error("Error saving family:", error);
      toast.error("Error saving family");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (family: Family) => {
    if (!confirm(`Are you sure you want to delete household ${family.house_no}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/facility/long-roll/families/${family.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        if (sectionId) {
          loadFamilies(sectionId);
        }
      } else {
        toast.error(data.error || "Failed to delete family");
      }
    } catch (error) {
      console.error("Error deleting family:", error);
      toast.error("Error deleting family");
    }
  };

  const filteredFamilies = families.filter((family) =>
    family.house_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!sectionId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please select a section from the Sections tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBackToSections}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Sections
        </Button>
      </div>

      {/* Breadcrumb */}
      {sectionInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Home className="h-4 w-4" />
              <span className="font-medium">{sectionInfo.village.name}</span>
              <span>→</span>
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{sectionInfo.name}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Families Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Household/Families</CardTitle>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Household
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by house number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredFamilies.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? "No households found matching your search" : "No households in this section"}
              </p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House No</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Couples</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Members</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFamilies.map((family) => (
                      <TableRow
                        key={family.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onFamilySelect(family.id)}
                      >
                        <TableCell className="font-medium">{family.house_no}</TableCell>
                        <TableCell>{family.floor_no || "-"}</TableCell>
                        <TableCell>{family.no_of_couples}</TableCell>
                        <TableCell>
                          <Badge variant={family.habitation_type === "PERMANENT" ? "default" : "secondary"}>
                            {family.habitation_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {family._count?.family_member || 0} members
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(family);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(family);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
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
            <DialogTitle>{editingFamily ? "Edit" : "Add"} Household</DialogTitle>
            <DialogDescription>
              {editingFamily ? "Update" : "Create a new"} household for this section
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="house-no">House Number *</Label>
                <Input
                  id="house-no"
                  value={formData.house_no}
                  onChange={(e) => setFormData({ ...formData, house_no: e.target.value })}
                  placeholder="e.g., V12"
                  disabled={saving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor-no">Floor Number</Label>
                <Input
                  id="floor-no"
                  value={formData.floor_no}
                  onChange={(e) => setFormData({ ...formData, floor_no: e.target.value })}
                  placeholder="e.g., 1, 2 (optional)"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="couples">Number of Couples</Label>
                <Input
                  id="couples"
                  type="number"
                  min="0"
                  value={formData.no_of_couples}
                  onChange={(e) => setFormData({ ...formData, no_of_couples: parseInt(e.target.value) || 0 })}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="habitation-type">Habitation Type</Label>
                <Select
                  value={formData.habitation_type}
                  onValueChange={(value) => setFormData({ ...formData, habitation_type: value })}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HABITATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingFamily ? "Update" : "Add"} Household
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
