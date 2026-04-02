/*!
 * Venetian Blinds Light Effect
 *
 * Pure CSS implementation -- faithfully adapted from jackyzha0/sunlit
 * https://github.com/jackyzha0/sunlit
 *
 * Technique:
 *   A fixed perspective-skewed container holds flex-column shutter divs.
 *   Light mode : gap=58px  shutter-h=36px  -> open blinds, light stripes
 *   Dark  mode : gap=16px  shutter-h=80px  -> closed blinds, dark overlay
 *   All transitions are pure CSS (gap + height + transform + opacity).
 *   No canvas, no blend-mode -- page text colours stay untouched.
 */
(function () {
  'use strict';

  /* timing curve from sunlit */
  var EASE = 'cubic-bezier(0.455, 0.190, 0.000, 0.985)';
  var DUR  = '1.4s';

  /* inject CSS */
  var style = document.createElement('style');
  style.textContent =
    /* wrapper: fixed, full-screen, non-interactive */
    '#dl-wrap{' +
      'pointer-events:none;position:fixed;' +
      'top:0;left:0;width:100vw;height:100vh;' +
      'z-index:10;overflow:hidden;' +
    '}' +

    /* perspective container -- light-mode matrix from sunlit */
    '#dl-persp{' +
      'position:absolute;' +
      'top:-30vh;right:0;' +
      'width:80vw;height:130vh;' +
      'opacity:0.08;' +
      'transform-origin:top right;' +
      'transform:matrix3d(' +
        '0.7500,-0.0625,0,0.0008,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        '0,0,0,1' +
      ');' +
      'transition:' +
        'transform ' + DUR + ' ' + EASE + ',' +
        'opacity 1.2s ease;' +
    '}' +

    /* dark mode: steeper angle, higher opacity */
    '#dl-wrap.is-dark #dl-persp{' +
      'opacity:0.45;' +
      'transform:matrix3d(' +
        '0.8333,0.0833,0,0.0003,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        '0,0,0,1' +
      ');' +
    '}' +

    /* shutter container */
    '#dl-shutters{' +
      'display:flex;flex-direction:column;align-items:flex-end;' +
      'width:100%;' +
      'gap:58px;' +
      'transition:gap ' + DUR + ' ' + EASE + ';' +
    '}' +

    '#dl-wrap.is-dark #dl-shutters{gap:16px;}' +

    /* individual slat */
    '.dl-shutter{' +
      'width:100%;height:36px;' +
      'background:#1a1917;' +
      'transition:height ' + DUR + ' ' + EASE + ';' +
    '}' +

    '#dl-wrap.is-dark .dl-shutter{height:80px;}' +

    /* two vertical window-frame bars */
    '#dl-verticals{' +
      'position:absolute;top:0;' +
      'width:100%;height:100%;' +
      'display:flex;justify-content:space-around;' +
      'pointer-events:none;' +
    '}' +
    '.dl-bar{width:5px;height:100%;background:#1a1917;}';

  document.head.appendChild(style);

  /* build DOM */
  var wrap = document.createElement('div');
  wrap.id = 'dl-wrap';

  var persp = document.createElement('div');
  persp.id = 'dl-persp';

  var blinds = document.createElement('div');
  blinds.id = 'dl-blinds';

  var shutters = document.createElement('div');
  shutters.id = 'dl-shutters';

  /* 26 shutters -- enough to fill 130vh */
  for (var i = 0; i < 26; i++) {
    var s = document.createElement('div');
    s.className = 'dl-shutter';
    shutters.appendChild(s);
  }

  var verts = document.createElement('div');
  verts.id = 'dl-verticals';
  var bar1 = document.createElement('div'); bar1.className = 'dl-bar';
  var bar2 = document.createElement('div'); bar2.className = 'dl-bar';
  verts.appendChild(bar1);
  verts.appendChild(bar2);

  blinds.appendChild(shutters);
  blinds.appendChild(verts);
  persp.appendChild(blinds);
  wrap.appendChild(persp);
  document.body.appendChild(wrap);

  /* dark-mode detection */
  function checkDark() {
    var dark =
      window.matchMedia('(prefers-color-scheme: dark)').matches ||
      document.documentElement.classList.contains('dark')       ||
      document.documentElement.classList.contains('dark-mode')  ||
      document.body.classList.contains('dark')                  ||
      document.body.classList.contains('dark-mode');
    wrap.classList.toggle('is-dark', dark);
  }

  checkDark();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDark);
  new MutationObserver(checkDark).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(checkDark).observe(document.body,            { attributes: true, attributeFilter: ['class'] });

})();
