"use client";

import DynamicHealthDataForm from "./src/components/forms/DynamicHealthDataForm";

export default function TestComponent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test DynamicHealthDataForm</h1>
      <DynamicHealthDataForm
        facilityType="PHC"
        userRole="facility"
        onSubmissionSuccess={() => console.log("Submission successful")}
      />
    </div>
  );
}
