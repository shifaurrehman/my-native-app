import { useColorScheme } from "react-native";
import { COLORS, ColorTheme } from "../constants/colors";

export const useTheme = (): ColorTheme & { isDark: boolean } => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;
  return {
    ...theme,
    isDark,
  };
};
