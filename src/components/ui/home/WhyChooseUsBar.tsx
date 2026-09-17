"use client";

import React from "react";

export const WhyChooseUsBar: React.FC = () => {
  const pillars = [
    {
      icon: "verified",
      title: "Premium Quality",
      description: "Trusted Brands & Authenticity",
    },
    {
      icon: "local_shipping",
      title: "Fast Delivery",
      description: "Prompt dispatch across 64 districts",
    },
    {
      icon: "security",
      title: "Secure Payment",
      description: "bKash, Nagad, Cards & COD",
    },
    {
      icon: "support_agent",
      title: "24/7 Support",
      description: "Dedicated assistance anytime",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-[#121320] p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsBar;
