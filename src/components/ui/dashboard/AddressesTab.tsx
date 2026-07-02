"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2, Home, CheckCircle2, X } from "lucide-react";
import { 
  useGetMyAddressesQuery, 
  useCreateAddressMutation, 
  useDeleteAddressMutation 
} from "@/redux/features/address/addressApi";
import toast from "react-hot-toast";

export default function AddressesTab() {
  const { data: addressesRes, isLoading, refetch } = useGetMyAddressesQuery(undefined);
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    isDefault: false,
  });

  const addresses = addressesRes?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phone, division, district, upazila, address } = formData;

    if (!fullName || !phone || !division || !district || !upazila || !address) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      await createAddress(formData).unwrap();
      toast.success("Address added successfully!");
      refetch();
      setShowModal(false);
      setFormData({
        fullName: "",
        phone: "",
        division: "",
        district: "",
        upazila: "",
        address: "",
        isDefault: false,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete address");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800/80 rounded animate-pulse" />
          <div className="h-10 w-36 bg-gray-200 dark:bg-slate-800/80 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Trigger button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Saved Address Book
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
            Manage your retail shipping locations for swift checkout transactions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {/* Address Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-extrabold text-gray-900 dark:text-white text-base">No Saved Addresses</h3>
          <p className="text-xs text-gray-500 mt-1">You haven&apos;t added any shopping addresses yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 text-xs font-bold bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr: any) => (
            <div
              key={addr._id}
              className={`bg-white dark:bg-[#121320] border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition relative overflow-hidden group ${
                addr.isDefault
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-gray-200/80 dark:border-slate-800/60 hover:border-gray-300 dark:hover:border-slate-750"
              }`}
            >
              {/* Header card */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-[#09090e] border border-gray-200/80 dark:border-slate-800 flex items-center justify-center text-slate-500">
                    <Home size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{addr.fullName}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{addr.phone}</p>
                  </div>
                </div>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded">
                    <CheckCircle2 size={10} /> Default
                  </span>
                )}
              </div>

              {/* Address detail body */}
              <div className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-slate-800/60 pt-4 mt-4">
                <p>{addr.address}</p>
                <p className="mt-1">
                  {addr.upazila}, {addr.district}
                </p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-slate-300">{addr.division}</p>
              </div>

              {/* Action items */}
              <div className="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-slate-800/60">
                <button
                  onClick={() => handleDelete(addr._id)}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer"
                  title="Delete Address"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121320] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-scale-up">
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Add Delivery Location</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-left">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">Division</label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    placeholder="e.g. Dhaka"
                    className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Dhaka"
                    className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">Upazila</label>
                  <input
                    type="text"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    placeholder="e.g. Uttara"
                    className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">Street Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g. House 12, Road 4, Sector 11"
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 dark:border-slate-800 text-primary focus:ring-primary w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-xs font-bold text-gray-700 dark:text-slate-300 select-none cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? "Saving..." : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
