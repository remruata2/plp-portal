"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Target, TrendingUp, Info } from "lucide-react";

        interface CalculationDetailsModalProps {
          indicator: {
            id: number;
            name: string;
            target: string;
            actual: number;
            percentage: number;
            status: "achieved" | "partial" | "not_achieved";
            incentive_amount: number;
            indicator_code?: string;
            target_type?: string;
            target_description?: string;
            target_value_for_calculation?: number;
            // Calculation details
            numerator_value?: number;
            denominator_value?: number;
            formula_config?: any;
            calculation_result?: any;
            max_remuneration?: number;
            raw_percentage?: number; // Raw percentage before remuneration logic
            // Field information
            numerator_field?: {
              id: number;
              code: string;
              name: string;
            } | null;
            denominator_field?: {
              id: number;
              code: string;
              name: string;
            } | null;
            target_field?: {
              id: number;
              code: string;
              name: string;
            } | null;
          };
          facilityType: string;
        }

export function CalculationDetailsModal({ indicator, facilityType }: CalculationDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getFormulaDisplay = () => {
    const targetType = indicator.target_type;
    const actual = indicator.actual;
    const targetValue = indicator.target_value_for_calculation || 0;
    const percentage = indicator.raw_percentage || indicator.percentage || 0;
    const numeratorValue = indicator.numerator_value || actual;
    const denominatorValue = indicator.denominator_value || 1;
    const formulaConfig = indicator.formula_config || {};
    const calculationResult = indicator.calculation_result;

    // Get actual field names
    const numeratorFieldName = indicator.numerator_field?.name || "Numerator";
    const denominatorFieldName = indicator.denominator_field?.name || "Denominator";
    const targetFieldName = indicator.target_field?.name || "Target";

    // Get the actual formula from config or use default
    const formula = formulaConfig.calculationFormula || "(A/B)*100";
    const formulaDisplay = formula
      .replace(/A/g, numeratorFieldName)
      .replace(/B/g, denominatorFieldName)
      .replace(/\*/g, "×")
      .replace(/\//g, "÷");

    // Create a proper calculation display that shows the actual formula being used
    const getCalculationDisplay = () => {
      if (formula === "(A/(B/12))*100") {
        // Check if the denominator value is already divided by 12 (likely old data)
        // If denominator is very small (< 100), it's probably already divided
        const isLikelyDivided = denominatorValue < 100;
        
        if (isLikelyDivided) {
          // Old data: denominator is already B/12, so calculation is A/B*100
          return `${numeratorValue} ÷ ${denominatorValue} × 100 = ${percentage.toFixed(1)}%`;
        } else {
          // New data: denominator is raw B, so calculation is A/(B/12)*100
          return `${numeratorValue} ÷ (${denominatorValue} ÷ 12) × 100 = ${percentage.toFixed(1)}%`;
        }
      } else if (formula === "(A/(B/60))*100") {
        // Check if the denominator value is already divided by 60
        const isLikelyDivided = denominatorValue < 100;
        
        if (isLikelyDivided) {
          // Old data: denominator is already B/60, so calculation is A/B*100
          return `${numeratorValue} ÷ ${denominatorValue} × 100 = ${percentage.toFixed(1)}%`;
        } else {
          // New data: denominator is raw B, so calculation is A/(B/60)*100
          return `${numeratorValue} ÷ (${denominatorValue} ÷ 60) × 100 = ${percentage.toFixed(1)}%`;
        }
      } else {
        return `${numeratorValue} ÷ ${denominatorValue} × 100 = ${percentage.toFixed(1)}%`;
      }
    };

    switch (targetType) {
      case "PERCENTAGE_RANGE":
        return {
          formula: formulaDisplay,
          explanation: formulaConfig.description || "Percentage calculation based on numerator and denominator",
          values: {
            [`${numeratorFieldName} (A)`]: `${numeratorValue}`,
            [`${denominatorFieldName} (B)`]: `${denominatorValue}`,
            "Formula": `${formula}`,
            "Calculation": getCalculationDisplay(),
            "Target Range": indicator.target_description || "Standard range",
            "Formula Description": formulaConfig.description || "Standard percentage calculation"
          }
        };
      
      case "RANGE":
        return {
          formula: "Linear progression within range",
          explanation: "Achievement scales linearly from minimum to maximum target",
          values: {
            "Actual Value": `${actual}`,
            "Target Range": indicator.target_description || "Standard range",
            "Formula": `${formula}`,
            "Calculation": getCalculationDisplay(),
            "Achievement": `${percentage.toFixed(1)}%`
          }
        };
      
      case "BINARY":
        return {
          formula: "All-or-nothing achievement",
          explanation: "100% achievement required for full incentive",
          values: {
            "Required": "100% achievement",
            "Actual": `${percentage.toFixed(1)}%`,
            "Formula": `${formula}`,
            "Calculation": getCalculationDisplay(),
            "Result": percentage >= 100 ? "Target achieved" : "Target not achieved"
          }
        };
      

      
      default:
        return {
          formula: formulaDisplay,
          explanation: "Basic percentage-based achievement",
          values: {
            [`${numeratorFieldName} (A)`]: `${numeratorValue}`,
            [`${denominatorFieldName} (B)`]: `${denominatorValue}`,
            "Formula": `${formula}`,
            "Calculation": getCalculationDisplay(),
            "Target": indicator.target_description || "Standard target"
          }
        };
    }
  };

  const getIncentiveCalculation = () => {
    const percentage = indicator.raw_percentage || indicator.percentage || 0;
    const maxIncentive = indicator.max_remuneration || indicator.incentive_amount;
    const actualIncentive = indicator.incentive_amount;
    const calculationResult = indicator.calculation_result;
    
    if (indicator.status === "achieved") {
      return {
        type: "Full achievement",
        calculation: `100% of maximum incentive`,
        maxAmount: `₹${maxIncentive.toLocaleString()}`,
        actualAmount: `₹${actualIncentive.toLocaleString()}`,
        message: calculationResult?.message || "Target fully achieved"
      };
    } else if (indicator.status === "partial") {
      return {
        type: "Partial achievement", 
        calculation: `${percentage.toFixed(1)}% of maximum incentive`,
        maxAmount: `₹${maxIncentive.toLocaleString()}`,
        actualAmount: `₹${actualIncentive.toLocaleString()}`,
        message: calculationResult?.message || "Partial achievement"
      };
    } else {
      return {
        type: "No achievement",
        calculation: "Below minimum threshold",
        maxAmount: `₹${maxIncentive.toLocaleString()}`,
        actualAmount: "₹0",
        message: calculationResult?.message || "Target not achieved"
      };
    }
  };

  const formulaInfo = getFormulaDisplay();
  const incentiveInfo = getIncentiveCalculation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs"
          onClick={() => setIsOpen(true)}
        >
          <Calculator className="h-3 w-3" />
          Calculation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Calculation Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Indicator Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{indicator.name}</h3>
              <Badge variant="secondary" className="font-mono">
                {indicator.indicator_code}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Target:</span>
                <span className="ml-2 font-medium">{indicator.target}</span>
              </div>
              <div>
                <span className="text-gray-600">Actual:</span>
                <span className="ml-2 font-medium">{indicator.actual}</span>
              </div>
              <div>
                <span className="text-gray-600">Achievement:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {indicator.percentage?.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge 
                  variant={indicator.status === "achieved" ? "default" : 
                          indicator.status === "partial" ? "secondary" : "destructive"}
                  className="ml-2"
                >
                  {indicator.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Formula Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Calculation Formula
            </h4>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="font-mono text-lg text-green-800 mb-2">
                {formulaInfo.formula}
              </div>
              <p className="text-sm text-green-700">{formulaInfo.explanation}</p>
            </div>
            
            {/* Stored Formula Configuration */}
            {indicator.formula_config && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">Stored Formula Configuration:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-medium">Formula:</span>
                    <span className="font-mono text-blue-800">{indicator.formula_config.calculationFormula || "(A/B)*100"}</span>
                  </div>
                  {indicator.formula_config.description && (
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-medium">Description:</span>
                      <span className="text-blue-800">{indicator.formula_config.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
                      {/* Values Breakdown */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Values Used:</h5>
            <div className="space-y-2 text-sm">
              {Object.entries(formulaInfo.values).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-blue-700 font-medium">{key}:</span>
                  <span className="text-blue-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Calculation */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Step-by-Step Calculation:</h5>
            <div className="space-y-2 text-sm text-yellow-800">
              <div className="font-mono bg-white p-2 rounded border">
                <div>1. Input Values:</div>
                <div className="ml-4">{indicator.numerator_field?.name || "Numerator"} (A) = {indicator.numerator_value || indicator.actual}</div>
                <div className="ml-4">{indicator.denominator_field?.name || "Denominator"} (B) = {indicator.denominator_value || 1}</div>
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <div>2. Apply Formula:</div>
                <div className="ml-4">{indicator.formula_config?.calculationFormula || "(A/B)*100"}</div>
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <div>3. Calculate:</div>
                <div className="ml-4">
                  {(() => {
                    const formula = indicator.formula_config?.calculationFormula || "(A/B)*100";
                    const numerator = indicator.numerator_value || indicator.actual;
                    const denominator = indicator.denominator_value || 1;
                    
                    if (formula === "(A/(B/12))*100") {
                      // Check if denominator is already divided (old data)
                      const isLikelyDivided = denominator < 100;
                      
                      if (isLikelyDivided) {
                        // Old data: denominator is already B/12
                        return `${numerator} ÷ ${denominator} × 100 = ${indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%`;
                      } else {
                        // New data: denominator is raw B
                        return `${numerator} ÷ (${denominator} ÷ 12) × 100 = ${indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%`;
                      }
                    } else if (formula === "(A/(B/60))*100") {
                      // Check if denominator is already divided (old data)
                      const isLikelyDivided = denominator < 100;
                      
                      if (isLikelyDivided) {
                        // Old data: denominator is already B/60
                        return `${numerator} ÷ ${denominator} × 100 = ${indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%`;
                      } else {
                        // New data: denominator is raw B
                        return `${numerator} ÷ (${denominator} ÷ 60) × 100 = ${indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%`;
                      }
                    } else {
                      return `${numerator} ÷ ${denominator} × 100 = ${indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%`;
                    }
                  })()}
                </div>
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <div>4. Result:</div>
                <div className="ml-4">Raw Achievement: {indicator.raw_percentage?.toFixed(2) || indicator.percentage?.toFixed(1)}%</div>
                <div className="ml-4">Final Status: {indicator.status}</div>
              </div>
            </div>
            
            {/* Data Consistency Note */}
            {(() => {
              const formula = indicator.formula_config?.calculationFormula || "(A/B)*100";
              const denominator = indicator.denominator_value || 1;
              
              if ((formula === "(A/(B/12))*100" || formula === "(A/(B/60))*100") && denominator < 100) {
                return (
                  <div className="mt-3 p-2 bg-orange-100 border border-orange-300 rounded text-xs text-orange-800">
                    <strong>Note:</strong> This calculation uses pre-divided population data (likely from previous system version). 
                    The system automatically detects and handles this data format to ensure accurate calculations.
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

          {/* Incentive Calculation */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Incentive Calculation
            </h4>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-700 font-medium">Type:</span>
                  <div className="text-purple-800">{incentiveInfo.type}</div>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Calculation:</span>
                  <div className="text-purple-800">{incentiveInfo.calculation}</div>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Max Incentive:</span>
                  <div className="text-purple-800">{incentiveInfo.maxAmount}</div>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Actual Amount:</span>
                  <div className="text-purple-800 font-semibold">{incentiveInfo.actualAmount}</div>
                </div>
              </div>
              {incentiveInfo.message && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <span className="text-purple-700 font-medium">Note:</span>
                  <div className="text-purple-800 text-sm mt-1">{incentiveInfo.message}</div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">How this affects your facility:</p>
                <p>
                  This indicator contributes to your overall facility performance score, 
                  which determines the distribution of incentives across your health workers. 
                  Higher achievement percentages result in better incentive distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
