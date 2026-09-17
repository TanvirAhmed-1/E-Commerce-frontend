"use client";

import React from "react";

export const ProductDeliveryWarrantyCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#121320] p-4 md:p-6 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Delivery Assurance Details */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac]">
              local_shipping
            </span>
            <span>Delivery across Bangladesh</span>
          </div>

          <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center justify-between bg-[#f2f3ff] dark:bg-[#09090e] p-2.5 rounded-lg">
              <span className="font-medium text-slate-800 dark:text-slate-300">
                Inside Dhaka Metropolitan:
              </span>
              <strong className="text-[#003820] dark:text-[#95d4ac] font-bold">
                24-48 Hours (৳ 60)
              </strong>
            </li>
            <li className="flex items-center justify-between bg-[#f2f3ff] dark:bg-[#09090e] p-2.5 rounded-lg">
              <span className="font-medium text-slate-800 dark:text-slate-300">
                Outside Dhaka (All 64 Districts):
              </span>
              <strong className="text-[#003820] dark:text-[#95d4ac] font-bold">
                3-5 Days (৳ 120)
              </strong>
            </li>
            <li className="flex items-center gap-1.5 text-[#003820] dark:text-[#95d4ac] font-bold text-xs pt-0.5">
              <span className="material-symbols-outlined text-[17px]">check_circle</span>
              <span>Cash on Delivery Available (Pay when you inspect)</span>
            </li>
          </ul>
        </div>

        {/* Official Warranty & Policy Assurance */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac]">
              verified
            </span>
            <span>Prestige Brand Warranty</span>
          </div>

          <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac] text-[18px] shrink-0 mt-0.5">
                workspace_premium
              </span>
              <span className="text-slate-800 dark:text-slate-300">
                <strong>1 Year 100% Replacement Warranty</strong> on heating element & electrical switchboard.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac] text-[18px] shrink-0 mt-0.5">
                build_circle
              </span>
              <span className="text-slate-800 dark:text-slate-300">
                <strong>2 Years Free Service Warranty</strong> at any certified GhorBazar service center.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac] text-[18px] shrink-0 mt-0.5">
                replay
              </span>
              <span className="text-slate-800 dark:text-slate-300">
                <strong>7 Days Easy Return</strong> if defective or damaged upon unboxing.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accepted Payment Methods Badges */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Accepted Payments:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2 py-1 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200">
              bKash
            </span>
            <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2 py-1 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Nagad
            </span>
            <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2 py-1 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Rocket
            </span>
            <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2 py-1 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Visa
            </span>
            <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2 py-1 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Mastercard
            </span>
            <span className="bg-[#003820] text-white px-2 py-1 rounded text-[11px] font-bold">
              Cash On Delivery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#003820] dark:text-[#95d4ac] font-semibold">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDeliveryWarrantyCard;
