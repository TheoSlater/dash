"use client";
import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./theme";

type ThemeMode = "light" | "dark" | "system";

interface ColorModeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: "system",
  setMode: () => {},
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  // Initialize theme mode on client-side only
  useEffect(() => {
    setMounted(true);
    const storedMode = localStorage.getItem("themeMode") as ThemeMode;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      mode,
      setMode: (newMode: ThemeMode) => {
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);
      },
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  const actualMode = useMemo(() => {
    if (mode === "system") {
      return typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return mode;
  }, [mode]);

  const theme = useMemo(
    () => createTheme(getDesignTokens(actualMode)),
    [actualMode]
  );
  if (!mounted) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
