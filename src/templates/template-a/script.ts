import { createMobileNavScript, createScrollTopScript } from "../shared/scripts";

/**
 * Template A client interaction script.
 * Bundles shared mobile navigation and scroll-to-top helpers with project tag filtering.
 * Statically constructed, < 1.5 KB total, zero user data.
 */
export const templateAScript = `
${createMobileNavScript("tpl-a")}
${createScrollTopScript("tpl-a")}

(function() {
  var root = document.querySelector('.tpl-a');
  if (!root) return;
  var filterBtns = root.querySelectorAll('.tpl-filter-btn');
  var projectCards = root.querySelectorAll('.tpl-project-card');
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
