"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { useGetPublicLocationsQuery } from "@/redux/features/shipping/shippingApi";
import { SearchableSelectOption } from "@/components/shared/SearchableSelect";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { FALLBACK_DISTRICTS, FALLBACK_DHAKA_UPAZILAS } from "@/constants/shippingLocations";
import { AddressItem } from "@/types/address";
import { validateAddressForm, AddressValidationErrors } from "@/utils/addressValidation";
import toast from "react-hot-toast";
import SavedAddressList from "./SavedAddressList";
import AddressForm from "./AddressForm";

export type { AddressItem };

interface CheckoutShippingAddressProps {
  addresses: AddressItem[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: (formData: any) => Promise<void>;
  onUpdateAddress?: (id: string, formData: any) => Promise<void>;
  onDeleteAddress?: (id: string) => Promise<void>;
  isCreatingAddress?: boolean;
  onFormDataChange?: (formData: any) => void;
  initialValues?: Partial<AddressItem>;
}

export const CheckoutShippingAddress: React.FC<CheckoutShippingAddressProps> = ({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  onUpdateAddress,
  onDeleteAddress,
  isCreatingAddress = false,
  onFormDataChange,
  initialValues,
}) => {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<AddressValidationErrors>({});

  const { data: locationsRes } = useGetPublicLocationsQuery(undefined);
  const districtsData: any[] = locationsRes?.data?.districts || [];
  const upazilasData: any[] = locationsRes?.data?.upazilas || [];

  const [form, setForm] = useState({
    fullName: initialValues?.fullName || "",
    phone: initialValues?.phone || "",
    email: initialValues?.email || "",
    address: initialValues?.address || "",
    division: initialValues?.division || "Dhaka",
    district: initialValues?.district || "Dhaka",
    upazila: initialValues?.upazila || "Gulshan",
    notes: initialValues?.notes || "",
  });

  useEffect(() => {
    if (addresses.length > 0 && !editingAddressId) {
      setShowForm(false);
    } else if (addresses.length === 0) {
      setShowForm(true);
    }
  }, [addresses.length, editingAddressId]);

  useEffect(() => {
    onFormDataChange?.(form);
  }, []);

  const districtsOptions: SearchableSelectOption[] = useMemo(() => {
    const source = districtsData.length > 0 ? districtsData : FALLBACK_DISTRICTS;
    return source.map((d: any) => ({
      value: d.name,
      label: d.name,
      bnLabel: d.bnName,
      subLabel: d.deliveryCharge ? `চার্জ: ৳${d.deliveryCharge}` : undefined,
    }));
  }, [districtsData]);

  const upazilasOptions: SearchableSelectOption[] = useMemo(() => {
    if (!form.district) return [];
    const filtered = upazilasData.filter(
      (u) => u.district?.toLowerCase() === form.district.toLowerCase()
    );
    if (filtered.length === 0 && form.district.toLowerCase() === "dhaka") {
      return FALLBACK_DHAKA_UPAZILAS;
    }
    return filtered.map((u: any) => ({
      value: u.name,
      label: u.name,
      bnLabel: u.bnName,
    }));
  }, [upazilasData, form.district]);

  const handleDistrictChange = (newDistrict: string) => {
    const matched = districtsData.find((d) => d.name?.toLowerCase() === newDistrict.toLowerCase());
    const related = upazilasData.filter((u) => u.district?.toLowerCase() === newDistrict.toLowerCase());
    const updated = {
      ...form,
      district: newDistrict,
      division: matched?.division || form.division,
      upazila: related[0]?.name || "",
    };
    setForm(updated);
    setErrors((prev) => ({ ...prev, district: undefined, upazila: undefined }));
    onFormDataChange?.(updated);
  };

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (errors[field as keyof AddressValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    onFormDataChange?.(updated);
  };

  const handleStartEdit = (e: React.MouseEvent, addr: AddressItem) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingAddressId(addr._id);
    setErrors({});
    const editForm = {
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      email: addr.email || "",
      address: addr.address || "",
      division: addr.division || "Dhaka",
      district: addr.district || "Dhaka",
      upazila: addr.upazila || "",
      notes: addr.notes || "",
    };
    setForm(editForm);
    onFormDataChange?.(editForm);
    setShowForm(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onDeleteAddress?.(deletingId);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAddressForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstErrorMessage =
        validation.errors.phone ||
        validation.errors.fullName ||
        validation.errors.address ||
        validation.errors.district ||
        validation.errors.upazila ||
        "দয়া করে সঠিক তথ্য পূরণ করুন।";
      toast.error(firstErrorMessage);
      return;
    }

    setErrors({});
    if (editingAddressId && onUpdateAddress) {
      await onUpdateAddress(editingAddressId, form);
    } else {
      await onAddNewAddress(form);
    }
    setEditingAddressId(null);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setEditingAddressId(null);
    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-[#121320] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MapPin size={18} className="text-[#003820] dark:text-[#95d4ac]" />
          <span>ডেলিভারী তথ্য</span>
        </h2>

        {addresses.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (showForm) handleCancelForm();
              else {
                setEditingAddressId(null);
                setErrors({});
                setShowForm(true);
              }
            }}
            className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            {showForm ? (
              <span>সংরক্ষিত ঠিকানা দেখুন</span>
            ) : (
              <>
                <Plus size={14} />
                <span>নতুন ঠিকানা যুক্ত করুন</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Form or Saved Address List */}
      {showForm || addresses.length === 0 ? (
        <AddressForm
          form={form}
          errors={errors}
          onChange={handleFieldChange}
          onDistrictChange={handleDistrictChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          districtsOptions={districtsOptions}
          upazilasOptions={upazilasOptions}
          isEditing={!!editingAddressId}
          isCreating={isCreatingAddress}
          hasSavedAddresses={addresses.length > 0}
        />
      ) : (
        <SavedAddressList
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={onSelectAddress}
          onStartEdit={handleStartEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="ঠিকানা মুছে ফেলুন"
        message="আপনি কি নিশ্চিতভাবে এই সংরক্ষিত ঠিকানাটি মুছে ফেলতে চান?"
      />
    </div>
  );
};

export default CheckoutShippingAddress;
