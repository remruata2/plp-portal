'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

interface Field {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

const newFieldInitialState: Omit<Field, 'id'> = {
  code: '',
  name: '',
  description: '',
};

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState(newFieldInitialState);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/health-data/fields');
      const result = await res.json();
      if (result.success) {
        setFields(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch fields');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/health-data/fields/${isEditing}` : '/api/health-data/fields';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        fetchData(); // Refresh list
        setShowForm(false);
        setIsEditing(null);
        setFormData(newFieldInitialState);
      } else {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} field`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (field: Field) => {
    setFormData({
      code: field.code,
      name: field.name,
      description: field.description || '',
    });
    setIsEditing(field.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      const res = await fetch(`/api/health-data/fields/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        fetchData(); // Refresh list
      } else {
        throw new Error(result.error || 'Failed to delete field');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(null);
    setFormData(newFieldInitialState);
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fields</h1>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setIsEditing(null); setFormData(newFieldInitialState); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Field
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Field' : 'Create New Field'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
                <Input id="code" name="code" value={formData.code} onChange={handleInputChange} required disabled={!!isEditing} />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update Field' : 'Save Field'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fields.map(field => (
              <div key={field.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                <div>
                  <p className="font-semibold">{field.name} <span className="text-sm text-gray-500">({field.code})</span></p>
                  <p className="text-sm text-gray-600">{field.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(field)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(field.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
