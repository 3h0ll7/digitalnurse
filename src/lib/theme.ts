export type ThemeMode = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

/** Night shift starts at 19:00 and ends at 07:00. */
const NIGHT_START_HOUR = 19;
const DAY_START_HOUR = 7;

export const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: "#FBF7F2",
  dark: "#11142B",
};

export const resolveTheme = (mode: ThemeMode, now: Date): ResolvedTheme => {
  if (mode !== "auto") return mode;
  const hour = now.getHours();
  return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR ? "dark" : "light";
};

export const parseStoredTheme = (value: string | null): ThemeMode =>
  value === "light" || value === "dark" || value === "auto" ? value : "auto";

export const greetingKey = (now: Date): "morning" | "evening" | "night" => {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "evening";
  return "night";
};
