"use client";

import React from "react";

interface ProductDescriptionTabProps {
  customDescriptionHtml?: string;
  shortDescription?: string;
}

export const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({
  customDescriptionHtml,
  shortDescription,
}) => {
  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for Authentic Bangladeshi Home Cooking
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The Prestige Deluxe Duo-Pot Electric Rice Cooker & Steamer (2.8L) is built to handle everyday culinary demands with immaculate precision. Whether you are boiling long-grain aromatic Chinigura, Miniket, or royal Basmati rice for family dinners, or preparing flavorful Bengali Khichuri and Dum Biryani, this high-wattage cooker ensures uniformly cooked, fluffy grains every single batch.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-5 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-lg bg-[#003820] text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Simultaneous Dual-Deck Steaming
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Take advantage of the included food-grade steamer basket. Steam healthy dumplings, momos, vegetables, eggs, or fresh river fish simultaneously while your staple rice or lentil soup gently cooks below.
          </p>
        </div>

        <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-5 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-lg bg-[#003820] text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Two Specialized Inner Pots Included
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Equipped with both a heavy-gauge Hard Anodized Aluminum inner pot for stews and firm rice, plus a multi-layer Teflon non-stick coated pot ideal for delicate pulao and easy hand-wash cleans.
          </p>
        </div>
      </div>

      {/* Safety Circuitry */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Advanced Triple Safety Circuitry
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Engineered specifically with voltage fluctuation safeguards tailored for local power conditions. Features an automatic thermal cut-off fuse that halts power if temperatures exceed optimal limits, alongside heavy-duty insulated power wiring and a vapor relief valve on the tempered glass lid.
        </p>
      </div>

      {/* Dynamic Content if provided from API */}
      {customDescriptionHtml && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
            Additional Product Details
          </h4>
          <div
            className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: customDescriptionHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionTab;
