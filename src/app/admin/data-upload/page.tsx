"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface ValidationResult {
  unrecognizedHeaders: string[];
  unrecognizedFacilities: string[];
  rowCount: number;
  dataForImport: any[];
}

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [isUploading, setIsUploading] = useState(false); // For validation
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null); // For validation

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean, message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setValidationResult(null); // Reset validation on new file selection
      setError(null);
      setImportStatus(null); // Reset import status
    }
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !month || !year) {
      setError('Please select a file, month, and year.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setValidationResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);
    formData.append('year', year);

    try {
      const response = await fetch('/api/data-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Validation failed');
      }

      setValidationResult(result.validation);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleImport = async () => {
    if (!validationResult || !validationResult.dataForImport || validationResult.dataForImport.length === 0) {
      setImportStatus({ success: false, message: 'No valid data available to import.' });
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      const response = await fetch('/api/data-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataForImport: validationResult.dataForImport,
          month,
          year,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setImportStatus({ success: true, message: `${result.successCount} records imported successfully!` });
      setValidationResult(null);
      setFile(null);
      // Reset file input visually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      setImportStatus({ success: false, message: err.message || 'An unexpected error occurred during import.' });
    } finally {
      setIsImporting(false);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));

  const isValidationSuccess = validationResult && validationResult.unrecognizedHeaders.length === 0 && validationResult.unrecognizedFacilities.length === 0;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Monthly Health Data</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-8">
        
        {/* Upload Form */}
        <form onSubmit={handleValidate} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              CSV File
            </label>
            <Input id="file-upload" type="file" onChange={handleFileChange} accept=".csv" required />
            <p className="text-xs text-gray-500 mt-1">Upload a CSV file with indicators as headers and facilities as rows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <Select value={month} onValueChange={setMonth} required>
                <SelectTrigger id="month"><SelectValue placeholder="Select month" /></SelectTrigger>
                <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year"><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-right">
            <Button type="submit" disabled={isUploading || !file}>
              {isUploading ? 'Validating...' : 'Upload & Validate'}
            </Button>
          </div>
        </form>

        {/* Status Messages */}
        {error && <div className="p-4 bg-red-100 text-red-800 rounded-md"><strong>Validation Error:</strong> {error}</div>}
        {importStatus && (
          <div className={`p-4 rounded-md ${importStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <strong>{importStatus.success ? 'Success' : 'Import Error'}:</strong> {importStatus.message}
          </div>
        )}

        {/* Validation Results */}
        {validationResult && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Validation Results</h2>
            {isValidationSuccess ? (
              <div className="p-4 bg-green-100 text-green-800 rounded-md">
                <h3 className="font-bold">Validation Successful!</h3>
                <p>{validationResult.rowCount} rows of data are ready for import.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
                  <h3 className="font-bold">Validation Issues Found</h3>
                  <p>Please correct the following issues in your CSV file and try again.</p>
                </div>
                {validationResult.unrecognizedHeaders.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Unrecognized Indicator Codes (Headers):</h4>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md mt-1">
                      {validationResult.unrecognizedHeaders.map(h => <li key={h} className="font-mono text-sm">{h}</li>)}
                    </ul>
                  </div>
                )}
                {validationResult.unrecognizedFacilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Unrecognized Facility Names:</h4>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md mt-1">
                      {validationResult.unrecognizedFacilities.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {isValidationSuccess && (
              <div className="mt-6 text-right">
                <Button onClick={handleImport} size="lg" disabled={isImporting}>
                  {isImporting ? 'Importing...' : 'Confirm & Import Data'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
