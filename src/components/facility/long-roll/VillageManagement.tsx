"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Edit, Trash2, Loader2, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";

interface Village {
  id: string;
  name: string;
  created_at: string;
  _count?: {
    section: number;
  };
}

interface VillageManagementProps {
  onVillageSelect: (villageId: string) => void;
}

export default function VillageManagement({ onVillageSelect }: VillageManagementProps) {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [villageName, setVillageName] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/facility/long-roll/villages");
      const data = await response.json();

      if (data.success) {
        setVillages(data.villages);
      } else {
        toast.error("Failed to load villages");
      }
    } catch (error) {
      console.error("Error loading villages:", error);
      toast.error("Error loading villages");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (village?: Village) => {
    if (village) {
      setEditingVillage(village);
      setVillageName(village.name);
    } else {
      setEditingVillage(null);
      setVillageName("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVillage(null);
    setVillageName("");
  };

  const handleSave = async () => {
    if (!villageName.trim()) {
      toast.error("Village name is required");
      return;
    }

    try {
      setSaving(true);

      const url = editingVillage
        ? `/api/facility/long-roll/villages/${editingVillage.id}`
        : "/api/facility/long-roll/villages";

      const method = editingVillage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: villageName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        handleCloseDialog();
        loadVillages();
      } else {
        toast.error(data.error || "Failed to save village");
      }
    } catch (error) {
      console.error("Error saving village:", error);
      toast.error("Error saving village");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (village: Village) => {
    if (!confirm(`Are you sure you want to delete "${village.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/facility/long-roll/villages/${village.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Deleted by user" }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        loadVillages();
      } else {
        toast.error(data.error || "Failed to delete village");
      }
    } catch (error) {
      console.error("Error deleting village:", error);
      toast.error("Error deleting village");
    }
  };

  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search villages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Village
        </Button>
      </div>

      {filteredVillages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? "No villages found matching your search" : "No villages added yet"}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Village Name</TableHead>
                <TableHead className="text-center">Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVillages.map((village) => (
                <TableRow
                  key={village.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onVillageSelect(village.id)}
                >
                  <TableCell className="font-medium">{village.name}</TableCell>
                  <TableCell className="text-center">
                    {village._count?.section || 0} sections
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(village);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(village);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVillage ? "Edit Village" : "Add New Village"}
            </DialogTitle>
            <DialogDescription>
              {editingVillage
                ? "Update the village name"
                : "Enter the name of the new village"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="village-name">Village Name</Label>
              <Input
                id="village-name"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="Enter village name"
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingVillage ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
