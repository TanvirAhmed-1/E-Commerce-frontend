"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface AddressItem {
  _id: string;
  fullName: string;
  phone: string;
  division?: string;
  district?: string;
  upazila?: string;
  address: string;
  isDefault?: boolean;
}

interface CheckoutShippingAddressProps {
  addresses: AddressItem[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: (formData: any) => Promise<void>;
  isCreatingAddress?: boolean;
}

export const CheckoutShippingAddress: React.FC<CheckoutShippingAddressProps> = ({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  isCreatingAddress = false,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Dhanmondi",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddNewAddress(form);
    setShowForm(false);
    setForm({ fullName: "", phone: "", division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi", address: "" });
  };

  const defaultMockAddress: AddressItem = {
    _id: "addr-default",
    fullName: "Tanvir Ahmed",
    phone: "01712 345678",
    address: "House # 120, Road # 5, Dhanmondi, Dhaka - 1209",
  };

  const displayAddresses = addresses.length > 0 ? addresses : [defaultMockAddress];

  return (
    <div className="bg-white dark:bg-[#121320] p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Shipping Address
        </h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Form modal/accordion if active */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#f2f3ff] dark:bg-[#09090e] rounded-xl flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-[#121320] text-slate-900 dark:text-white"
                placeholder="Receiver name"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-[#121320] text-slate-900 dark:text-white"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Delivery Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-[#121320] text-slate-900 dark:text-white"
              placeholder="House, Road, Area, City"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingAddress}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#003820] text-white hover:bg-[#0f5132]"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Address cards */}
      <div className="flex flex-col gap-2.5">
        {displayAddresses.map((addr) => {
          const isSelected = selectedAddressId === addr._id || displayAddresses.length === 1;

          return (
            <label
              key={addr._id}
              onClick={() => onSelectAddress(addr._id)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#f2f3ff] dark:bg-[#09090e] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac]"
                  : "bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="selected_address"
                checked={isSelected}
                onChange={() => onSelectAddress(addr._id)}
                className="accent-[#003820] mt-1 cursor-pointer"
              />
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{addr.fullName}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{addr.phone}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{addr.address}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutShippingAddress;
