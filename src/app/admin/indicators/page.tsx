"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit } from 'lucide-react';

// Types
interface Operand {
  alias: string;
  type: 'indicator' | 'constant';
  indicatorId?: number;
  value?: string | number;
}

interface FormulaStructure {
  operands: Operand[];
  expression: string;
}

interface Indicator {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: 'simple' | 'formula';
  structure: FormulaStructure | null;
  created_at: string;
}

type IndicatorFormData = Omit<Indicator, 'id' | 'created_at'>;

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const initialFormData: IndicatorFormData = {
    code: "",
    name: "",
    description: "",
    type: "simple",
    structure: null,
  };
  const [formData, setFormData] = useState<IndicatorFormData>(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const indicatorsRes = await fetch("/api/indicators");
      const indicatorsResult = await indicatorsRes.json();
      if (indicatorsResult.success) {
        setIndicators(indicatorsResult.data);
      } else {
        throw new Error(indicatorsResult.error || 'Failed to fetch indicators');
      }

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOperandChange = (index: number, field: keyof Operand, value: string | number) => {
    if (!formData.structure) return;

    const newOperands = [...formData.structure.operands];
    const currentOperand = { ...newOperands[index], [field]: value };

    if (field === 'type') {
      currentOperand.value = undefined;
      currentOperand.indicatorId = undefined;
    }
    newOperands[index] = currentOperand;

    setFormData({
      ...formData,
      structure: {
        ...formData.structure,
        operands: newOperands,
      },
    });
  };

  const addOperand = () => {
    const currentOperands = formData.structure?.operands || [];
    const lastAlias = currentOperands[currentOperands.length - 1]?.alias || '@';
    const nextAlias = String.fromCharCode(lastAlias.charCodeAt(0) + 1);
    const newOperands = [...currentOperands, { alias: nextAlias, type: 'indicator' as const }];

    setFormData({
      ...formData,
      structure: {
        ...formData.structure!,
        operands: newOperands,
      },
    });
  };

  const removeOperand = (index: number) => {
    if (!formData.structure) return;

    const newOperands = formData.structure.operands.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      structure: {
        ...formData.structure,
        operands: newOperands,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Indicator code and name are required.');
      return;
    }

    if (formData.type === 'formula') {
      if (!formData.structure || !formData.structure.expression) {
        alert('Formula expression is required.');
        return;
      }
      for (const op of formData.structure.operands) {
        if (op.type === 'indicator' && !op.indicatorId) {
          alert(`Operand ${op.alias} is missing an indicator selection.`);
          return;
        }
        if (op.type === 'constant' && (op.value === '' || op.value === undefined)) {
          alert(`Operand ${op.alias} is missing a constant value.`);
          return;
        }
      }
    }

    const url = isEditing ? `/api/indicators/${isEditing}` : '/api/indicators';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        fetchData();
        handleCancel();
      } else {
        throw new Error(result.error || 'Failed to save indicator');
      }
    } catch (err: any) {
      console.error("Error saving indicator:", err);
      setError(err.message);
    }
  };

  const handleEdit = (indicator: Indicator) => {
    setIsEditing(indicator.id);
    setFormData({
      ...indicator,
      description: indicator.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this indicator?')) return;

    try {
      const response = await fetch(`/api/indicators/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to delete indicator');
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

  const handleTypeChange = (type: 'simple' | 'formula') => {
    setFormData(prev => {
      const newFormData = { ...prev, type };
      if (type === 'formula' && !newFormData.structure) {
        newFormData.structure = { operands: [], expression: '' };
      } else if (type === 'simple') {
        newFormData.structure = null;
      }
      return newFormData;
    });
  };

  const readableIndicators: (Indicator & { readableExpression: string | null })[] = useMemo(() => {
    return indicators.map(indicator => {
      if (indicator.type === 'formula' && indicator.structure) {
        const readableExpression = indicator.structure.operands.reduce((expr, operand) => {
          let valueName = '';
          if (operand.type === 'indicator') {
            const referencedIndicator = indicators.find(i => i.id === operand.indicatorId);
            valueName = referencedIndicator ? referencedIndicator.name : 'Unknown Indicator';
          } else {
            valueName = operand.value?.toString() || 'Constant';
          }
          return expr.replace(new RegExp(`\\b${operand.alias}\\b`, 'g'), `(${valueName})`);
        }, indicator.structure.expression);

        return { ...indicator, readableExpression };
      }
      return { ...indicator, readableExpression: null };
    });
  }, [indicators]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Indicators Management</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Indicator
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Indicator' : 'Add New Indicator'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Indicator Code (e.g., H1.1)"
                  required
                />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Indicator Name"
                  required
                />
              </div>

              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description (optional)"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Indicator Type</label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="formula">Formula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'formula' && (
                <>
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-medium">Formula Builder</h3>
                    {formData.structure?.operands.map((operand, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          value={operand.alias}
                          onChange={(e) => handleOperandChange(index, 'alias', e.target.value)}
                          placeholder="Alias (e.g., A)"
                          className="w-24 font-mono"
                          required
                        />
                        <div className="flex-grow">
                          <Select
                            value={operand.type}
                            onValueChange={(value) => handleOperandChange(index, 'type', value as 'indicator' | 'constant')}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indicator">Indicator</SelectItem>
                              <SelectItem value="constant">Constant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-grow">
                          {operand.type === 'indicator' ? (
                            <Select
                              value={String(operand.indicatorId || '')}
                              onValueChange={(value) => handleOperandChange(index, 'indicatorId', Number(value))}
                            >
                              <SelectTrigger><SelectValue placeholder="Select an indicator..." /></SelectTrigger>
                              <SelectContent>
                                {indicators.filter(i => i.id !== (isEditing || 0)).map(indicator => (
                                  <SelectItem key={indicator.id} value={String(indicator.id)}>{indicator.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type="number"
                              value={operand.value || ''}
                              onChange={(e) => handleOperandChange(index, 'value', e.target.value)}
                              placeholder="Enter a numeric value"
                            />
                          )}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOperand(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOperand}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Operand
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expression</label>
                    <Input
                      value={formData.structure?.expression || ''}
                      onChange={(e) =>
                        formData.structure && setFormData({
                          ...formData,
                          structure: {
                            ...formData.structure,
                            expression: e.target.value
                          }
                        })
                      }
                      placeholder="e.g., (A / B) * 100"
                      required={formData.type === 'formula'}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the aliases you defined above to build the formula.</p>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update Indicator' : 'Save Indicator'}</Button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Existing Indicators</h2>
              <p className="text-sm text-gray-600">List of all configured indicators</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium">Code</th>
                    <th className="text-left p-4 font-medium">Indicator Name</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Expression/Details</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {readableIndicators.map((indicator) => (
                    <tr key={indicator.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{indicator.code}</td>
                      <td className="p-4">
                        <div className="font-medium">{indicator.name}</div>
                        {indicator.description && <div className="text-sm text-gray-500">{indicator.description}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${indicator.type === 'formula' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {indicator.type === 'formula' ? 'Formula' : 'Simple'}
                        </span>
                      </td>
                      <td className="p-4">
                        {indicator.type === 'formula' && indicator.structure ? (
                          <>
                            <div className="font-mono text-sm text-gray-700">{indicator.structure.expression}</div>
                            {indicator.readableExpression && <div className="text-xs text-gray-500 mt-1">{indicator.readableExpression}</div>}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Simple indicator (no formula)</div>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(indicator.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(indicator)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(indicator.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
