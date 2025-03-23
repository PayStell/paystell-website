import { useState, useEffect } from "react";
import { ButtonTheme } from "./ThemeButton";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else setTheme("light");
    setMounted(true);
  }, [theme]);

  if (!mounted) return null;

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return <ButtonTheme theme={theme ?? "light"} onClick={handleThemeToggle} />;
}
