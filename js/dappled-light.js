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

  /* ── 1. SVG wind filter (feTurbulence + feDisplacementMap) like jackyzha0/sunlit ── */
  var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(svgEl.style, { width: '0', height: '0', position: 'absolute' });
  svgEl.innerHTML =
    '<defs>' +
      '<filter id="dl-wind" x="-25%" y="-25%" width="150%" height="150%">' +
        '<feTurbulence type="fractalNoise" numOctaves="3" seed="7">' +
          '<animate attributeName="baseFrequency"' +
          ' dur="20s" keyTimes="0;0.33;0.66;1"' +
          ' values="0.004 0.002;0.009 0.007;0.006 0.003;0.004 0.002"' +
          ' repeatCount="indefinite"/>' +
        '</feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic">' +
          '<animate attributeName="scale"' +
          ' dur="24s" keyTimes="0;0.25;0.5;0.75;1"' +
          ' values="28;42;62;42;28" repeatCount="indefinite"/>' +
        '</feDisplacementMap>' +
      '</filter>' +
    '</defs>';
  document.body.appendChild(svgEl);

  /* ── 2. Procedural leaf canopy drawn onto an offscreen canvas ── */
  var LC = document.createElement('canvas');
  LC.width = 900; LC.height = 1000;
  var LX = LC.getContext('2d');

  function drawLeaf(ctx, x, y, len, w, rot, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -len / 2);
    ctx.bezierCurveTo( w, -len * 0.22,  w,  len * 0.22,  0,  len / 2);
    ctx.bezierCurveTo(-w,  len * 0.22, -w, -len * 0.22,  0, -len / 2);
    ctx.fillStyle = 'rgba(22,32,14,' + a + ')';
    ctx.fill();
    ctx.restore();
  }

  function drawBranch(ctx, x1, y1, x2, y2, thick, a) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    var cx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
    var cy = (y1 + y2) / 2 - (x2 - x1) * 0.12;
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.strokeStyle = 'rgba(22,32,14,' + a + ')';
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  (function buildCanopy() {
    LX.filter = 'blur(2.5px)';
    var clusters = [
      [520, 180, 220, 32, 7],
      [240, 260, 180, 24, 5],
      [730, 360, 160, 20, 5],
      [380, 480, 140, 18, 4],
      [ 80, 130, 135, 20, 4],
      [650, 180, 130, 16, 3],
      [150, 440, 110, 14, 3]
    ];
    clusters.forEach(function(c) {
      var cx = c[0], cy = c[1], rad = c[2], nLeaf = c[3], nBranch = c[4];
      for (var b = 0; b < nBranch; b++) {
        var ang = rng(0, Math.PI * 2), d = rng(rad * 0.2, rad * 0.75);
        drawBranch(LX, cx, cy, cx + Math.cos(ang) * d, cy + Math.sin(ang) * d, rng(2, 7), rng(0.55, 0.88));
      }
      for (var i = 0; i < nLeaf; i++) {
        var a2 = rng(0, Math.PI * 2), d2 = rng(0, rad);
        drawLeaf(LX,
          cx + Math.cos(a2) * d2,
          cy + Math.sin(a2) * d2 * 0.72,
          rng(52, 125), rng(20, 52),
          rng(0, Math.PI * 2), rng(0.45, 0.82));
      }
    });
  })();

  /* CSS: leaf div — SVG wind distortion + subtle sway only (no page-blur) */
  var cssEl = document.createElement('style');
  cssEl.textContent = [
    '#dl-leaves{',
      'position:fixed;pointer-events:none;z-index:8;',
      /* upper-right corner only, smaller footprint */
      'top:-8vh;right:-8vw;width:42vw;height:55vh;',
      'background-size:cover;background-repeat:no-repeat;',
      /* blur the leaf image itself (not backdrop), opacity reduced */
      'opacity:0.10;filter:url(#dl-wind) blur(6px);',
      'animation:dl-billow 14s ease-in-out infinite;',
      'transform-origin:top right;',
    '}',
    '@keyframes dl-billow{',
      /* very gentle sway — no scale pump, tiny rotations */
      '0%  {transform:perspective(800px) rotateX(0deg)    rotateY(0deg)   }',
      '30% {transform:perspective(800px) rotateX(0.4deg)  rotateY(0.8deg) }',
      '55% {transform:perspective(800px) rotateX(-0.6deg) rotateY(-0.5deg)}',
      '80% {transform:perspective(800px) rotateX(0.3deg)  rotateY(-0.4deg)}',
      '100%{transform:perspective(800px) rotateX(0deg)    rotateY(0deg)   }',
    '}'
  ].join('');
  document.head.appendChild(cssEl);

  var leafDiv = document.createElement('div');
  leafDiv.id = 'dl-leaves';
  leafDiv.style.backgroundImage = 'url(' + LC.toDataURL() + ')';
  document.body.appendChild(leafDiv);

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

  /* Glow: floor-bounce from lower-left + ambient from upper-right */
  function drawGlow() {
    var w = GC.width, h = GC.height;
    GX.clearRect(0, 0, w, h);
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

  /* ── Shadow: venetian blind projection — ported from masonwang025/cozy-window-shade ── */
  function drawShadow(now) {
    var w = SC.width, h = SC.height;

    /* slow tri-wave: light-angle shifts over 2.5 min */
    var period  = 150000;
    var phase   = (now % (period * 2)) / period;
    var triWave = phase < 1 ? phase : 2 - phase;
    var n       = triWave * 0.12;

    /* blind openness oscillates gently */
    var open = 0.48 + Math.sin(now * 0.000052) * 0.045 + Math.sin(now * 0.00013) * 0.018;

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

    /* shadow tone warm linen — lighter so text stays readable */
    var sR = Math.round(lerp(210, 218, n));
    var sG = Math.round(lerp(196, 206, n));
    var sB = Math.round(lerp(176, 188, n));
    var sA = lerp(0.36, 0.28, n);

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

    /* warm golden tone back into the lit areas */
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
    SX.restore();
  }

  function frame(now) {
    drawShadow(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

})();
