/*!
 * Dappled Light Effect
 *
 * Simulates warm sunlight filtered through leaves / a window,
 * casting soft, slowly-drifting patches of light across the page.
 *
 * Technique (inspired by masonwang025/cozy-window-shade & jackyzha0/sunlit):
 *   1. A fixed canvas sits above the page with mix-blend-mode: multiply.
 *   2. The canvas is filled with a warm-neutral shadow tint.
 *   3. Soft elliptical light-patches are erased via destination-out,
 *      leaving the underlying page at full brightness in the lit areas.
 *   4. A warm golden glow layer is drawn over the lit areas (screen blend).
 *   5. Everything animates with independent slow sinusoidal drift.
 */
(function () {
  'use strict';

  // ─── helpers ──────────────────────────────────────────────────────────────
  const rng  = (lo, hi) => lo + Math.random() * (hi - lo);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ─── canvas setup ─────────────────────────────────────────────────────────
  const C = document.createElement('canvas');
  C.id = 'dappled-light';
  C.setAttribute('aria-hidden', 'true');
  Object.assign(C.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '9',
    mixBlendMode:  'multiply',
  });
  document.body.insertBefore(C, document.body.firstChild);
  const X = C.getContext('2d');

  // ─── glow canvas (screen blend, drawn on top) ─────────────────────────────
  const G = document.createElement('canvas');
  G.id = 'dappled-light-glow';
  G.setAttribute('aria-hidden', 'true');
  Object.assign(G.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '10',
    mixBlendMode:  'screen',
    opacity:       '0.18',
  });
  document.body.insertBefore(G, C.nextSibling);
  const GX = G.getContext('2d');

  function fit() {
    C.width  = G.width  = window.innerWidth;
    C.height = G.height = window.innerHeight;
  }
  window.addEventListener('resize', fit);
  fit();

  // ─── light-patch definitions ──────────────────────────────────────────────
  //
  // Each patch is an independently-drifting soft ellipse.
  // Positions are normalised (0-1 relative to canvas size).
  // Some patches start partially off-screen so they fade in naturally.
  //
  const NUM_PATCHES = 24;
  const patches = Array.from({ length: NUM_PATCHES }, () => ({
    // base position (normalised, can be slightly outside [0,1])
    bx:  rng(-0.12, 1.12),
    by:  rng(-0.08, 1.08),
    // two sinusoidal drift components per axis
    f1x: rng(4e-5, 9e-5),  f1y: rng(3.5e-5, 8e-5),
    f2x: rng(1.2e-4, 2.4e-4), f2y: rng(1.0e-4, 2.0e-4),
    ax:  rng(0.035, 0.09),
    ay:  rng(0.025, 0.07),
    px:  rng(0, Math.PI * 2),
    py:  rng(0, Math.PI * 2),
    // ellipse radii (normalised to min(w, h))
    rx:  rng(0.04, 0.13),
    ry:  rng(0.03, 0.095),
    // slow rotation (rad/ms)
    rot0: rng(0, Math.PI * 2),
    rotV: rng(-7e-5, 7e-5),
    // softness: inner opaque core radius fraction
    core: rng(0.28, 0.55),
    // peak opacity of the erase pass
    alpha: rng(0.60, 0.95),
    // warm glow tint (golden-amber hues)
    r: Math.floor(rng(255, 255)),
    g: Math.floor(rng(195, 235)),
    b: Math.floor(rng(100, 160)),
  }));

  // ─── shadow tone ──────────────────────────────────────────────────────────
  // multiply-blended: this warm grey-tan darkens the page in shadowed areas;
  // the transparent holes we punch leave the page untouched.
  const SHADOW_R = 208, SHADOW_G = 193, SHADOW_B = 172;
  const SHADOW_A = 0.52; // overall shadow strength – lower = lighter effect

  // ─── single-frame renderer ────────────────────────────────────────────────
  function drawPatch(ctx, px, py, rx, ry, rot, core, alpha, isErase, rr, gg, bb) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.scale(1, ry / rx);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    if (isErase) {
      // destination-out: high alpha = more light punched through
      grad.addColorStop(0,     `rgba(255,255,255,${alpha})`);
      grad.addColorStop(core,  `rgba(255,255,255,${alpha * 0.80})`);
      grad.addColorStop(0.75,  `rgba(255,255,255,${alpha * 0.30})`);
      grad.addColorStop(1,      'rgba(255,255,255,0)');
    } else {
      // warm glow (source-over, screen blend canvas)
      const ga = alpha * 0.9;
      grad.addColorStop(0,     `rgba(${rr},${gg},${bb},${ga})`);
      grad.addColorStop(core,  `rgba(${rr},${gg},${bb},${ga * 0.6})`);
      grad.addColorStop(0.78,  `rgba(${rr},${gg},${bb},${ga * 0.15})`);
      grad.addColorStop(1,      `rgba(${rr},${gg},${bb},0)`);
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ─── animation loop ───────────────────────────────────────────────────────
  function frame(now) {
    const w = C.width, h = C.height, s = Math.min(w, h);

    // ── multiply canvas ─────────────────────────────────────────────────────
    X.clearRect(0, 0, w, h);

    // shadow fill
    X.globalCompositeOperation = 'source-over';
    X.fillStyle = `rgba(${SHADOW_R},${SHADOW_G},${SHADOW_B},${SHADOW_A})`;
    X.fillRect(0, 0, w, h);

    // punch out light patches
    X.globalCompositeOperation = 'destination-out';
    for (const p of patches) {
      const x = (p.bx
        + Math.sin(now * p.f1x + p.px) * p.ax
        + Math.cos(now * p.f2x + p.px + 1.37) * p.ax * 0.40
      ) * w;
      const y = (p.by
        + Math.cos(now * p.f1y + p.py) * p.ay
        + Math.sin(now * p.f2y + p.py + 2.09) * p.ay * 0.33
      ) * h;
      drawPatch(X, x, y, p.rx * s, p.ry * s, p.rot0 + now * p.rotV,
                p.core, p.alpha, true, 255, 255, 255);
    }
    X.globalCompositeOperation = 'source-over';

    // ── glow canvas ──────────────────────────────────────────────────────────
    GX.clearRect(0, 0, w, h);
    for (const p of patches) {
      const x = (p.bx
        + Math.sin(now * p.f1x + p.px) * p.ax
        + Math.cos(now * p.f2x + p.px + 1.37) * p.ax * 0.40
      ) * w;
      const y = (p.by
        + Math.cos(now * p.f1y + p.py) * p.ay
        + Math.sin(now * p.f2y + p.py + 2.09) * p.ay * 0.33
      ) * h;
      drawPatch(GX, x, y, p.rx * s * 0.85, p.ry * s * 0.85,
                p.rot0 + now * p.rotV, p.core, p.alpha * 0.75, false,
                p.r, p.g, p.b);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
