"use client";
import { BookmarkCheck, Check, Clock, Package, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/client";

interface OrderStepperProps {
  orderStatus?: string;
  paymentStatus?: string;
  className?: string;
}

export default function OrderStepper({ orderStatus = "ONGOING", paymentStatus = "PAID", className }: OrderStepperProps) {
  const steps = [
    {
      id: 1,
      name: "Order Confirmed",
      icon: ShoppingBag,
    },
    {
      id: 2,
      name: "In Progress",
      icon: Clock,
    },
    {
      id: 3,
      name: "Ready for Pick Up",
      icon: Package,
    },
    {
      id: 4,
      name: "Order Finished",
      icon: BookmarkCheck,
    },
  ];

  // Determine the current step based on orderStatus and paymentStatus
  const getCurrentStep = () => {
    // If order is unpaid, only show the first step
    if (paymentStatus === "UNPAID") {
      return 1;
    }

    // If order is paid, show at least the second step
    if (paymentStatus === "PAID" && orderStatus === "ONGOING") {
      return 2;
    }

    // Map order status to step number
    switch (orderStatus) {
      case "ONGOING":
        return 2;
      case "READY":
        return 3;
      case "FINISHED":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4 py-6", className)}>
      <div className="relative flex justify-between w-full">
        {/* Connector line - single line across all steps */}
        <div className="absolute top-5 left-10 right-10 h-[2px] z-0">
          <div
            className="absolute left-0 right-0 h-full"
            style={{
              background: "repeating-linear-gradient(to right, #D1D5DB 0, #D1D5DB 5px, transparent 5px, transparent 8px)",
            }}
          />
          {/* Completed line */}
          <div
            className="absolute left-0 h-full"
            style={{
              background: "#F2C94C",
              width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step circles and labels */}
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center z-10">
            {/* Step circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                currentStep >= step.id ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500",
              )}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>

            {/* Step label */}
            <span className={cn("mt-3 text-sm font-medium text-center max-w-[80px]", currentStep >= step.id ? "text-gray-900" : "text-gray-500")}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
