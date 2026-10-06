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

  // Discord invite: set it once here.
  var DISCORD_URL = '#';
  document.querySelectorAll('[data-discord]').forEach(function (a) {
    if (DISCORD_URL === '#') {
      a.removeAttribute('target');
      a.addEventListener('click', function (e) { e.preventDefault(); });
    } else {
      a.href = DISCORD_URL;
    }
  });

  // Copy buttons on code blocks.
  document.querySelectorAll('.code-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentElement.querySelector('code');
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      });
    });
  });

  // Highlight the current section in the docs sidebar.
  var docLinks = document.querySelectorAll('.docs-nav a');
  if (docLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    docLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        docLinks.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.docs-body section[id]').forEach(function (sec) { spy.observe(sec); });
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
