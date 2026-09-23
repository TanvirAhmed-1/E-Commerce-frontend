"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AddressItem } from "@/types/address";

interface SavedAddressListProps {
  addresses: AddressItem[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onStartEdit: (e: React.MouseEvent, address: AddressItem) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const SavedAddressList: React.FC<SavedAddressListProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onStartEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {addresses.map((address) => {
        const isSelected =
          selectedAddressId === address._id || (addresses.length === 1 && !selectedAddressId);

        return (
          <div
            key={address._id}
            onClick={() => onSelectAddress(address._id)}
            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              isSelected
                ? "bg-[#f2f3ff] dark:bg-[#09090e] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac]"
                : "bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="selected_address"
              checked={isSelected}
              onChange={() => onSelectAddress(address._id)}
              className="accent-[#003820] mt-1 cursor-pointer shrink-0"
            />

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {address.fullName}
                  </span>
                  {address.isDefault && (
                    <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      ডিফল্ট
                    </span>
                  )}
                </div>

                {/* Edit and Delete Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => onStartEdit(e, address)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#003820] hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onDelete(e, address._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                মোবাইল: {address.phone}
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-300">
                {[address.address, address.upazila, address.district, address.division]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedAddressList;
