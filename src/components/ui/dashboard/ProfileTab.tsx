"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, KeyRound, Save } from "lucide-react";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/redux/features/auth/authApi";
import { useUpdatePasswordMutation } from "@/redux/features/dashboard/dashboardApi";
import toast from "react-hot-toast";

export default function ProfileTab() {
  const { data: profileRes, isLoading: isProfileLoading, refetch } = useGetUserProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const userProfile = profileRes?.data || {};

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync profile details when loaded
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        email: userProfile.email || "",
      });
    }
  }, [userProfile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      }).unwrap();
      toast.success("Profile details updated successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile details");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await updatePassword({
        oldPassword,
        newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800/80 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          <div className="h-72 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Settings & Security
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
          Maintain your personal contact card and configure account access passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-6 flex items-center gap-2">
              <User size={18} className="text-primary" /> Personal Information
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-gray-450 dark:text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Email address cannot be modified.</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} /> {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-6 flex items-center gap-2">
              <KeyRound size={18} className="text-primary" /> Security & Passwords
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Re-type new password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 dark:bg-[#1f2038] text-white hover:bg-slate-800 dark:hover:bg-[#28294a] border border-slate-200 dark:border-slate-850 px-5 py-2.5 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck size={14} /> {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
