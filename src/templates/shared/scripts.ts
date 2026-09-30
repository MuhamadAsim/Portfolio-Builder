/**
 * Shared vanilla script helpers for portfolio templates.
 * All functions produce self-contained, statically analyzable JS strings (< 2 KB).
 * Zero user data interpolation, zero external dependencies.
 */

/**
 * Returns a vanilla script snippet that initializes an accessible mobile navigation menu.
 * Toggles aria-expanded and an 'is-open' class on the target menu element.
 */
export function createMobileNavScript(rootClass: string): string {
  return `
  (function() {
    var root = document.querySelector('.${rootClass}');
    if (!root) return;
    var toggle = root.querySelector('.tpl-nav-toggle');
    var menu = root.querySelector('.tpl-mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        menu.classList.toggle('is-open', !isExpanded);
      });
      var links = menu.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function() {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
        });
      }
    }
  })();
  `.trim();
}

/**
 * Returns a vanilla script snippet for an accessible scroll-to-top button.
 */
export function createScrollTopScript(rootClass: string): string {
  return `
  (function() {
    var root = document.querySelector('.${rootClass}');
    if (!root) return;
    var btn = root.querySelector('.tpl-scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();
  `.trim();
}
