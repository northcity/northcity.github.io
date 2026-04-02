/*!
 * Dappled Light Effect — combined approach
 *
 * Inspired by:
 *   jackyzha0/sunlit  — CSS venetian blind structure + perspective matrix3d
 *   farayan.me        — warm afternoon-light quality, organic softness
 *   dany.works        — diffuse blur so edges are never perfectly crisp
 *   cozy-window-shade — subtle neutral-warm colour warmth overlay
 *
 * Architecture (no canvas, no mix-blend-mode over content):
 *   Layer A (#dl-glow)   — warm radial-gradient overlay, z-index 9
 *                          gives light between slats a golden quality
 *   Layer B (#dl-persp)  — the slat shadows, blurred so edges diffuse
 *                          z-index 10
 *
 * Text readability: neither layer uses a blend mode, so all page
 * colours remain as-authored.
 */
(function () {
  'use strict';

  /* sunlit easing + duration */
  var EASE = 'cubic-bezier(0.455, 0.190, 0.000, 0.985)';
  var DUR  = '1.4s';

  /* micro height variation pool — breaks up perfect uniformity
     values cycle: slightly thinner / thicker alternating slats      */
  var HEIGHTS = [33, 38, 31, 40, 34, 36, 30, 39, 35, 37];

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent =

    /* ── outer wrapper ── */
    '#dl-wrap{' +
      'pointer-events:none;position:fixed;' +
      'top:0;left:0;width:100vw;height:100vh;' +
      'z-index:9;overflow:hidden;' +
    '}' +

    /* ── Layer A: warm light glow (fills gaps between slats) ──
       Light mode: gentle warm cream; Dark mode: fades to 0          */
    '#dl-glow{' +
      'position:absolute;inset:0;' +
      /* diagonal beam geometry — references farayan / dany */
      'background:' +
        'linear-gradient(' +
          '108deg,' +
          'rgba(255,248,225,0.055) 0%,' +
          'rgba(255,242,195,0.040) 35%,' +
          'rgba(255,235,170,0.022) 60%,' +
          'transparent 78%' +
        ');' +
      'opacity:1;' +
      'transition:opacity 1.2s ease;' +
    '}' +
    '#dl-wrap.is-dark #dl-glow{opacity:0;}' +

    /* ── Layer B: slat shadows (blurred, perspective-skewed) ── */
    '#dl-persp{' +
      'position:absolute;' +
      'top:-30vh;right:0;' +
      'width:90vw;height:140vh;' +
      /* light opacity — dark mode raises it */
      'opacity:0.09;' +
      'transform-origin:top right;' +
      /* sunlit light-mode matrix — slight perspective lean */
      'transform:matrix3d(' +
        '0.7500,-0.0625,0,0.0008,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        '0,0,0,1' +
      ');' +
      /* KEY: blur diffuses the hard slat edges — the single biggest
         difference between "CSS stripes" and "actual sunlight"       */
      'filter:blur(5px);' +
      'transition:' +
        'transform ' + DUR + ' ' + EASE + ',' +
        'opacity 1.2s ease,' +
        'filter 1.2s ease;' +
    '}' +
    '#dl-wrap.is-dark #dl-persp{' +
      'opacity:0.50;' +
      /* dark: steeper angle (sun lower / blinds more closed) */
      'transform:matrix3d(' +
        '0.8333,0.0833,0,0.0003,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        '0,0,0,1' +
      ');' +
      /* tighter blur in dark — shadows sharper when blinds nearly shut */
      'filter:blur(3px);' +
    '}' +

    /* ── slat container ── */
    '#dl-shutters{' +
      'display:flex;flex-direction:column;align-items:flex-end;' +
      'width:100%;' +
      'gap:56px;' +
      'transition:gap ' + DUR + ' ' + EASE + ';' +
    '}' +
    '#dl-wrap.is-dark #dl-shutters{gap:14px;}' +

    /* ── individual slat ──
       base colour: warm dark brown (not pure neutral black/gray)
       references the #1a1917 from sunlit but slightly warmer        */
    '.dl-shutter{' +
      'width:100%;height:35px;' +
      'background:#211d19;' +
      'transition:height ' + DUR + ' ' + EASE + ';' +
    '}' +
    '#dl-wrap.is-dark .dl-shutter{height:80px;}' +

    /* ── nth-child micro-variations — organic irregularity ──
       Real venetian slats are never perfectly identical             */
    '.dl-shutter:nth-child(3n){height:32px;}' +
    '.dl-shutter:nth-child(3n+1){height:38px;}' +
    '.dl-shutter:nth-child(5n){height:30px;}' +
    '.dl-shutter:nth-child(7n){height:41px;}' +
    '#dl-wrap.is-dark .dl-shutter:nth-child(3n){height:76px;}' +
    '#dl-wrap.is-dark .dl-shutter:nth-child(3n+1){height:84px;}' +
    '#dl-wrap.is-dark .dl-shutter:nth-child(5n){height:74px;}' +
    '#dl-wrap.is-dark .dl-shutter:nth-child(7n){height:86px;}' +

    /* ── vertical window-frame bars ── */
    '#dl-verticals{' +
      'position:absolute;top:0;' +
      'width:100%;height:100%;' +
      'display:flex;justify-content:space-around;' +
      'pointer-events:none;' +
    '}' +
    '.dl-bar{' +
      'width:5px;height:100%;' +
      'background:#1e1a16;' +
    '}';

  document.head.appendChild(style);

  /* ── DOM ── */
  var wrap = document.createElement('div');
  wrap.id = 'dl-wrap';

  /* Layer A: warm glow */
  var glow = document.createElement('div');
  glow.id = 'dl-glow';
  wrap.appendChild(glow);

  /* Layer B: blind shadows */
  var persp = document.createElement('div');
  persp.id = 'dl-persp';

  var blinds = document.createElement('div');
  blinds.id = 'dl-blinds';

  var shutters = document.createElement('div');
  shutters.id = 'dl-shutters';

  for (var i = 0; i < 28; i++) {
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

  /* ── dark-mode detection ── */
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
