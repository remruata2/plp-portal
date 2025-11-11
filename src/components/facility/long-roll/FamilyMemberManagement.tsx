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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, ChevronLeft, Search, User, Home, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import {
  GENDER_OPTIONS,
  HOF_RELATIONSHIP_OPTIONS,
  DELETION_REASON_OPTIONS,
  getGenderLabel,
  getHOFRelationshipLabel,
} from "@/lib/long-roll-constants";
import {
  validateIndianPhoneNumber,
  validateIndianVoterID,
  validateABHAID,
  formatPhoneNumber,
  formatVoterID,
  formatABHAID,
} from "@/lib/validation-utils";

interface FamilyInfo {
  id: string;
  house_no: string;
  floor_no: string | null;
  section: {
    id: string;
    name: string;
    village: {
      id: string;
      name: string;
    };
  };
}

interface FamilyMember {
  id: string;
  name: string;
  relationship_with_hof: string;
  voter_id: string | null;
  phone: string | null;
  sex: string;
  occupation: string | null;
  abha_id: string | null;
  abha_address: string | null;
  dob: string;
}

interface FamilyMemberManagementProps {
  selectedFamily?: string | null;
  onBackToHouseholds: () => void;
}

export default function FamilyMemberManagement({
  selectedFamily: familyId,
  onBackToHouseholds,
}: FamilyMemberManagementProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteReason, setDeleteReason] = useState("OTHER");
  const [deleteRemarks, setDeleteRemarks] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    relationship_with_hof: "OTHER",
    voter_id: "",
    phone: "",
    sex: "MALE",
    occupation: "",
    abha_id: "",
    abha_address: "",
    dob: "",
  });

  useEffect(() => {
    if (familyId) {
      loadMembers(familyId);
      loadFamilyInfo(familyId);
    }
  }, [familyId]);

  const loadFamilyInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/long-roll/families/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFamilyInfo(data.family);
      }
    } catch (error) {
      console.error("Error loading family info:", error);
    }
  };

  const loadMembers = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facility/long-roll/family-members?family_id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        toast.error("Failed to load family members");
      }
    } catch (error) {
      console.error("Error loading family members:", error);
      toast.error("Error loading family members");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        relationship_with_hof: member.relationship_with_hof,
        voter_id: member.voter_id || "",
        phone: member.phone || "",
        sex: member.sex,
        occupation: member.occupation || "",
        abha_id: member.abha_id || "",
        abha_address: member.abha_address || "",
        dob: member.dob ? member.dob.split("T")[0] : "",
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        relationship_with_hof: "OTHER",
        voter_id: "",
        phone: "",
        sex: "MALE",
        occupation: "",
        abha_id: "",
        abha_address: "",
        dob: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!familyId && !editingMember) {
      toast.error("Please select a family");
      return;
    }

    // Validate phone number if provided
    if (formData.phone && formData.phone.trim()) {
      const phoneValidation = validateIndianPhoneNumber(formData.phone);
      if (!phoneValidation.isValid) {
        toast.error(phoneValidation.error);
        return;
      }
    }

    // Validate voter ID if provided
    if (formData.voter_id && formData.voter_id.trim()) {
      const voterIdValidation = validateIndianVoterID(formData.voter_id);
      if (!voterIdValidation.isValid) {
        toast.error(voterIdValidation.error);
        return;
      }
    }

    // Validate ABHA ID if provided
    if (formData.abha_id && formData.abha_id.trim()) {
      const abhaValidation = validateABHAID(formData.abha_id);
      if (!abhaValidation.isValid) {
        toast.error(abhaValidation.error);
        return;
      }
    }

    try {
      setSaving(true);
      const url = editingMember
        ? `/api/facility/long-roll/family-members/${editingMember.id}`
        : "/api/facility/long-roll/family-members";
      
      const formattedData = {
        ...formData,
        phone: formData.phone && formData.phone.trim() ? formatPhoneNumber(formData.phone) : null,
        voter_id: formData.voter_id && formData.voter_id.trim() ? formatVoterID(formData.voter_id) : null,
        abha_id: formData.abha_id && formData.abha_id.trim() ? formatABHAID(formData.abha_id) : null,
        family_id: familyId,
      };
      
      const response = await fetch(url, {
        method: editingMember ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        handleCloseDialog();
        if (familyId) {
          loadMembers(familyId);
        }
      } else {
        toast.error(data.error || "Failed to save family member");
      }
    } catch (error) {
      console.error("Error saving family member:", error);
      toast.error("Error saving family member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/facility/long-roll/family-members/${deletingMember.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleted_reason: deleteReason,
          deleted_remarks: deleteRemarks,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setIsDeleteDialogOpen(false);
        setDeletingMember(null);
        if (familyId) {
          loadMembers(familyId);
        }
      } else {
        toast.error(data.error || "Failed to delete family member");
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
      toast.error("Error deleting family member");
    } finally {
      setSaving(false);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.voter_id?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.abha_id?.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  if (!familyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please select a household from the Household/Families tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBackToHouseholds}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Household/Families
        </Button>
      </div>

      {/* Breadcrumb */}
      {familyInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Home className="h-4 w-4" />
              <span className="font-medium">{familyInfo.section.village.name}</span>
              <span>→</span>
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{familyInfo.section.name}</span>
              <span>→</span>
              <Users className="h-4 w-4" />
              <span className="font-medium">
                House {familyInfo.house_no}
                {familyInfo.floor_no && `, Floor ${familyInfo.floor_no}`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Household Members
            </CardTitle>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {memberSearchQuery ? "No members found matching your search" : "No members in this household"}
              </p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Voter ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getHOFRelationshipLabel(member.relationship_with_hof as any)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getGenderLabel(member.sex as any)}</TableCell>
                        <TableCell>{member.phone || "-"}</TableCell>
                        <TableCell>{member.voter_id || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingMember(member);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit" : "Add"} Family Member</DialogTitle>
            <DialogDescription>
              {editingMember ? "Update" : "Add"} family member information
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  disabled={saving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship with HOF *</Label>
                <Select
                  value={formData.relationship_with_hof}
                  onValueChange={(value) => setFormData({ ...formData, relationship_with_hof: value })}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOF_RELATIONSHIP_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sex">Gender *</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => setFormData({ ...formData, sex: value })}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 9876543210 (optional)"
                  maxLength={10}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">10 digits starting with 6, 7, 8, or 9 (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voter-id">Voter ID</Label>
                <Input
                  id="voter-id"
                  value={formData.voter_id}
                  onChange={(e) => setFormData({ ...formData, voter_id: e.target.value.toUpperCase() })}
                  placeholder="e.g., ABC1234567 (optional)"
                  maxLength={10}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">3 letters + 7 digits (optional)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Occupation"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abha-id">ABHA ID</Label>
                <Input
                  id="abha-id"
                  value={formData.abha_id}
                  onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                  placeholder="e.g., 12345678901234"
                  maxLength={14}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">14 digits (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="abha-address">ABHA Address</Label>
                <Input
                  id="abha-address"
                  value={formData.abha_address}
                  onChange={(e) => setFormData({ ...formData, abha_address: e.target.value })}
                  placeholder="ABHA Address"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMember ? "Update" : "Add"} Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingMember?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-reason">Reason for Deletion *</Label>
              <Select value={deleteReason} onValueChange={setDeleteReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELETION_REASON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-remarks">Remarks</Label>
              <Input
                id="delete-remarks"
                value={deleteRemarks}
                onChange={(e) => setDeleteRemarks(e.target.value)}
                placeholder="Additional remarks (optional)"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
