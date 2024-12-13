import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  /**
   * Sets the theme for the application.
   * @param {string} theme - The theme to be set.
   */
  setTheme: (theme) => {
    // Store the theme in localStorage
    localStorage.setItem("chat-theme", theme);

    // Update the state with the new theme
    set({ theme });
  },
}));
