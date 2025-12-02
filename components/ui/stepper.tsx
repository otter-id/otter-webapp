"use client";

import { Check } from "lucide-react";
import { cn } from "@/utils/client";

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
          <div key={index} className="flex flex-1 items-center last:flex-none">
            {/* Step circle */}
            <div
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                index < currentStep
                  ? "border-black bg-black text-white"
                  : index === currentStep
                    ? "border-black text-black"
                    : "border-gray-300 text-gray-300",
              )}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : <span className="font-medium text-sm">{index + 1}</span>}
            </div>

            {/* Step label */}
            <span className={cn("ml-2 hidden font-medium text-xs sm:inline-block", index === currentStep ? "text-black" : "text-gray-500")}>
              {step}
            </span>

            {/* Connector line - only show between steps, not after the last step */}
            {index < steps.length - 1 && <div className={cn("mx-2 h-0.5 flex-grow", index < currentStep ? "bg-black" : "bg-gray-300")} />}
          </div>
        ))}
      </div>
    </div>
  );
}
