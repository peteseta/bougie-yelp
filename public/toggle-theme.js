(() => {
  if (window.__literaryTheme) return;
  window.__literaryTheme = true;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const saved = () => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  };
  let theme = saved() || (media.matches ? "dark" : "light");
  function reflect() {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
      button.setAttribute(
        "aria-label",
        `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      );
    });
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#212220" : "#fcfbf8");
  }
  reflect();
  document.addEventListener("DOMContentLoaded", reflect);
  document.addEventListener("astro:after-swap", reflect);
  document.addEventListener("astro:before-swap", (event) => {
    event.newDocument.documentElement.dataset.theme = theme;
  });
  document.addEventListener("click", (event) => {
    if (
      !(event.target instanceof Element) ||
      !event.target.closest("[data-theme-toggle]")
    )
      return;
    theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* Theme still works without storage. */
    }
    reflect();
  });
  media.addEventListener("change", () => {
    if (!saved()) {
      theme = media.matches ? "dark" : "light";
      reflect();
    }
  });
})();
