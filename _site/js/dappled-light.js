/*!
 * Homepage dappled light overlay
 *
 * Adapted from jackyzha0/sunlit:
 * - venetian blinds geometry + perspective transform
 * - original leaves.png silhouette layer
 * - wind displacement filter + billow animation
 * - progressive blur + bounce glow
 * - theme-driven sunrise / sunset feel on light / dark changes
 */
(function () {
  'use strict';

  if (!document.querySelector('.hero')) {
    return;
  }

  var existing = document.getElementById('dappled-light');
  if (existing) {
    existing.remove();
  }

  var oldStyle = document.getElementById('dappled-light-style');
  if (oldStyle) {
    oldStyle.remove();
  }

  var EASE = 'cubic-bezier(0.455, 0.190, 0.000, 0.985)';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var timer = null;
  var lastDark = null;

  var style = document.createElement('style');
  style.id = 'dappled-light-style';
  style.textContent = [
    'body{position:relative;}',
    'body>:not(#dappled-light):not(script){position:relative;z-index:1;}',
    '#dappled-light{--dl-shadow:#1a1917;--dl-bounce-light:#f5d7a6;pointer-events:none;position:fixed;inset:0;z-index:0;overflow:hidden;}',
    '#dappled-light *{box-sizing:border-box;}',
    '#dappled-light .dl-atmosphere{position:absolute;inset:0;background:linear-gradient(180deg,#fffdfa 0%,#fcf7ef 62%,#f6ecdd 100%);transition:background 1s ' + EASE + ';}',
    '#dappled-light.is-dark{--dl-shadow:#030307;--dl-bounce-light:#1b293f;}',
    '#dappled-light.is-dark .dl-atmosphere{background:linear-gradient(180deg,#0f131c 0%,#16132b 58%,#101722 100%);}',
    '#dappled-light.to-dark .dl-atmosphere{animation:dl-sunset 1.7s linear forwards;}',
    '#dappled-light.to-light .dl-atmosphere{animation:dl-sunrise 1s linear forwards;}',
    '@keyframes dl-sunrise{0%{background:#0f131c;}10%{background:#16132b;}35%{background:#9fb3bf;}100%{background:#fffdfa;}}',
    '@keyframes dl-sunset{0%{background:#fffdfa;}30%{background:#fccc83;}60%{background:#db7a2a;}90%{background:#16132b;}100%{background:#0f131c;}}',
    '#dappled-light .dl-glow{position:absolute;inset:0;background:linear-gradient(309deg,var(--dl-bounce-light),var(--dl-bounce-light) 20%,transparent);transition:background 1s ' + EASE + ';height:100%;width:100%;opacity:.5;}',
    '#dappled-light .dl-glow-bounce{position:absolute;inset:0;background:linear-gradient(355deg,var(--dl-bounce-light) 0%,transparent 30%,transparent 100%);transition:background 1s ' + EASE + ';opacity:.5;height:100%;width:100%;bottom:0;}',
    '#dappled-light .perspective{position:absolute;top:-30vh;right:0;width:80vw;height:130vh;opacity:.07;transform-origin:top right;transform-style:preserve-3d;transform:matrix3d(0.7500,-0.0625,0,0.0008,0,1,0,0,0,0,1,0,0,0,0,1);transition:transform 1.7s ' + EASE + ',opacity 4s ease;}',
    '#dappled-light.is-dark .perspective{opacity:.3;transform:matrix3d(0.8333,0.0833,0,0.0003,0,1,0,0,0,0,1,0,0,0,0,1);}',
    '#dappled-light #leaves{position:absolute;background-size:cover;background-repeat:no-repeat;bottom:-20px;right:-700px;width:1600px;height:1400px;background-image:url("/img/home/sunlit-leaves.png");filter:url(#dl-wind);animation:dl-billow 8s ease-in-out infinite;opacity:.94;}',
    '#dappled-light.is-dark #leaves{opacity:.66;}',
    '#dappled-light #blinds{position:relative;width:100%;}',
    '#dappled-light #blinds .shutter,#dappled-light #blinds .bar{background-color:var(--dl-shadow);}',
    '#dappled-light #blinds>.shutters{display:flex;flex-direction:column;align-items:end;gap:60px;transition:gap 1s ' + EASE + ';}',
    '#dappled-light.is-dark #blinds>.shutters{gap:20px;}',
    '#dappled-light #blinds>.vertical{top:0;position:absolute;height:100%;width:100%;display:flex;justify-content:space-around;}',
    '#dappled-light .vertical>.bar{width:5px;height:100%;}',
    '#dappled-light .shutter{width:100%;height:40px;transition:height 1s ' + EASE + ';}',
    '#dappled-light.is-dark .shutter{height:80px;}',
    '#dappled-light .dl-progressive-blur{position:absolute;inset:0;}',
    '#dappled-light .dl-progressive-blur>div{position:absolute;inset:0;backdrop-filter:blur(var(--blur-amount));-webkit-backdrop-filter:blur(var(--blur-amount));mask-image:linear-gradient(252deg,transparent,transparent var(--stop1),black var(--stop2),black);-webkit-mask-image:linear-gradient(252deg,transparent,transparent var(--stop1),black var(--stop2),black);}',
    '#dappled-light .dl-progressive-blur>div:nth-child(1){--blur-amount:6px;--stop1:0%;--stop2:0%;}',
    '#dappled-light .dl-progressive-blur>div:nth-child(2){--blur-amount:12px;--stop1:40%;--stop2:80%;}',
    '#dappled-light .dl-progressive-blur>div:nth-child(3){--blur-amount:48px;--stop1:40%;--stop2:70%;}',
    '#dappled-light .dl-progressive-blur>div:nth-child(4){--blur-amount:96px;--stop1:70%;--stop2:80%;}',
    '@keyframes dl-billow{0%{transform:perspective(400px) rotateX(0deg) rotateY(0deg) scale(1);}25%{transform:perspective(400px) rotateX(1deg) rotateY(2deg) scale(1.02);}50%{transform:perspective(400px) rotateX(-4deg) rotateY(-2deg) scale(0.97);}75%{transform:perspective(400px) rotateX(1deg) rotateY(-1deg) scale(1.04);}100%{transform:perspective(400px) rotateX(0deg) rotateY(0deg) scale(1);}}'
  ].join('');
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'dappled-light';

  var atmosphere = document.createElement('div');
  atmosphere.className = 'dl-atmosphere';
  root.appendChild(atmosphere);

  var glow = document.createElement('div');
  glow.className = 'dl-glow';
  root.appendChild(glow);

  var glowBounce = document.createElement('div');
  glowBounce.className = 'dl-glow-bounce';
  root.appendChild(glowBounce);

  var perspective = document.createElement('div');
  perspective.className = 'perspective';

  var leaves = document.createElement('div');
  leaves.id = 'leaves';
  leaves.innerHTML = [
    '<svg aria-hidden="true" style="width:0;height:0;position:absolute;">',
    '<defs>',
    '<filter id="dl-wind" x="-20%" y="-20%" width="140%" height="140%">',
    '<feTurbulence type="fractalNoise" numOctaves="2" seed="1">',
    '<animate attributeName="baseFrequency" dur="16s" keyTimes="0;0.33;0.66;1" values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003" repeatCount="indefinite"></animate>',
    '</feTurbulence>',
    '<feDisplacementMap in="SourceGraphic">',
    '<animate attributeName="scale" dur="20s" keyTimes="0;0.25;0.5;0.75;1" values="45;55;75;55;45" repeatCount="indefinite"></animate>',
    '</feDisplacementMap>',
    '</filter>',
    '</defs>',
    '</svg>'
  ].join('');
  perspective.appendChild(leaves);

  var blinds = document.createElement('div');
  blinds.id = 'blinds';

  var shutters = document.createElement('div');
  shutters.className = 'shutters';
  for (var i = 0; i < 24; i++) {
    var shutter = document.createElement('div');
    shutter.className = 'shutter';
    shutters.appendChild(shutter);
  }
  blinds.appendChild(shutters);

  var vertical = document.createElement('div');
  vertical.className = 'vertical';
  for (var j = 0; j < 2; j++) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    vertical.appendChild(bar);
  }
  blinds.appendChild(vertical);
  perspective.appendChild(blinds);
  root.appendChild(perspective);

  var progressiveBlur = document.createElement('div');
  progressiveBlur.className = 'dl-progressive-blur';
  for (var k = 0; k < 4; k++) {
    progressiveBlur.appendChild(document.createElement('div'));
  }
  root.appendChild(progressiveBlur);

  document.body.insertBefore(root, document.body.firstChild);

  function detectDark() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      return true;
    }
    if (theme === 'light') {
      return false;
    }
    return media.matches ||
      document.documentElement.classList.contains('dark') ||
      document.documentElement.classList.contains('dark-mode') ||
      document.body.classList.contains('dark') ||
      document.body.classList.contains('dark-mode');
  }

  function playTransition(isDark) {
    root.classList.remove('to-dark', 'to-light');
    void root.offsetWidth;
    root.classList.add(isDark ? 'to-dark' : 'to-light');
    clearTimeout(timer);
    timer = window.setTimeout(function () {
      root.classList.remove('to-dark', 'to-light');
    }, isDark ? 1750 : 1050);
  }

  function applyTheme(animate) {
    var isDark = detectDark();
    root.classList.toggle('is-dark', isDark);
    if (animate && lastDark !== null && lastDark !== isDark) {
      playTransition(isDark);
    }
    lastDark = isDark;
  }

  applyTheme(false);

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', function () {
      applyTheme(true);
    });
  } else if (typeof media.addListener === 'function') {
    media.addListener(function () {
      applyTheme(true);
    });
  }

  var observer = new MutationObserver(function () {
    applyTheme(true);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  });
})();
