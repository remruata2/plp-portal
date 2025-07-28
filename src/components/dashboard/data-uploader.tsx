"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface UploadResult {
  sessionId: number;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

interface UploadSession {
  id: number;
  file_name: string;
  report_month: string;
  total_records: number;
  success_count: number;
  error_count: number;
  status: "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  upload_summary: any;
  created_at: string;
  completed_at?: string;
  uploader: {
    username: string;
  };
}

export default function DataUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [reportMonth, setReportMonth] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default month to current month
  useState(() => {
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    setReportMonth(defaultMonth);
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls")
      ) {
        alert("Please select an Excel file (.xlsx or .xls)");
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
      setUploadSession(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (
        !droppedFile.name.endsWith(".xlsx") &&
        !droppedFile.name.endsWith(".xls")
      ) {
        alert("Please select an Excel file (.xlsx or .xls)");
        return;
      }
      setFile(droppedFile);
      setUploadResult(null);
      setUploadSession(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadFile = async () => {
    if (!file || !reportMonth) {
      alert("Please select a file and report month");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reportMonth", reportMonth);
      formData.append("uploadedBy", "1"); // TODO: Get from auth context

      const response = await fetch("/api/data/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Upload failed");
      }

      setUploadResult(data.data);

      // Fetch session details
      if (data.data.sessionId) {
        fetchSessionDetails(data.data.sessionId);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/data/upload?sessionId=${sessionId}`);
      const data = await response.json();

      if (response.ok) {
        setUploadSession(data.data);
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult(null);
    setUploadSession(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Upload Health Data
        </CardTitle>
        <CardDescription>
          Upload completed Excel templates with monthly health data
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Report Month */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Month</label>
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Excel File</label>

          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Drop your Excel file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={clearFile}>
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={uploadFile}
            disabled={isUploading || !file || !reportMonth}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Upload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </>
            )}
          </Button>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Upload Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadResult.totalRecords}
                </div>
                <div className="text-sm text-blue-600">Total Records</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {uploadResult.successCount}
                  </div>
                </div>
                <div className="text-sm text-green-600">Successful</div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {uploadResult.errorCount}
                  </div>
                </div>
                <div className="text-sm text-red-600">Errors</div>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-800">Errors Found</h4>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {uploadResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Details */}
        {uploadSession && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Session Details</h3>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Session ID:</span>
                <span className="text-sm">{uploadSession.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`text-sm px-2 py-1 rounded text-xs font-medium ${
                    uploadSession.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : uploadSession.status === "FAILED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {uploadSession.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uploaded by:</span>
                <span className="text-sm">
                  {uploadSession.uploader.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Upload time:</span>
                <span className="text-sm">
                  {new Date(uploadSession.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Upload Instructions:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • Use the Excel template generated from the Template Generator
            </li>
            <li>• Fill in all required data fields accurately</li>
            <li>• Ensure the report month matches the template month</li>
            <li>• The system will validate data and show any errors</li>
            <li>
              • Successfully uploaded data will be available in the dashboard
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
