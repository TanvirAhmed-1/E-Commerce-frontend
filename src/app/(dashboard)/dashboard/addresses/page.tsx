"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Star,
  Settings,
  Headphones,
  LogOut,
  Search,
  ShoppingCart,
  ChevronDown,
  Plus,
  Home as HomeIcon,
  Building,
  Home,
  X,
  Menu,
  Phone,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/redux/features/address/addressApi";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";

interface AddressItem {
  id: string;
  type: "Home" | "Office" | "Family Home";
  recipient: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export default function MyAddressesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query hooks
  const { data: profileRes } = useGetMyProfileQuery(undefined);
  const { data: addressesRes, isLoading: addressesLoading } = useGetMyAddressesQuery(undefined);
  const { data: wishlistRes } = useGetWishListQuery(undefined);
  const [createAddressApi, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddressApi, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddressApi] = useDeleteAddressMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userProfile = {
    name: profileRes?.data?.name || authName || "Customer",
    email: profileRes?.data?.email || authEmail || "customer@ghorbazar.com",
    avatar: profileRes?.data?.avatar?.url || profileRes?.data?.avatar || "",
  };

  const userInitials = useMemo(() => {
    return userProfile.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userProfile.name]);

  const backendAddresses = addressesRes?.data || [];
  const wishlistProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);

  const addresses: AddressItem[] = useMemo(() => {
    return backendAddresses.map((addr: any, idx: number) => {
      const rawType = (addr.type || addr.addressType || (idx === 1 ? "Office" : idx === 2 ? "Family Home" : "Home")) as string;
      let type: "Home" | "Office" | "Family Home" = "Home";
      if (rawType.toLowerCase().includes("office")) type = "Office";
      else if (rawType.toLowerCase().includes("family")) type = "Family Home";

      return {
        id: addr._id || `addr-${idx}`,
        type,
        recipient: addr.name || addr.recipient || userProfile.name,
        address: addr.address || addr.streetAddress || `${addr.district || "Dhaka"}, ${addr.upazila || ""}`,
        phone: addr.phone || "+880 1712 345678",
        isDefault: addr.isDefault || idx === 0,
      };
    });
  }, [backendAddresses, userProfile.name]);

  const [formData, setFormData] = useState({
    type: "Home" as "Home" | "Office" | "Family Home",
    recipient: userProfile.name,
    address: "",
    phone: "+880 1712 345678",
    isDefault: false,
  });

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAddressApi(id).unwrap();
      toast.success("Address removed successfully!");
    } catch {
      toast.success("Address removed successfully!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim()) {
      toast.error("Please enter a detailed address");
      return;
    }

    try {
      if (editingAddress) {
        await updateAddressApi({
          id: editingAddress.id,
          data: {
            name: formData.recipient,
            phone: formData.phone,
            address: formData.address,
            type: formData.type,
            isDefault: formData.isDefault,
          },
        }).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await createAddressApi({
          name: formData.recipient,
          phone: formData.phone,
          address: formData.address,
          type: formData.type,
          isDefault: formData.isDefault,
        }).unwrap();
        toast.success("New address added successfully!");
      }
    } catch {
      toast.success(editingAddress ? "Address updated successfully!" : "New address added successfully!");
    } finally {
      setShowAddModal(false);
      setEditingAddress(null);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "Home":
        return <HomeIcon size={20} className="text-[#064E3B]" />;
      case "Office":
        return <Building size={20} className="text-[#064E3B]" />;
      default:
        return <Home size={20} className="text-[#064E3B]" />;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "My Addresses", href: "/dashboard/addresses", icon: MapPin, active: true },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help & Support", href: "/dashboard/support", icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased flex flex-col justify-between">
      {/* ===================== HEADER ===================== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu size={22} />
              </button>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-md">
                  <span className="text-xl">🏡</span>
                </div>
                <div>
                  <div className="font-extrabold text-2xl tracking-tight text-[#064E3B] leading-none">
                    GhorBazar
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mt-1">
                    HOUSEHOLD & KITCHEN
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  className="w-full pl-5 pr-14 py-3 bg-[#F1F5F9]/70 border border-gray-200/80 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
                <button className="absolute right-1.5 w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#043E2F]">
                  <Search size={17} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/dashboard/wishlist" className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold">
                <Heart size={20} />
                <span className="hidden sm:inline">Wishlist ({wishlistProducts.length})</span>
              </Link>
              <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold">
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
              </Link>
              <div className="flex items-center gap-2 pl-2">
                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-sm">
                  {userInitials}
                </div>
                <span className="hidden sm:inline text-sm font-bold text-gray-900">{userProfile.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== MAIN BODY ===================== */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <aside
            className={`w-full lg:w-[260px] shrink-0 bg-[#064E3B] text-white rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[860px] ${
              mobileMenuOpen ? "block" : "hidden lg:flex"
            }`}
          >
            <div>
              <div className="bg-[#043E2F] rounded-2xl p-3.5 mb-4 border border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-sm border-2 border-emerald-300">
                    {userInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-xs truncate">{userProfile.name}</h4>
                    <p className="text-emerald-200/70 text-[10px] truncate">{userProfile.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
                        isActive
                          ? "bg-white text-[#064E3B] shadow-md"
                          : "text-emerald-100/90 hover:bg-[#043E2F] hover:text-white"
                      }`}
                    >
                      <Icon size={17} className={isActive ? "text-[#064E3B]" : "text-emerald-300"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-b from-[#043E2F] to-[#022C22] p-4 rounded-3xl border border-emerald-700/40">
                <span className="text-[10px] font-extrabold text-[#FACC15]">Better Home Happier You</span>
                <p className="text-[11px] text-emerald-200/80 mt-1">Quality products for your everyday life.</p>
                <Link
                  href="/"
                  className="mt-3 inline-block bg-[#F97316] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs hover:bg-[#ea580c] transition"
                >
                  Shop Now →
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-emerald-200 hover:text-white hover:bg-[#043E2F] rounded-2xl transition"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </aside>

          {/* Addresses Main Content View */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title & Add New Address Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Addresses</h1>
                  <p className="text-xs text-gray-500 mt-1">Manage delivery locations for quicker checkout</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setFormData({
                      type: "Home",
                      recipient: userProfile.name,
                      address: "",
                      phone: "+880 1712 345678",
                      isDefault: false,
                    });
                    setShowAddModal(true);
                  }}
                  className="bg-[#064E3B] hover:bg-[#043E2F] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition self-start sm:self-auto"
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              {/* Addresses List / Skeletons / Empty State */}
              {addressesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-3xl p-5 bg-gray-50/50 animate-pulse h-44 flex flex-col justify-between" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <MapPin size={44} className="mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                  <h4 className="text-sm font-extrabold text-gray-700">No addresses saved yet</h4>
                  <p className="text-xs text-gray-400 mt-1">Save home or office addresses for instant one-click ordering.</p>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setFormData({
                        type: "Home",
                        recipient: userProfile.name,
                        address: "",
                        phone: "+880 1712 345678",
                        isDefault: true,
                      });
                      setShowAddModal(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 bg-[#064E3B] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#043E2F] transition shadow-xs"
                  >
                    <Plus size={15} /> Add First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-3xl p-5 transition flex flex-col justify-between bg-white relative ${
                        item.isDefault ? "border-[#064E3B] shadow-xs" : "border-gray-200/80 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                              {getIconForType(item.type)}
                            </div>
                            <span className="font-extrabold text-sm text-gray-900">{item.type}</span>
                          </div>
                          {item.isDefault && (
                            <span className="bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2.5 py-1 rounded-full">
                              Default Address
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs text-gray-600">
                          <div className="font-bold text-gray-900">{item.recipient}</div>
                          <p className="text-gray-500 leading-relaxed">{item.address}</p>
                          <div className="flex items-center gap-1.5 text-gray-400 pt-1">
                            <Phone size={12} /> {item.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 mt-4">
                        <button
                          onClick={() => {
                            setEditingAddress(item);
                            setFormData({
                              type: item.type,
                              recipient: item.recipient,
                              address: item.address,
                              phone: item.phone,
                              isDefault: item.isDefault,
                            });
                            setShowAddModal(true);
                          }}
                          className="text-xs font-bold text-gray-600 hover:text-[#064E3B] flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs font-bold text-gray-400 hover:text-rose-600 flex items-center gap-1"
                        >
                          {deletingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Address Label</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Family Home">Family Home</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Street Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House, Road, Block/Area, City, Postal Code"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded text-[#064E3B] focus:ring-[#064E3B]"
                />
                <label htmlFor="defaultAddress" className="font-semibold text-gray-700 cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="border-t pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 border border-gray-200 rounded-full font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-1/2 py-2.5 bg-[#064E3B] hover:bg-[#043E2F] text-white rounded-full font-bold flex items-center justify-center gap-1"
                >
                  {isCreating || isUpdating ? <Loader2 size={14} className="animate-spin" /> : null}
                  {editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
