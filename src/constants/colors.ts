const SHARED_COLORS = {
  primary: "#10B981",
  primaryDark: "#059669",
  secondary: "#3B82F6",
  secondaryDark: "#2563EB",
  warning: "#F59E0B",
  error: "#EF4444",
  success: "#10B981",
  info: "#06B6D4",
};

export const COLORS = {
  light: {
    ...SHARED_COLORS,
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    mapOverlay: "rgba(255, 255, 255, 0.90)",
    pulseCircle: "rgba(59, 130, 246, 0.15)",
    shadowColor: "#0F172A"
  },
  dark: {
    ...SHARED_COLORS,
    background: "#0B0F19",
    surface: "#151D30",
    surfaceSecondary: "#1E293B",
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    border: "#223049",
    mapOverlay: "rgba(21, 29, 48, 0.85)",
    pulseCircle: "rgba(59, 130, 246, 0.25)",
    shadowColor: "#000814"
  },
};

export type ColorTheme = typeof COLORS.light;
