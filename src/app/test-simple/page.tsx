"use client";

import { useState, useEffect } from "react";

export default function TestSimplePage() {
  const [status, setStatus] = useState("Initializing...");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus("Starting API call...");
        console.log("Starting API call...");

        const response = await fetch("/api/health-data/field-mappings/PHC", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setStatus(`Response status: ${response.status}`);
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          setError(`API Error: ${response.status} - ${errorText}`);
          setStatus("Error");
          return;
        }

        const responseData = await response.json();
        console.log("Response data:", responseData);
        setData(responseData);
        setStatus("Success");
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(`Fetch Error: ${err.message}`);
        setStatus("Error");
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Simple API Test</h1>

      <div className="space-y-2">
        <p>
          <strong>Status:</strong> {status}
        </p>
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        {data && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <strong>Success!</strong> Found {data.mappings?.length || 0}{" "}
            mappings
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
