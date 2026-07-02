export interface ThemePreset {
  name: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  navBg: string;
  navTextHover: string;
  shadowColor: string;
}

export const THEMES: ThemePreset[] = [
  {
    name: "Ocean Breeze (Sky Blue)",
    primary: "#0284c7", // Sky 600
    primaryHover: "#0369a1", // Sky 700
    primaryForeground: "#ffffff",
    navBg: "#f0f9ff", // Sky 50
    navTextHover: "#0284c7",
    shadowColor: "rgba(2, 132, 199, 0.2)",
  },
  {
    name: "Forest Mint (Emerald)",
    primary: "#059669", // Emerald 600
    primaryHover: "#047857", // Emerald 700
    primaryForeground: "#ffffff",
    navBg: "#ecfdf5", // Emerald 50
    navTextHover: "#059669",
    shadowColor: "rgba(5, 150, 105, 0.2)",
  },
  {
    name: "Royal Velvet (Violet)",
    primary: "#7c3aed", // Violet 600
    primaryHover: "#6d28d9", // Violet 700
    primaryForeground: "#ffffff",
    navBg: "#f5f3ff", // Violet 50
    navTextHover: "#7c3aed",
    shadowColor: "rgba(124, 58, 237, 0.2)",
  },
  {
    name: "Golden Amber (Orange)",
    primary: "#d97706", // Amber 600
    primaryHover: "#b45309", // Amber 700
    primaryForeground: "#ffffff",
    navBg: "#fefbeb", // Amber 50
    navTextHover: "#d97706",
    shadowColor: "rgba(217, 119, 6, 0.2)",
  },
  {
    name: "Rose Crimson (Rose)",
    primary: "#e11d48", // Rose 600
    primaryHover: "#be123c", // Rose 700
    primaryForeground: "#ffffff",
    navBg: "#fff1f2", // Rose 50
    navTextHover: "#e11d48",
    shadowColor: "rgba(225, 29, 72, 0.2)",
  },
];

export const DEFAULT_THEME = THEMES[0];
