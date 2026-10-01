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
 * wraps localStorage in try/catch, project/skill filtering, and scroll reveal.
 */
export const templateBScript = `
${createMobileNavScript("tpl-b")}
${createScrollTopScript("tpl-b")}

(function() {
  function initTemplateB() {
    var root = document.querySelector('.tpl-b');
    if (!root) return;

    /* ── 1. Dark Mode Theme Toggle ─────────────────────────────────────── */
    var toggleBtn = root.querySelector('.tpl-theme-toggle');
    if (toggleBtn) {
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
    }

    /* ── 2. Project Filtering with Live Counter ────────────────────────── */
    var filterBtns = root.querySelectorAll('.tpl-b-filter-btn');
    var projectCards = root.querySelectorAll('.tpl-project-card');
    var countEl = root.querySelector('.tpl-b-project-count');

    if (filterBtns.length > 0 && projectCards.length > 0) {
      for (var j = 0; j < filterBtns.length; j++) {
        filterBtns[j].addEventListener('click', function(e) {
          for (var k = 0; k < filterBtns.length; k++) {
            filterBtns[k].classList.remove('active');
          }
          var btn = e.currentTarget;
          btn.classList.add('active');
          var selectedTag = btn.getAttribute('data-filter');
          var visibleCount = 0;

          for (var m = 0; m < projectCards.length; m++) {
            var card = projectCards[m];
            if (!selectedTag || selectedTag === 'all') {
              card.classList.remove('is-hidden');
              visibleCount++;
            } else {
              var rawTags = card.getAttribute('data-tags') || '';
              var tagsArr = rawTags.split('||');
              if (tagsArr.indexOf(selectedTag) !== -1) {
                card.classList.remove('is-hidden');
                visibleCount++;
              } else {
                card.classList.add('is-hidden');
              }
            }
          }

          if (countEl) {
            countEl.textContent = 'Showing ' + visibleCount + ' of ' + projectCards.length + ' projects';
          }
        });
      }
    }

    /* ── 3. Scroll Reveal for Sections & Cards ─────────────────────────── */
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

      var revealTargets = root.querySelectorAll('.tpl-b-reveal');
      for (var r = 0; r < revealTargets.length; r++) {
        revealObserver.observe(revealTargets[r]);
      }
    } else {
      var allReveals = root.querySelectorAll('.tpl-b-reveal');
      for (var a = 0; a < allReveals.length; a++) {
        allReveals[a].classList.add('is-revealed');
      }
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTemplateB);
    } else {
      setTimeout(initTemplateB, 0);
    }
  }
})();
`.trim();
