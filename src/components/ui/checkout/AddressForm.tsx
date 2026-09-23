"use client";

import React from "react";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";
import SearchableSelect, { SearchableSelectOption } from "@/components/shared/SearchableSelect";
import { Button } from "@/components/ui/button";
import { AddressValidationErrors } from "@/utils/addressValidation";

interface AddressFormProps {
  form: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    division: string;
    district: string;
    upazila: string;
    notes: string;
  };
  errors?: AddressValidationErrors;
  onChange: (field: string, value: string) => void;
  onDistrictChange: (district: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  districtsOptions: SearchableSelectOption[];
  upazilasOptions: SearchableSelectOption[];
  isEditing: boolean;
  isCreating: boolean;
  hasSavedAddresses: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  form,
  errors = {},
  onChange,
  onDistrictChange,
  onSubmit,
  onCancel,
  districtsOptions,
  upazilasOptions,
  isEditing,
  isCreating,
  hasSavedAddresses,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="নাম"
          required
          placeholder="আপনার পুরো নাম"
          value={form.fullName}
          error={errors.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        <Input
          label="মোবাইল নম্বর"
          type="tel"
          required
          placeholder="01XXXXXXXXX"
          value={form.phone}
          error={errors.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>

      <Input
        label="ইমেইল (ঐচ্ছিক)"
        type="email"
        placeholder="আপনার ইমেইল"
        value={form.email}
        error={errors.email}
        onChange={(e) => onChange("email", e.target.value)}
      />

      <Input
        label="ঠিকানা"
        required
        placeholder="বাসা/রোড/এলাকার ঠিকানা"
        value={form.address}
        error={errors.address}
        onChange={(e) => onChange("address", e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <SearchableSelect
            label="জেলা"
            required
            placeholder="জেলা সিলেক্ট করুন"
            searchPlaceholder="জেলা খুঁজুন..."
            options={districtsOptions}
            value={form.district}
            onChange={onDistrictChange}
          />
          {errors.district && (
            <p className="text-[11px] text-red-500 font-medium">{errors.district}</p>
          )}
        </div>

        <div className="space-y-1">
          <SearchableSelect
            label="উপজেলা/এরিয়া"
            required
            placeholder="উপজেলা সিলেক্ট করুন"
            searchPlaceholder="উপজেলা খুঁজুন..."
            options={upazilasOptions}
            value={form.upazila}
            onChange={(val) => onChange("upazila", val)}
            disabled={!form.district}
          />
          {errors.upazila && (
            <p className="text-[11px] text-red-500 font-medium">{errors.upazila}</p>
          )}
        </div>
      </div>

      <Textarea
        label="নোট (ঐচ্ছিক)"
        rows={2}
        placeholder="অর্ডার সম্পর্কিত বিশেষ নোট লিখুন..."
        value={form.notes}
        onChange={(e) => onChange("notes", e.target.value)}
      />

      {hasSavedAddresses && (
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 text-xs font-semibold rounded-xl cursor-pointer"
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="h-10 px-6 text-xs font-bold bg-[#003820] hover:bg-[#0f5132] text-white rounded-xl cursor-pointer"
          >
            {isCreating
              ? "সংরক্ষণ হচ্ছে..."
              : isEditing
              ? "ঠিকানা আপডেট করুন"
              : "ঠিকানা সংরক্ষণ করুন"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default AddressForm;
