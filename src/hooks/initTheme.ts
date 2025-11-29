export function initTheme() {
    const saved = localStorage.theme;
  
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
}
  