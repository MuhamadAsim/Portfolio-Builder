/**
 * Tiny vanilla client-side interaction script (< 1.5 KB).
 * Statically compiled, zero runtime dependencies, zero user data interpolation.
 */
export const templateAScript = `
(function() {
  var toggle = document.querySelector('.tpl-a .tpl-nav-toggle');
  var mobileMenu = document.querySelector('.tpl-a .tpl-mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('is-open', !isExpanded);
    });
    var navLinks = mobileMenu.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
      });
    }
  }

  var topBtn = document.querySelector('.tpl-a .tpl-scroll-top');
  if (topBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        topBtn.classList.add('is-visible');
      } else {
        topBtn.classList.remove('is-visible');
      }
    });
    topBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var filterBtns = document.querySelectorAll('.tpl-a .tpl-filter-btn');
  var projectCards = document.querySelectorAll('.tpl-a .tpl-project-card');
  if (filterBtns.length > 0 && projectCards.length > 0) {
    for (var j = 0; j < filterBtns.length; j++) {
      filterBtns[j].addEventListener('click', function(e) {
        for (var k = 0; k < filterBtns.length; k++) {
          filterBtns[k].classList.remove('active');
        }
        var btn = e.currentTarget;
        btn.classList.add('active');
        var selectedTag = btn.getAttribute('data-filter');
        for (var m = 0; m < projectCards.length; m++) {
          var card = projectCards[m];
          if (!selectedTag || selectedTag === 'all') {
            card.classList.remove('is-hidden');
          } else {
            var rawTags = card.getAttribute('data-tags') || '';
            var tagsArr = rawTags.split('||');
            if (tagsArr.indexOf(selectedTag) !== -1) {
              card.classList.remove('is-hidden');
            } else {
              card.classList.add('is-hidden');
            }
          }
        }
      });
    }
  }
})();
`.trim();
