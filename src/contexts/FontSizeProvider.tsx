import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";

interface FontSizeProviderProps {
  children: React.ReactNode;
  defaultSize?: FontSize;
  storageKey?: string;
}

interface FontSizeProviderState {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const initialState: FontSizeProviderState = {
  fontSize: "medium",
  setFontSize: () => null,
};

const FontSizeContext = createContext<FontSizeProviderState>(initialState);

export function FontSizeProvider({
  children,
  defaultSize = "medium",
  storageKey = "vite-ui-font-size",
  ...props
}: FontSizeProviderProps) {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem(storageKey) as FontSize) || defaultSize
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("text-sm", "text-base", "text-lg");

    let sizeClass = "text-base";
    if (fontSize === "small") sizeClass = "text-sm";
    if (fontSize === "large") sizeClass = "text-lg";

    root.classList.add(sizeClass);
    // Also scale the HTML font size slightly so rem values scale
    if (fontSize === "small") root.style.fontSize = "14px";
    if (fontSize === "medium") root.style.fontSize = "16px";
    if (fontSize === "large") root.style.fontSize = "18px";
  }, [fontSize]);

  const value = {
    fontSize,
    setFontSize: (size: FontSize) => {
      localStorage.setItem(storageKey, size);
      setFontSize(size);
    },
  };

  return (
    <FontSizeContext.Provider {...props} value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext);

  if (context === undefined)
    throw new Error("useFontSize must be used within a FontSizeProvider");

  return context;
};
