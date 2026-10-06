(function () {
  'use strict';

  // The eye follows the cursor.
  var logo = document.querySelector('.logo');
  var pupil = document.getElementById('pupil');
  var MAX = 11; // SVG units the pupil may travel inside the eye

  function look(x, y) {
    var r = logo.getBoundingClientRect();
    var scale = r.width / 300;
    // Eye centre sits at (150, 144) in the 300×300 viewBox.
    var cx = r.left + 150 * scale;
    var cy = r.top + 144 * scale;
    var dx = x - cx;
    var dy = y - cy;
    var dist = Math.hypot(dx, dy) || 1;
    var reach = Math.min(1, dist / 240);
    var ox = (dx / dist) * MAX * reach;
    var oy = (dy / dist) * MAX * reach;
    pupil.setAttribute('transform', 'translate(' + ox.toFixed(2) + ' ' + oy.toFixed(2) + ')');
  }

  if (logo && pupil) {
    var frame = 0;
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX, y = e.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () { look(x, y); });
    }, { passive: true });
    document.addEventListener('pointerleave', function () {
      pupil.setAttribute('transform', 'translate(0 0)');
    });
  }

  // Header becomes glass once the page scrolls.
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Gentle reveal on scroll.
  var targets = document.querySelectorAll('.section-head, .shot, .point, .card, .panel, .play-demo');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
