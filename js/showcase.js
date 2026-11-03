/**
 * Homepage motion: the hero product switcher and the "interface example" fragments.
 * Everything pauses while off-screen and holds a static final state under reduced motion.
 */
(function () {
    'use strict';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lang = () => (document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh');
    const onVisible = (el, cb) => {
        if (!('IntersectionObserver' in window)) { cb(true); return; }
        new IntersectionObserver(entries => cb(entries[0].isIntersecting), { threshold: 0.25 }).observe(el);
    };

    // ---------- Hero switcher ----------
    const showcase = document.querySelector('[data-showcase]');
    if (showcase) {
        const tabs = Array.from(showcase.querySelectorAll('[data-switch]'));
        const slides = Array.from(showcase.querySelectorAll('[data-slide]'));
        let index = 0;
        let timer = null;
        let userPicked = false;
        let visible = true;

        const show = (i) => {
            index = i;
            tabs.forEach((t, n) => t.setAttribute('aria-selected', String(n === i)));
            slides.forEach((s, n) => {
                s.classList.toggle('is-active', n === i);
                s.setAttribute('aria-hidden', String(n !== i));
            });
        };
        const schedule = () => {
            clearTimeout(timer);
            if (reduced || userPicked || !visible) return;
            timer = setTimeout(() => { show((index + 1) % slides.length); schedule(); }, 6000);
        };

        tabs.forEach((tab, i) => tab.addEventListener('click', () => {
            userPicked = true;
            clearTimeout(timer);
            show(i);
        }));
        onVisible(showcase, v => { visible = v; schedule(); });
    }

    // ---------- Interface example fragments ----------
    const wait = (ms, token) => new Promise(r => setTimeout(() => r(token.alive), ms));

    document.querySelectorAll('[data-ex]').forEach(card => {
        const typed = card.querySelector('.typed');
        if (!typed) return; // e.g. the breathing card is pure CSS + the HRV ticker below
        let token = { alive: false };

        const finalState = () => {
            typed.textContent = typed.dataset[lang()];
            card.classList.add('is-done');
        };

        async function loop(t) {
            while (t.alive) {
                card.classList.remove('is-done');
                typed.textContent = '';
                const text = typed.dataset[lang()];
                if (!(await wait(500, t))) return;
                for (const ch of text) {
                    typed.textContent += ch;
                    if (!(await wait(lang() === 'zh' ? 85 : 38, t))) return;
                }
                if (!(await wait(450, t))) return;
                card.classList.add('is-done');
                if (!(await wait(3800, t))) return;
            }
        }

        finalState();
        if (reduced) return;
        onVisible(card, v => {
            token.alive = false;
            if (v) { token = { alive: true }; loop(token); } else { finalState(); }
        });
        document.getElementById('lang-toggle')?.addEventListener('click', () => setTimeout(finalState, 0));
    });

    // Breathing card: phase label follows the 8s CSS orb cycle; HRV drifts a little
    const breath = document.querySelector('[data-breath]');
    if (breath) {
        const phase = breath.querySelector('[data-phase]');
        const hrv = breath.querySelector('[data-hrv]');
        const labels = { zh: ['吸气', '呼气'], en: ['Breathe in', 'Breathe out'] };
        let step = 0;
        const tick = () => {
            phase.textContent = labels[lang()][step % 2];
            if (step % 2 === 0) hrv.textContent = String(44 + Math.round(Math.random() * 8));
            step++;
        };
        tick();
        if (!reduced) setInterval(tick, 4000);
    }
})();
