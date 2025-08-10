"use client";

import React, { useState, useEffect } from "react";
import { PrismaClient } from "../../generated/prisma";

interface FormulaConfig {
  id: number;
  name: string;
  formula: string;
  formulaType: string;
  minThreshold?: number;
  maxThreshold?: number;
  percentageCap?: number;
  bonusThreshold?: number;
  description: string;
}

interface FormulaConfigurationUIProps {
  onSave: (config: FormulaConfig) => void;
  onCancel: () => void;
  initialConfig?: FormulaConfig;
}

export default function FormulaConfigurationUI({
  onSave,
  onCancel,
  initialConfig,
}: FormulaConfigurationUIProps) {
  const [config, setConfig] = useState<FormulaConfig>({
    id: 0,
    name: "",
    formula: "",
    formulaType: "PERCENTAGE_RANGE",
    description: "",
  });

  const [testValues, setTestValues] = useState({
    numerator: 0,
    denominator: 0,
    maxRemuneration: 500,
  });

  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const formulaTypes = [
    {
      value: "PERCENTAGE_RANGE",
      label: "Percentage Range (e.g., upto 3%-5%)",
      description: "Linear progression within a percentage range",
    },
    {
      value: "RANGE",
      label: "Range Based (e.g., 5 above to 10)",
      description: "Proportional remuneration within a numeric range",
    },
    {
      value: "BINARY",
      label: "Binary (e.g., 100%)",
      description: "All-or-nothing remuneration",
    },
  ];

  const handleFormulaTypeChange = (formulaType: string) => {
    setConfig({ ...config, formulaType });

    // Set default values based on formula type
    switch (formulaType) {
      case "PERCENTAGE_RANGE":
        setConfig((prev) => ({
          ...prev,
          formulaType,
          minThreshold: 3,
          maxThreshold: 5,
        }));
        break;
      case "RANGE":
        setConfig((prev) => ({
          ...prev,
          formulaType,
          minThreshold: 5,
          maxThreshold: 10,
        }));
        break;
    }
  };

  const testFormula = () => {
    // This would call the actual formula calculator
    const achievement = (testValues.numerator / testValues.denominator) * 100;

    let result = {
      achievement: achievement.toFixed(1),
      remuneration: 0,
      status: "INELIGIBLE",
      message: "",
    };

    switch (config.formulaType) {
      case "PERCENTAGE_RANGE":
        if (achievement < (config.minThreshold || 3)) {
          result = {
            ...result,
            message: `Below minimum threshold of ${config.minThreshold}%`,
          };
        } else if (achievement >= (config.maxThreshold || 5)) {
          result = {
            ...result,
            remuneration: testValues.maxRemuneration,
            status: "FULL_ACHIEVEMENT",
            message: `At or above maximum threshold of ${config.maxThreshold}%`,
          };
        } else {
          const range = (config.maxThreshold || 5) - (config.minThreshold || 3);
          const achieved = achievement - (config.minThreshold || 3);
          const percentageWithinRange = (achieved / range) * 100;
          const linearPercentage = 60 + percentageWithinRange * 0.4;
          result = {
            ...result,
            achievement: linearPercentage.toFixed(1),
            remuneration: Math.round(
              (linearPercentage / 100) * testValues.maxRemuneration
            ),
            status: "PARTIAL_ACHIEVEMENT",
            message: `Within range ${config.minThreshold}-${config.maxThreshold}%`,
          };
        }
        break;



      case "BINARY":
        if (achievement >= 100) {
          result = {
            ...result,
            remuneration: testValues.maxRemuneration,
            status: "FULL_ACHIEVEMENT",
            message: "Achieved 100%",
          };
        } else {
          result = { ...result, message: "Below 100% threshold" };
        }
        break;
    }

    setTestResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Formula Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Total Footfall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula String
            </label>
            <input
              type="text"
              value={config.formula}
              onChange={(e) =>
                setConfig({ ...config, formula: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., upto 3%-5%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={config.description}
              onChange={(e) =>
                setConfig({ ...config, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the formula logic..."
            />
          </div>
        </div>

        {/* Formula Type Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula Type
            </label>
            <select
              value={config.formulaType}
              onChange={(e) => handleFormulaTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formulaTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Parameters */}
          {config.formulaType === "PERCENTAGE_RANGE" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Threshold (%)
                </label>
                <input
                  type="number"
                  value={config.minThreshold || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Threshold (%)
                </label>
                <input
                  type="number"
                  value={config.maxThreshold || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {config.formulaType === "RANGE" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Value
                </label>
                <input
                  type="number"
                  value={config.minThreshold || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Value
                </label>
                <input
                  type="number"
                  value={config.maxThreshold || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Test Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test Formula</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numerator
            </label>
            <input
              type="number"
              value={testValues.numerator}
              onChange={(e) =>
                setTestValues({
                  ...testValues,
                  numerator: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Denominator
            </label>
            <input
              type="number"
              value={testValues.denominator}
              onChange={(e) =>
                setTestValues({
                  ...testValues,
                  denominator: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Remuneration
            </label>
            <input
              type="number"
              value={testValues.maxRemuneration}
              onChange={(e) =>
                setTestValues({
                  ...testValues,
                  maxRemuneration: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={testFormula}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Test Formula
            </button>
          </div>
        </div>

        {testResult && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Achievement:</span>{" "}
                {testResult.achievement}%
              </div>
              <div>
                <span className="font-medium">Remuneration:</span> Rs.{" "}
                {testResult.remuneration}
              </div>
              <div>
                <span className="font-medium">Status:</span> {testResult.status}
              </div>
              <div>
                <span className="font-medium">Message:</span>{" "}
                {testResult.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(config)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save Formula
        </button>
      </div>
    </div>
  );
}
