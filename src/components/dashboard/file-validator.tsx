"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface ValidationResult {
  file: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  successRate: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  totalErrors: number;
  totalWarnings: number;
  totalSuggestions: number;
}

export default function FileValidator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationResult(null);
      setError(null);
    }
  };

  const handleValidate = async () => {
    if (!selectedFile) return;

    setValidating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/data/validate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setValidationResult(result.data);
      } else {
        setError(result.error || "Validation failed");
      }
    } catch (error) {
      setError("Failed to validate file");
    } finally {
      setValidating(false);
    }
  };

  const getStatusIcon = () => {
    if (!validationResult) return null;

    if (validationResult.successRate === 100) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (validationResult.successRate >= 80) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!validationResult) return "text-gray-500";

    if (validationResult.successRate === 100) return "text-green-600";
    if (validationResult.successRate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          File Validator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            htmlFor="file-validator"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select File to Validate
          </label>
          <Input
            id="file-validator"
            type="file"
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            disabled={validating}
          />
        </div>

        <Button
          onClick={handleValidate}
          disabled={!selectedFile || validating}
          className="w-full"
        >
          {validating ? "Validating..." : "Validate File"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationResult && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className={getStatusColor()}>
                    Validation Results: {validationResult.successRate}% Success
                    Rate
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {validationResult.totalRows}
                    </div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult.validRows}
                    </div>
                    <div className="text-sm text-gray-600">Valid Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {validationResult.invalidRows}
                    </div>
                    <div className="text-sm text-gray-600">Invalid Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {validationResult.totalWarnings}
                    </div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                </div>

                <Progress
                  value={validationResult.successRate}
                  className="mb-4"
                />

                {validationResult.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      Warnings ({validationResult.totalWarnings})
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="mt-2 space-y-1">
                        {validationResult.warnings
                          .slice(0, 5)
                          .map((warning, index) => (
                            <li key={index} className="text-sm">
                              {warning}
                            </li>
                          ))}
                        {validationResult.totalWarnings > 5 && (
                          <li className="text-sm text-gray-500">
                            ... and {validationResult.totalWarnings - 5} more
                            warnings
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult.suggestions.length > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>
                      Suggestions ({validationResult.totalSuggestions})
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="mt-2 space-y-1">
                        {validationResult.suggestions
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <li key={index} className="text-sm">
                              {suggestion}
                            </li>
                          ))}
                        {validationResult.totalSuggestions > 5 && (
                          <li className="text-sm text-gray-500">
                            ... and {validationResult.totalSuggestions - 5} more
                            suggestions
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>
                      Errors ({validationResult.totalErrors})
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="mt-2 space-y-1">
                        {validationResult.errors
                          .slice(0, 5)
                          .map((error, index) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                        {validationResult.totalErrors > 5 && (
                          <li className="text-sm">
                            ... and {validationResult.totalErrors - 5} more
                            errors
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
