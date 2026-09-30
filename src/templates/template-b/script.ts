import { createMobileNavScript, createScrollTopScript } from "../shared/scripts";

/**
 * Early anti-flash script executed immediately inside the .tpl-b container
 * to restore the theme from localStorage before initial browser paint.
 */
export const templateBEarlyScript = `
(function() {
  try {
    var t = localStorage.getItem('tpl-b-theme');
    if (t) {
      document.currentScript.parentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`.trim();

/**
 * Template B client interaction script.
 * Scoped to .tpl-b root only, uses aria-pressed on theme toggle button,
 * wraps localStorage in try/catch, and reuses shared mobile nav/scroll helpers.
 */
export const templateBScript = `
${createMobileNavScript("tpl-b")}
${createScrollTopScript("tpl-b")}

(function() {
  var root = document.querySelector('.tpl-b');
  if (!root) return;
  var toggleBtn = root.querySelector('.tpl-theme-toggle');
  if (!toggleBtn) return;

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem('tpl-b-theme');
  } catch (e) {}

  var activeTheme = root.getAttribute('data-theme') || storedTheme;
  if (!activeTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    activeTheme = 'dark';
  }
  if (activeTheme) {
    root.setAttribute('data-theme', activeTheme);
  }

  toggleBtn.setAttribute('aria-pressed', activeTheme === 'dark' ? 'true' : 'false');

  toggleBtn.addEventListener('click', function() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var nextTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    toggleBtn.setAttribute('aria-pressed', nextTheme === 'dark' ? 'true' : 'false');
    try {
      localStorage.setItem('tpl-b-theme', nextTheme);
    } catch (e) {}
  });
})();
`.trim();
