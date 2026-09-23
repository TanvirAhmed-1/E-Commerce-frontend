export interface AddressItem {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  division?: string;
  district?: string;
  upazila?: string;
  address: string;
  notes?: string;
  isDefault?: boolean;
}
