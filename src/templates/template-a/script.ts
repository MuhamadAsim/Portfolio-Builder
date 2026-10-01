import { createMobileNavScript, createScrollTopScript } from "../shared/scripts";

/**
 * Template A client interaction script.
 * Bundles:
 * 1. Mobile navigation drawer toggle
 * 2. Smooth back-to-top scroll button
 * 3. Hero canvas interactive particle network (pause when out of view)
 * 4. Project tag filtering with live count update
 * 5. Scroll-triggered reveal animations
 *
 * Statically constructed, ~2.5 KB total, zero user data injection.
 */
export const templateAScript = `
${createMobileNavScript("tpl-a")}
${createScrollTopScript("tpl-a")}

(function() {
  function initTemplateA() {
    var root = document.querySelector('.tpl-a');
    if (!root) return;

    /* ── 1. Interactive Hero Canvas Particle Network ──────────────────────── */
    var canvas = root.querySelector('.tpl-hero-canvas');
    var heroSection = root.querySelector('#hero');

    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var particles = [];
      var animFrameId = null;
      var mouse = { x: -1000, y: -1000, active: false };
      var isHeroVisible = true;
      var particleCount = 42;

      function resizeCanvas() {
        if (!canvas || !canvas.parentElement) return;
        var rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      function initParticles() {
        particles = [];
        var w = canvas.width || 800;
        var h = canvas.height || 600;
        var count = w < 640 ? 24 : particleCount;

        for (var i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            r: Math.random() * 2 + 1.2
          });
        }
      }

      function drawParticles() {
        if (!isHeroVisible) return;
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        var pLen = particles.length;
        for (var i = 0; i < pLen; i++) {
          var p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          else if (p.y > h) p.y = 0;

          // Mouse gentle repulsion
          if (mouse.active) {
            var dx = p.x - mouse.x;
            var dy = p.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100 && dist > 0) {
              var force = (100 - dist) / 100;
              p.x += (dx / dist) * force * 1.5;
              p.y += (dy / dist) * force * 1.5;
            }
          }

          // Draw particle dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
          ctx.fill();

          // Connect nearby particles
          for (var j = i + 1; j < pLen; j++) {
            var p2 = particles[j];
            var dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist2 < 110) {
              var alpha = (1 - dist2 / 110) * 0.28;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(168, 85, 247, ' + alpha + ')';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        animFrameId = requestAnimationFrame(drawParticles);
      }

      resizeCanvas();
      initParticles();
      animFrameId = requestAnimationFrame(drawParticles);

      window.addEventListener('resize', function() {
        resizeCanvas();
        initParticles();
      });

      if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
          var rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          mouse.active = true;
        });
        heroSection.addEventListener('mouseleave', function() {
          mouse.active = false;
        });

        if ('IntersectionObserver' in window) {
          var heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              isHeroVisible = entry.isIntersecting;
              if (isHeroVisible && !animFrameId) {
                animFrameId = requestAnimationFrame(drawParticles);
              } else if (!isHeroVisible && animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
              }
            });
          }, { threshold: 0.05 });
          heroObserver.observe(heroSection);
        }
      }
    }

    /* ── 2. Project Filtering with Live Counter ──────────────────────────── */
    var filterBtns = root.querySelectorAll('.tpl-filter-btn');
    var projectCards = root.querySelectorAll('.tpl-project-card');
    var countEl = root.querySelector('.tpl-project-live-count');

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

    /* ── 3. Scroll Reveal for Sections and Cards ─────────────────────────── */
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      var revealTargets = root.querySelectorAll('.tpl-reveal');
      for (var r = 0; r < revealTargets.length; r++) {
        revealObserver.observe(revealTargets[r]);
      }
    } else {
      var allReveals = root.querySelectorAll('.tpl-reveal');
      for (var a = 0; a < allReveals.length; a++) {
        allReveals[a].classList.add('is-revealed');
      }
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTemplateA);
    } else {
      setTimeout(initTemplateA, 0);
    }
  }
})();
`.trim();
