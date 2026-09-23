export const BD_PHONE_REGEX = /^(?:\+?88|88)?01[3-9]\d{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AddressFormState {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  division?: string;
  district: string;
  upazila: string;
  notes?: string;
}

export interface AddressValidationErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  district?: string;
  upazila?: string;
}

export const validateAddressForm = (
  form: AddressFormState
): { isValid: boolean; errors: AddressValidationErrors } => {
  const errors: AddressValidationErrors = {};

  const cleanFullName = form.fullName?.trim() || "";
  if (!cleanFullName) {
    errors.fullName = "দয়া করে আপনার নাম লিখুন।";
  } else if (cleanFullName.length < 2) {
    errors.fullName = "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
  }

  const cleanPhone = form.phone?.replace(/[\s-]/g, "").trim() || "";
  if (!cleanPhone) {
    errors.phone = "মোবাইল নম্বর আবশ্যক।";
  } else if (!BD_PHONE_REGEX.test(cleanPhone)) {
    errors.phone = "সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।";
  }

  if (form.email && form.email.trim() !== "") {
    if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "সঠিক ইমেইল ঠিকানা দিন।";
    }
  }

  const cleanAddress = form.address?.trim() || "";
  if (!cleanAddress) {
    errors.address = "দয়া করে বিস্তারিত ঠিকানা লিখুন।";
  } else if (cleanAddress.length < 3) {
    errors.address = "ঠিকানা কমপক্ষে ৩ অক্ষরের হতে হবে।";
  }

  if (!form.district || form.district.trim() === "") {
    errors.district = "দয়া করে জেলা সিলেক্ট করুন।";
  }

  if (!form.upazila || form.upazila.trim() === "") {
    errors.upazila = "দয়া করে উপজেলা/এরিয়া সিলেক্ট করুন।";
  }

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
};
