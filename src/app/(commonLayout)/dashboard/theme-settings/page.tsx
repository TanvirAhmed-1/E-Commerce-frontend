"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { THEMES, DEFAULT_THEME, ThemePreset } from "@/constants/themes";
import { Check, Palette, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ThemeSettingsPage() {
  const { token, customerType } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [currentThemeName, setCurrentThemeName] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load current theme name
    const savedTheme = localStorage.getItem("theme-preset");
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentThemeName(theme.name);
      } catch (e) {
        setCurrentThemeName(DEFAULT_THEME.name);
      }
    } else {
      setCurrentThemeName(DEFAULT_THEME.name);
    }
  }, []);

  // Check auth and role
  const isAdmin = customerType === "admin" || customerType === "superadmin" || customerType === "supperadmin";

  useEffect(() => {
    if (mounted && (!token || !isAdmin)) {
      toast.error("Access denied. Admin authorization required.");
      router.push("/");
    }
  }, [mounted, token, isAdmin, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50/50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!token || !isAdmin) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
          <div className="rounded-2xl bg-red-50 p-6 text-center max-w-md border border-red-100 shadow-sm">
            <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold text-red-950 mb-2">Access Denied</h1>
            <p className="text-red-700/80 mb-6">
              You do not have the required permissions to view this page. Only administrators and super administrators are allowed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition"
            >
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const handleSelectTheme = (theme: ThemePreset) => {
    try {
      localStorage.setItem("theme-preset", JSON.stringify(theme));
      setCurrentThemeName(theme.name);

      // Apply style variables to document
      const root = document.documentElement;
      root.style.setProperty("--primary", theme.primary);
      root.style.setProperty("--primary-hover", theme.primaryHover);
      root.style.setProperty("--primary-foreground", theme.primaryForeground);
      root.style.setProperty("--nav-bg", theme.navBg);
      root.style.setProperty("--nav-text-hover", theme.navTextHover);

      // Dispatch event to notify layout
      window.dispatchEvent(new Event("theme-change"));

      toast.success(`Theme updated to ${theme.name}!`);
    } catch (err) {
      toast.error("Failed to update theme.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100/50 min-h-[75vh] py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <Palette className="text-primary h-8 w-8 transition-transform duration-500 hover:rotate-45" />
                Theme Customization
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Customize the dashboard's primary appearance, button colors, hover accents, and navbar highlights.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-4 py-2 rounded-xl transition duration-200"
            >
              <ArrowLeft size={16} /> Back
            </Link>
          </div>

          {/* Current Active Theme Preview */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition duration-300 hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
                Active Theme
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-2">
                {currentThemeName || "Default Sky Theme"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Applying to buttons, hovers, headers, and backgrounds.
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Preview:</span>
              <button className="bg-primary text-primary-foreground font-semibold px-4 py-2 text-xs rounded-lg shadow-sm hover:bg-primary-hover transition-all duration-200">
                Primary Button
              </button>
              <div
                className="h-8 w-8 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: "var(--primary)" }}
              />
              <div
                className="h-8 w-8 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: "var(--nav-bg)" }}
              />
            </div>
          </div>

          {/* Theme Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMES.map((theme) => {
              const isSelected = currentThemeName === theme.name;
              return (
                <div
                  key={theme.name}
                  onClick={() => handleSelectTheme(theme)}
                  className={`group cursor-pointer bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 scale-102"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 10px 25px -5px ${theme.shadowColor}` : undefined
                  }}
                >
                  <div className="p-6">
                    {/* Header of Card */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {theme.name.split(" ")[0]}
                      </h3>
                      {isSelected ? (
                        <span className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm animate-scale-up">
                          <Check size={14} className="stroke-[3]" />
                        </span>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-200 group-hover:border-gray-400 transition" />
                      )}
                    </div>

                    {/* Color Swatch Circle */}
                    <div className="flex gap-3 my-5">
                      <div className="relative">
                        <div
                          className="h-12 w-12 rounded-full border border-gray-100 shadow-md group-hover:scale-110 transition duration-300"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="absolute -bottom-1 -right-1 bg-white text-[10px] text-gray-500 font-semibold px-1 rounded border shadow-xs">
                          Pri
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className="h-12 w-12 rounded-full border border-gray-100 shadow-md group-hover:scale-110 transition duration-300"
                          style={{ backgroundColor: theme.navBg }}
                        />
                        <span className="absolute -bottom-1 -right-1 bg-white text-[10px] text-gray-500 font-semibold px-1 rounded border shadow-xs">
                          Nav
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className="h-12 w-12 rounded-full border border-gray-100 shadow-md group-hover:scale-110 transition duration-300"
                          style={{ backgroundColor: theme.navTextHover }}
                        />
                        <span className="absolute -bottom-1 -right-1 bg-white text-[10px] text-gray-500 font-semibold px-1 rounded border shadow-xs">
                          Hvr
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      Main color: <span className="font-mono">{theme.primary}</span><br />
                      Hover accent: <span className="font-mono">{theme.primaryHover}</span>
                    </p>
                  </div>

                  {/* Apply Status Bar */}
                  <div
                    className={`py-3 px-6 text-center text-xs font-semibold border-t transition-colors duration-300 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-900 border-gray-100"
                    }`}
                  >
                    {isSelected ? "Currently Active" : "Click to Apply"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
