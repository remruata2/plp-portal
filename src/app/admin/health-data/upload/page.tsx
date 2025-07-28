"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface UploadResult {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  total_records: number;
  success_count: number;
  error_count: number;
  upload_summary: { errors: { row: number; error: string }[] } | null;
}

const POLLING_INTERVAL = 3000; // 3 seconds

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportMonth, setReportMonth] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    // Set current month as default
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    setReportMonth(monthStr);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Polling effect
  useEffect(() => {
    if (!sessionId || !uploading) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/data/upload?sessionId=${sessionId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to get upload status.");
        }

        const sessionData: UploadResult = result.data;
        const processedCount =
          sessionData.success_count + sessionData.error_count;
        const total = sessionData.total_records || processedCount;
        setUploadStatus(`Processing... (${processedCount} / ${total})`);

        if (
          sessionData.status === "COMPLETED" ||
          sessionData.status === "FAILED"
        ) {
          setUploading(false);
          setSessionId(null);
          setUploadResult(sessionData);
          if (sessionData.status === "FAILED" && !error) {
            const firstError = sessionData.upload_summary?.errors?.[0]?.error;
            setError(
              firstError || "An unknown error occurred during processing."
            );
          }
        }
      } catch (err: any) {
        setError(err.message);
        setUploading(false);
        setSessionId(null);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [sessionId, uploading]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !reportMonth) {
      setError("Please select a file and a report month.");
      return;
    }

    setUploading(true);
    setUploadResult(null);
    setError(null);
    setUploadStatus("Uploading file...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("reportMonth", reportMonth);
    formData.append("uploadedBy", "1"); // TODO: Get from auth session

    try {
      const response = await fetch("/api/data/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadStatus("File uploaded. Waiting for processing to start...");
      setSessionId(result.data.sessionId);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Health Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Select File (CSV or Excel - .csv, .xlsx, .xls)
              </label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label
                htmlFor="report-month"
                className="block text-sm font-medium text-gray-700"
              >
                Report Month
              </label>
              <Input
                id="report-month"
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                required
                disabled={uploading}
              />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Processing..." : "Upload Data"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {uploading && uploadStatus && (
        <div className="mt-4 p-4 border rounded-md">
          <p className="text-center font-semibold">{uploadStatus}</p>
          {uploadResult && uploadResult.total_records > 0 && (
            <Progress
              value={
                ((uploadResult.success_count + uploadResult.error_count) /
                  uploadResult.total_records) *
                100
              }
              className="mt-2"
            />
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadResult && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Upload {uploadResult.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total records in file: {uploadResult.total_records}</p>
              <p className="text-green-600">
                Successful uploads: {uploadResult.success_count}
              </p>
              <p className="text-red-600">
                Failed uploads: {uploadResult.error_count}
              </p>
            </div>
            {uploadResult.upload_summary?.errors &&
              uploadResult.upload_summary.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold">Error Details:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadResult.upload_summary.errors
                        .slice(0, 10)
                        .map((err, index) => (
                          <TableRow key={index}>
                            <TableCell>{err.row}</TableCell>
                            <TableCell>{err.error}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
