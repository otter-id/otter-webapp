"use client";

import { cn } from "@/utils/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

// Update the stepper component to ensure it fits within the container width
// Adjust the connector line to be more flexible and responsive

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors flex-shrink-0",
                index < currentStep
                  ? "bg-black border-black text-white"
                  : index === currentStep
                    ? "border-black text-black"
                    : "border-gray-300 text-gray-300"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "ml-2 text-xs font-medium hidden sm:inline-block",
                index === currentStep ? "text-black" : "text-gray-500"
              )}
            >
              {step}
            </span>

            {/* Connector line - only show between steps, not after the last step */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 mx-2 flex-grow",
                  index < currentStep ? "bg-black" : "bg-gray-300"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
