"use client";

import styles from "../app/page.module.scss";
import Chat from "@/Components/letf-side-chat";
import RightSide from "@/Components/right-side-chat";
import AuthModel from "@/app/(login)/login/page";
import React, { createContext } from "react";

import "../../i18n";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ClintPage({ session }: { session: any }) {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div>
      {!session ? (
        <AuthModel />
      ) : (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <div className={styles.page}>
            <Chat session={session} />
            <RightSide session={session} />
          </div>
        </ThemeContext.Provider>
      )}
    </div>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
