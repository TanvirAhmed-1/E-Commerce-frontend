"use client";

import React from "react";

interface CheckoutStepsProps {
  currentStep: number;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Complete" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 py-4">
      {steps.map((step, idx) => {
        const isCompleted = step.num < currentStep;
        const isCurrent = step.num === currentStep;

        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  isCurrent || isCompleted
                    ? "bg-[#003820] text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <span className="material-symbols-outlined text-[14px]">check</span> : step.num}
              </div>
              <span
                className={`text-xs font-bold ${
                  isCurrent ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className="w-8 sm:w-16 h-[2px] bg-slate-200 dark:bg-slate-800" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
