"use client";

import React from "react";

export const ProductWarrantyTab: React.FC = () => {
  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
          Nationwide Warranty Claim Procedure
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Every Prestige product purchased via GhorBazar includes an official manufacturer warranty card and registered digital serial invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dhaka Hub */}
        <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-5 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800">
          <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac]">
              location_city
            </span>
            <span>Dhaka Service Center</span>
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            House 42, Road 11, Banani, Dhaka 1213.<br />
            Hotline: 09612-GHORBZ (Ext 2)<br />
            Hours: Saturday - Thursday (10:00 AM - 7:00 PM)
          </p>
        </div>

        {/* Chittagong Hub */}
        <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-5 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800">
          <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac]">
              location_city
            </span>
            <span>Chittagong Hub</span>
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Agrabad Commercial Area, GEC Circle, Chattogram.<br />
            Hotline: 09612-GHORBZ (Ext 3)<br />
            Hours: Saturday - Thursday (10:00 AM - 6:30 PM)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductWarrantyTab;
