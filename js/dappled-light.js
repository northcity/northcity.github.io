/*!
 * Dappled Light Effect — v2
 *
 * Deeply inspired by:
 *   masonwang025/cozy-window-shade : multiply canvas + destination-out blinds
 *   jackyzha0/sunlit               : SVG feTurbulence leaves + progressive blur
 *   farayan.me / dany.works        : restrained, organic warmth
 *
 * Layer stack
 *   #dl-leaves  div    SVG feTurbulence wind filter + CSS billow    z:8
 *   #dl-shadow  canvas mix-blend-mode:multiply                      z:9
 *   #dl-glow    canvas mix-blend-mode:screen  opacity:0.13          z:10
 *   #dl-blur    div    4x backdrop-filter progressive blur           z:11
 */
(function () {
  'use strict';

  var lerp = function(a, b, t) { return a + (b - a) * t; };
  var rng  = function(lo, hi)  { return lo + Math.random() * (hi - lo); };

  /* ── 1. Dark mode detection ── */
  /* Watch both prefers-color-scheme AND common body/html dark classes */
  var isDark = false;
  function checkDark() {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
             document.documentElement.classList.contains('dark') ||
             document.documentElement.classList.contains('dark-mode') ||
             document.body.classList.contains('dark') ||
             document.body.classList.contains('dark-mode');
  }
  checkDark();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDark);
  /* MutationObserver for class-based dark toggle */
  new MutationObserver(checkDark).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(checkDark).observe(document.body,            { attributes: true, attributeFilter: ['class'] });

  /* ── 2. SVG wind filter — gentle turbulence for bamboo sway ── */
  var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(svgEl.style, { width: '0', height: '0', position: 'absolute' });
  svgEl.innerHTML =
    '<defs>' +
      '<filter id="dl-wind" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feTurbulence type="fractalNoise" numOctaves="2" seed="11">' +
          '<animate attributeName="baseFrequency"' +
          ' dur="18s" keyTimes="0;0.5;1"' +
          ' values="0.003 0.001;0.006 0.004;0.003 0.001"' +
          ' repeatCount="indefinite"/>' +
        '</feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic">' +
          '<animate attributeName="scale"' +
          ' dur="22s" keyTimes="0;0.5;1"' +
          ' values="12;20;12" repeatCount="indefinite"/>' +
        '</feDisplacementMap>' +
      '</filter>' +
    '</defs>';
  document.body.appendChild(svgEl);

  /* ── 3. Procedural bamboo silhouette for the decorative corner div ── */
  var LC = document.createElement('canvas');
  LC.width = 700; LC.height = 900;
  var LX = LC.getContext('2d');

  /* Single bamboo leaf: long thin pointed blade */
  function drawBambooLeaf(ctx, x, y, len, rot, a) {
    var w = len * 0.055; /* very narrow */
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( w,  len * 0.25,  w * 0.7,  len * 0.7,  0, len);
    ctx.bezierCurveTo(-w * 0.7,  len * 0.7, -w,  len * 0.25,  0, 0);
    ctx.fillStyle = 'rgba(20,30,12,' + a + ')';
    ctx.fill();
    ctx.restore();
  }

  /* Single bamboo stalk: thin tall line with node bumps */
  function drawBambooStalk(ctx, x, topY, bottomY, thick, a) {
    var segH = 55;
    ctx.save();
    ctx.strokeStyle = 'rgba(20,30,12,' + a + ')';
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    /* slight S-curve */
    ctx.beginPath();
    ctx.moveTo(x, topY);
    var mid = (topY + bottomY) / 2;
    ctx.bezierCurveTo(x + thick * 1.5, mid - 80, x - thick * 1.0, mid + 80, x, bottomY);
    ctx.stroke();
    /* node rings */
    ctx.lineWidth = thick * 1.8;
    for (var y = topY + segH; y < bottomY; y += segH) {
      ctx.beginPath();
      ctx.moveTo(x - thick, y);
      ctx.lineTo(x + thick, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  (function buildBamboo() {
    LX.clearRect(0, 0, LC.width, LC.height);
    /* 4 stalks at different x positions */
    var stalks = [
      { x: 580, top: -60, bot: 900, thick: 7,  a: 0.82 },
      { x: 480, top:  40, bot: 860, thick: 5,  a: 0.70 },
      { x: 630, top: -20, bot: 820, thick: 4,  a: 0.60 },
      { x: 540, top:  80, bot: 780, thick: 3,  a: 0.50 }
    ];
    stalks.forEach(function(s) {
      drawBambooStalk(LX, s.x, s.top, s.bot, s.thick, s.a);
      /* leaves sprouting from each node */
      var segH = 55;
      for (var nodeY = s.top + segH; nodeY < s.bot; nodeY += segH + rng(-8, 8)) {
        var nLeaves = Math.floor(rng(1, 4));
        for (var li = 0; li < nLeaves; li++) {
          var side   = (li % 2 === 0) ? 1 : -1;
          var ang    = side * rng(0.3, 0.9) + (side > 0 ? 0 : Math.PI);
          var leafLen = rng(60, 130);
          drawBambooLeaf(LX,
            s.x + side * s.thick,
            nodeY,
            leafLen,
            ang + Math.PI * 0.5,  /* hang down */
            rng(0.55, 0.85) * s.a);
        }
      }
    });
  })();

  /* CSS: bamboo corner div + gentle sway (no page-blur) */
  var cssEl = document.createElement('style');
  cssEl.textContent = [
    '#dl-leaves{',
      'position:fixed;pointer-events:none;z-index:8;',
      'top:-4vh;right:-4vw;width:36vw;height:62vh;',
      'background-size:contain;background-repeat:no-repeat;background-position:top right;',
      'opacity:0.12;',
      'filter:url(#dl-wind);',        /* SVG turbulence sway — no blur so shapes stay crisp */
      'animation:dl-bamboo-sway 12s ease-in-out infinite;',
      'transform-origin:50% 0%;',     /* sway from top anchor */
    '}',
    '@keyframes dl-bamboo-sway{',
      '0%  { transform: rotate(0deg)    skewX(0deg)   }',
      '20% { transform: rotate(0.6deg)  skewX(0.3deg) }',
      '45% { transform: rotate(-0.5deg) skewX(-0.2deg)}',
      '70% { transform: rotate(0.4deg)  skewX(0.15deg)}',
      '100%{ transform: rotate(0deg)    skewX(0deg)   }',
    '}'
  ].join('');
  document.head.appendChild(cssEl);

  var leafDiv = document.createElement('div');
  leafDiv.id = 'dl-leaves';
  leafDiv.style.backgroundImage = 'url(' + LC.toDataURL() + ')';
  document.body.appendChild(leafDiv);

  /* ── Bamboo shadow data: pre-computed leaf positions for canvas animation ── */
  /* Each entry: [stalkX(0-1), nodeY(0-1), leafAngle, leafLen(0-1), side, baseAlpha] */
  var bamShadows = [];
  (function genBamShadows() {
    var stalks2 = [
      { x: 0.72, top: -0.05, bot: 0.95, segH: 0.10 },
      { x: 0.58, top:  0.08, bot: 0.88, segH: 0.11 },
      { x: 0.85, top: -0.02, bot: 0.80, segH: 0.09 },
      { x: 0.45, top:  0.15, bot: 0.75, segH: 0.12 },
      { x: 0.30, top:  0.25, bot: 0.90, segH: 0.10 }
    ];
    stalks2.forEach(function(s) {
      for (var ny = s.top + s.segH; ny < s.bot; ny += s.segH + rng(-0.01, 0.01)) {
        var cnt = Math.floor(rng(1, 4));
        for (var li = 0; li < cnt; li++) {
          var side = (li % 2 === 0) ? 1 : -1;
          bamShadows.push({
            sx: s.x, ny: ny,
            ang: side * rng(0.35, 0.85),
            len: rng(0.06, 0.14),
            phase: rng(0, Math.PI * 2),
            freq: rng(0.00018, 0.00038),
            amp:  rng(0.008, 0.018),
            alpha: rng(0.038, 0.075)
          });
        }
      }
    });
  })();

  /* ── 3. Shadow canvas  mix-blend-mode:multiply ── */
  /* (progressive blur removed — backdrop-filter would blur page text) */
  var SC = document.createElement('canvas');
  SC.id = 'dl-shadow';
  SC.setAttribute('aria-hidden', 'true');
  Object.assign(SC.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9', mixBlendMode: 'multiply'
  });
  document.body.appendChild(SC);
  var SX = SC.getContext('2d');

  /* ── 5. Glow canvas  mix-blend-mode:screen ── */
  var GC = document.createElement('canvas');
  GC.id = 'dl-glow';
  Object.assign(GC.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '10', mixBlendMode: 'screen', opacity: '0.13'
  });
  document.body.appendChild(GC);
  var GX = GC.getContext('2d');

  function fit() {
    SC.width = GC.width = window.innerWidth;
    SC.height = GC.height = window.innerHeight;
    drawGlow();
  }
  window.addEventListener('resize', fit);
  fit();

  /* Offscreen canvas pool */
  var pool = {};
  function getOff(key, w, h) {
    if (!pool[key] || pool[key].width !== w || pool[key].height !== h) {
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      pool[key] = c;
    }
    return pool[key];
  }

  /* Glow: floor-bounce + ambient (light mode); moonlight blue tint (dark mode) */
  function drawGlow() {
    checkDark();
    var w = GC.width, h = GC.height;
    GX.clearRect(0, 0, w, h);
    if (isDark) {
      /* subtle cool blue-silver moonlight glow from upper-right */
      var gd = GX.createLinearGradient(w, 0, w * 0.2, h * 0.6);
      gd.addColorStop(0,    'rgba(160,175,210,0.18)');
      gd.addColorStop(0.5,  'rgba(140,160,200,0.06)');
      gd.addColorStop(1,    'rgba(120,140,180,0)');
      GX.fillStyle = gd; GX.fillRect(0, 0, w, h);
    } else {
      var g1 = GX.createLinearGradient(0, h, w * 0.55, h * 0.18);
      g1.addColorStop(0,    'rgba(255,208,130,0.60)');
      g1.addColorStop(0.45, 'rgba(255,220,158,0.22)');
      g1.addColorStop(1,    'rgba(255,235,195,0)');
      GX.fillStyle = g1; GX.fillRect(0, 0, w, h);
      var g2 = GX.createLinearGradient(w, 0, w * 0.15, h * 0.5);
      g2.addColorStop(0,    'rgba(255,226,170,0.40)');
      g2.addColorStop(0.38, 'rgba(255,220,150,0.14)');
      g2.addColorStop(1,    'rgba(255,235,200,0)');
      GX.fillStyle = g2; GX.fillRect(0, 0, w, h);
    }
  }

  /* ── Shadow: venetian blind projection + bamboo dapple ── */
  function drawShadow(now) {
    var w = SC.width, h = SC.height;
    checkDark();

    /* slow tri-wave: light-angle shifts over 2.5 min */
    var period  = 150000;
    var phase   = (now % (period * 2)) / period;
    var triWave = phase < 1 ? phase : 2 - phase;
    var n       = triWave * 0.12;

    /* dark mode: blinds mostly closed; light mode: open ~half */
    var openTarget = isDark ? 0.04 : 0.48;
    var open = openTarget
      + Math.sin(now * 0.000052) * (isDark ? 0.015 : 0.045)
      + Math.sin(now * 0.00013)  * (isDark ? 0.008 : 0.018);

    /* light-source position drift */
    var bx = Math.sin(now * 0.000082) * 8 + Math.sin(now * 0.000225) * 3.5;
    var by = Math.cos(now * 0.000100) * 5.5 + Math.cos(now * 0.000195) * 2;

    /* projection geometry */
    var skewX    = lerp(0.33, 0.25, n);
    var skewY    = lerp(0.12, 0.08, n);
    var stretchX = lerp(1.88, 1.58, n);
    var stretchY = lerp(1.12, 0.96, n);
    var projW    = Math.min(w * 0.62, 460) * stretchX;
    var projH    = Math.min(h * 0.82, 560) * stretchY;
    var px       = lerp(w * 0.004, w * 0.048, n) + bx;
    var py       = lerp(h * 0.004, h * 0.024, n) + by;

    /* dark: deep blue-grey shadow; light: warm linen */
    var sR = isDark ? Math.round(lerp(28,  35,  n)) : Math.round(lerp(210, 218, n));
    var sG = isDark ? Math.round(lerp(30,  38,  n)) : Math.round(lerp(196, 206, n));
    var sB = isDark ? Math.round(lerp(42,  52,  n)) : Math.round(lerp(176, 188, n));
    var sA = isDark ? lerp(0.72, 0.65, n)            : lerp(0.34, 0.26, n);

    /* slat geometry */
    var numSlats  = 16;
    var frameT    = lerp(9, 6, n);
    var innerH    = projH - frameT * 2;
    var spacing   = innerH / numSlats;
    var slatThick = spacing * lerp(0.80, 0.10, open);
    var gapH      = spacing - slatThick;
    var baseSoft  = lerp(11, 6, n);

    SX.clearRect(0, 0, w, h);
    SX.globalCompositeOperation = 'source-over';
    SX.fillStyle = 'rgba(' + sR + ',' + sG + ',' + sB + ',' + sA + ')';
    SX.fillRect(0, 0, w, h);

    if (gapH < 0.4) return;

    /* build light-band pattern on offscreen canvas */
    var offW = Math.ceil(projW + 100);
    var offH = Math.ceil(projH + 100);
    var OC = getOff('blind', offW, offH);
    var OX = OC.getContext('2d');
    OX.clearRect(0, 0, offW, offH);

    for (var i = 0; i < numSlats; i++) {
      var baseY    = frameT + i * spacing + slatThick;
      var wb       = Math.sin(now * 0.000070 + i * 0.55) * 1.1
                   + Math.sin(now * 0.000178 + i * 0.80) * 0.55;
      var sy       = baseY + wb;
      var slatSoft = baseSoft * (0.52 + (i / numSlats) * 1.0);
      var slatA    = 1.0 - Math.abs(i - numSlats / 2) / (numSlats / 2) * 0.09;
      var padY     = slatSoft * 1.4;
      var g = OX.createLinearGradient(0, sy - padY, 0, sy + gapH + padY);
      g.addColorStop(0,                             'rgba(255,255,255,0)');
      g.addColorStop(padY / (gapH + padY * 2),      'rgba(255,255,255,' + slatA + ')');
      g.addColorStop(1 - padY / (gapH + padY * 2), 'rgba(255,255,255,' + slatA + ')');
      g.addColorStop(1,                             'rgba(255,255,255,0)');
      OX.fillStyle = g;
      OX.fillRect(frameT, sy - padY, projW - frameT * 2, gapH + padY * 2);
    }

    /* horizontal vignette — bright centre, fade to edges */
    OX.globalCompositeOperation = 'destination-in';
    var hV = OX.createLinearGradient(frameT, 0, projW - frameT, 0);
    hV.addColorStop(0,    'rgba(255,255,255,0.07)');
    hV.addColorStop(0.06, 'rgba(255,255,255,0.52)');
    hV.addColorStop(0.14, 'rgba(255,255,255,1)');
    hV.addColorStop(0.52, 'rgba(255,255,255,1)');
    hV.addColorStop(0.74, 'rgba(255,255,255,0.75)');
    hV.addColorStop(0.88, 'rgba(255,255,255,0.28)');
    hV.addColorStop(1,    'rgba(255,255,255,0.02)');
    OX.fillStyle = hV; OX.fillRect(0, 0, offW, offH);

    /* vertical vignette */
    var vV = OX.createLinearGradient(0, frameT, 0, projH - frameT);
    vV.addColorStop(0,    'rgba(255,255,255,0.05)');
    vV.addColorStop(0.05, 'rgba(255,255,255,0.52)');
    vV.addColorStop(0.12, 'rgba(255,255,255,1)');
    vV.addColorStop(0.78, 'rgba(255,255,255,0.80)');
    vV.addColorStop(0.90, 'rgba(255,255,255,0.28)');
    vV.addColorStop(1,    'rgba(255,255,255,0.02)');
    OX.fillStyle = vV; OX.fillRect(0, 0, offW, offH);

    /* window mullion — vertical centre bar + horizontal rail */
    OX.globalCompositeOperation = 'destination-out';
    var mullW    = frameT * 0.55;
    var mullSoft = baseSoft * 0.9;
    var mx = projW * 0.47;
    var mg = OX.createLinearGradient(mx - mullW - mullSoft, 0, mx + mullW + mullSoft, 0);
    mg.addColorStop(0,   'rgba(255,255,255,0)');
    mg.addColorStop(0.2, 'rgba(255,255,255,1)');
    mg.addColorStop(0.8, 'rgba(255,255,255,1)');
    mg.addColorStop(1,   'rgba(255,255,255,0)');
    OX.fillStyle = mg;
    OX.fillRect(mx - mullW - mullSoft, 0, (mullW + mullSoft) * 2, projH);

    var my = projH * 0.42;
    var hg = OX.createLinearGradient(0, my - mullW - mullSoft, 0, my + mullW + mullSoft);
    hg.addColorStop(0,   'rgba(255,255,255,0)');
    hg.addColorStop(0.2, 'rgba(255,255,255,1)');
    hg.addColorStop(0.8, 'rgba(255,255,255,1)');
    hg.addColorStop(1,   'rgba(255,255,255,0)');
    OX.fillStyle = hg;
    OX.fillRect(0, my - mullW - mullSoft, projW, (mullW + mullSoft) * 2);

    OX.globalCompositeOperation = 'source-over';

    /* project onto main shadow canvas with perspective skew */
    SX.save();
    SX.translate(px, py);
    SX.transform(1, skewY, skewX, 1, 0, 0);

    SX.globalCompositeOperation = 'destination-out';
    SX.drawImage(OC, 0, 0);

    /* warm golden tone back into the lit areas (light mode only) */
    if (!isDark) {
    var wlG = Math.round(lerp(216, 230, n));
    var wlB = Math.round(lerp(144, 174, n));
    var wA  = lerp(0.25, 0.14, n);
    var WC  = getOff('warm', offW, offH);
    var WX  = WC.getContext('2d');
    WX.clearRect(0, 0, offW, offH);
    var wG = WX.createRadialGradient(
      projW * 0.38, projH * 0.44, 0,
      projW * 0.38, projH * 0.44, projW * 0.82);
    wG.addColorStop(0,   'rgba(255,' + wlG + ',' + wlB + ',' + (wA * 0.90) + ')');
    wG.addColorStop(0.5, 'rgba(255,' + wlG + ',' + wlB + ',' + (wA * 0.55) + ')');
    wG.addColorStop(1,   'rgba(255,' + wlG + ',' + wlB + ',' + (wA * 0.10) + ')');
    WX.fillStyle = wG; WX.fillRect(0, 0, offW, offH);
    WX.globalCompositeOperation = 'destination-in';
    WX.drawImage(OC, 0, 0);
    WX.globalCompositeOperation = 'source-over';

    SX.globalCompositeOperation = 'source-over';
    SX.drawImage(WC, 0, 0);
    }
    SX.restore();

    /* ── Bamboo dapple: draw animated leaf shadows across the page ── */
    /* These are drawn in screen-space (no skew), creating organic moving patches */
    SX.save();
    SX.globalCompositeOperation = 'source-over';
    var shadowAlpha = isDark ? 1.8 : 1.0; /* stronger in dark */
    bamShadows.forEach(function(b) {
      /* each leaf sways independently */
      var sway = Math.sin(now * b.freq + b.phase) * b.amp;
      var lx   = (b.sx + sway) * w;
      var ly   =  b.ny * h;
      var len  =  b.len * Math.min(w, h);
      var ang  =  b.ang + sway * 1.5;  /* angle also moves slightly */

      /* long thin shadow stroke — bamboo leaf shape */
      var ex = lx + Math.cos(ang) * len;
      var ey = ly + Math.sin(ang) * len;
      var cpx = (lx + ex) / 2 - Math.sin(ang) * len * 0.08;
      var cpy = (ly + ey) / 2 + Math.cos(ang) * len * 0.08;

      SX.beginPath();
      SX.moveTo(lx, ly);
      SX.quadraticCurveTo(cpx, cpy, ex, ey);
      var a = b.alpha * shadowAlpha;
      SX.strokeStyle = isDark
        ? 'rgba(10,14,22,' + Math.min(a, 0.14) + ')'
        : 'rgba(30,35,18,' + Math.min(a, 0.09) + ')';
      SX.lineWidth = len * 0.065;
      SX.lineCap   = 'round';
      SX.stroke();
    });
    SX.restore();
  }

  function frame(now) {
    drawGlow();      /* redraws each frame so dark-mode toggle takes effect immediately */
    drawShadow(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

})();
