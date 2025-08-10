"use client";

import { useState, useEffect } from "react";
import DynamicHealthDataForm from "@/components/forms/DynamicHealthDataForm";

export default function TestDebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log("Testing API call...");
        const response = await fetch("/api/health-data/field-mappings/PHC", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error:", errorText);
          setError(`API Error: ${response.status} - ${errorText}`);
          return;
        }

        const data = await response.json();
        console.log("API response:", data);
        setApiResponse(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Fetch Error: ${err}`);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Debug Test Page</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">API Response:</h2>
        {error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : apiResponse ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Loading API response...
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Component Test:</h2>
        <DynamicHealthDataForm
          facilityType="PHC"
          userRole="facility"
          onSubmissionSuccess={() => console.log("Success!")}
        />
      </div>
    </div>
  );
}
