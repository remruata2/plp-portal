"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit } from 'lucide-react';

// Types
interface Field {
  id: number;
  code: string;
  name: string;
}

interface Operand {
  alias: string;
  type: 'field' | 'constant';
  value: string | number; // Field ID or constant value
}

interface FormulaStructure {
  operands: Operand[];
  expression: string;
}

interface Formula {
  id: number;
  name: string;
  description: string | null;
  structure: FormulaStructure;
  created_at: string;
}

type FormulaFormData = Omit<Formula, 'id' | 'created_at'>;

export default function FormulasPage() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const initialFormData: FormulaFormData = {
    name: "",
    description: "",
    structure: {
      operands: [{ alias: 'A', type: 'field', value: '' }],
      expression: "",
    },
  };
  const [formData, setFormData] = useState<FormulaFormData>(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [formulasRes, fieldsRes] = await Promise.all([
        fetch("/api/formulas"),
        fetch("/api/health-data/fields"),
      ]);

      const formulasResult = await formulasRes.json();
      if (formulasResult.success) {
        setFormulas(formulasResult.data);
      } else {
        throw new Error(formulasResult.error || 'Failed to fetch formulas');
      }

      const fieldsResult = await fieldsRes.json();
      if (fieldsResult.success) {
        setFields(fieldsResult.data);
      } else {
        throw new Error(fieldsResult.error || 'Failed to fetch fields');
      }

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOperandChange = (index: number, field: keyof Operand, value: string | number) => {
    const newOperands = [...formData.structure.operands];
    newOperands[index] = { ...newOperands[index], [field]: value };
    // Reset value if type changes
    if (field === 'type') {
      newOperands[index].value = '';
    }
    setFormData({ ...formData, structure: { ...formData.structure, operands: newOperands } });
  };

  const addOperand = () => {
    const lastAlias = formData.structure.operands[formData.structure.operands.length - 1]?.alias || '@'; // '@' is before 'A'
    const nextAlias = String.fromCharCode(lastAlias.charCodeAt(0) + 1);
    const newOperands = [...formData.structure.operands, { alias: nextAlias, type: 'field' as const, value: '' }];
    setFormData({ ...formData, structure: { ...formData.structure, operands: newOperands } });
  };

  const removeOperand = (index: number) => {
    const newOperands = formData.structure.operands.filter((_, i) => i !== index);
    setFormData({ ...formData, structure: { ...formData.structure, operands: newOperands } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.structure.expression) {
      alert('Formula name and expression are required.');
      return;
    }
    if (formData.structure.operands.some(op => !op.alias || !op.value)) {
      alert('All operands must have an alias and a value.');
      return;
    }

    const url = isEditing ? `/api/formulas/${isEditing}` : '/api/formulas';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
        handleCancel();
      } else {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} formula`);
      }
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleEdit = (formula: Formula) => {
    setIsEditing(formula.id);
    setFormData({
      name: formula.name,
      description: formula.description || '',
      structure: formula.structure,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this formula?')) return;

    try {
      const res = await fetch(`/api/formulas/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to delete formula');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(null);
    setFormData(initialFormData);
  };

  const readableFormulas = useMemo(() => {
    return formulas.map(formula => {
        if (!formula.structure || !formula.structure.expression) return { ...formula, readableExpression: '-' };

        let readable = formula.structure.expression;
        formula.structure.operands.forEach(op => {
            const re = new RegExp(`\\b${op.alias}\\b`, 'g');
            if (op.type === 'field') {
                const field = fields.find(f => f.id.toString() === op.value.toString());
                readable = readable.replace(re, field ? `[${field.name}]` : `[Unknown Field]`);
            } else {
                readable = readable.replace(re, op.value.toString());
            }
        });
        return { ...formula, readableExpression: readable };
    });
  }, [formulas, fields]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Formula Management</h1>
          {!showForm && (
            <Button onClick={() => {
              setIsEditing(null);
              setFormData(initialFormData);
              setShowForm(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Formula
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Formula' : 'Create New Formula'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Formula Name</label>
                    <Input id="name" value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Maternal Mortality Ratio" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Textarea id="description" value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} placeholder="A brief explanation of what this formula calculates" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Operands (Variables)</h3>
                <div className="space-y-3">
                    {formData.structure.operands.map((op, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-3 bg-gray-50 rounded-md border">
                            <Input value={op.alias} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOperandChange(index, 'alias', e.target.value.toUpperCase())} placeholder="Alias (e.g., A)" className="uppercase" />
                            <Select value={op.type} onValueChange={(val: 'field' | 'constant') => handleOperandChange(index, 'type', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="field">Field</SelectItem>
                                    <SelectItem value="constant">Constant</SelectItem>
                                </SelectContent>
                            </Select>
                            {op.type === 'field' ? (
                                <Select value={op.value.toString()} onValueChange={(val) => handleOperandChange(index, 'value', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select a field..." /></SelectTrigger>
                                    <SelectContent>
                                        {fields.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name} ({f.code})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input type="number" value={op.value.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOperandChange(index, 'value', e.target.value)} placeholder="Enter a number" />
                            )}
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOperand(index)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOperand} className="mt-3">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Operand
                </Button>
              </div>

              <div>
                <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-1">Expression</label>
                <Textarea id="expression" value={formData.structure.expression} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, structure: { ...formData.structure, expression: e.target.value } })} placeholder="e.g., (A / B) * 100" required className="font-mono" />
                <p className="text-xs text-gray-500 mt-1">Use the aliases you defined above to build the formula.</p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update Formula' : 'Save Formula'}</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Existing Formulas</h2>
                <p className="text-sm text-gray-600">List of all configured formulas</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-4 font-medium">Formula Name</th>
                            <th className="text-left p-4 font-medium">Expression</th>
                            <th className="text-left p-4 font-medium">Created</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readableFormulas.map((formula) => (
                            <tr key={formula.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium">{formula.name}</div>
                                    {formula.description && <div className="text-sm text-gray-500">{formula.description}</div>}
                                </td>
                                <td className="p-4">
                                    <div className="font-mono text-sm text-gray-700">{formula.structure.expression}</div>
                                    <div className="text-xs text-gray-500 mt-1">{formula.readableExpression}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(formula.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(formula)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(formula.id)}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
