/**
 * NorthCity - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            // getElementById: kramdown ids can start with a digit, which querySelector rejects
            const target = document.getElementById(decodeURIComponent(href.slice(1)));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start'
                });
                if (href === '#main-content') target.focus({ preventScroll: true });
            }
        });
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Navigation: hairline on scroll + mobile menu
    const nav = document.getElementById('site-nav');
    const navToggle = nav && nav.querySelector('.nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    if (navToggle && navLinks) {
        const setMenu = (open) => {
            navLinks.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        };
        navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.addEventListener('click', e => { if (!e.target.closest('#site-nav')) setMenu(false); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) { setMenu(false); navToggle.focus(); }
        });
        window.matchMedia('(min-width: 961px)').addEventListener('change', () => setMenu(false));
    }

    // Copy-to-clipboard buttons (WeChat ID)
    const toast = document.getElementById('toast');
    let toastTimer;
    const showToast = (text) => {
        if (!toast) return;
        toast.textContent = text;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
    };
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const english = document.documentElement.getAttribute('data-lang') === 'en';
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                showToast(english ? btn.dataset.copiedEn : btn.dataset.copiedZh);
            } catch (_) {
                showToast(btn.dataset.copy);
            }
        });
    });

    // Article table of contents (posts with `catalog: true`)
    const tocList = document.getElementById('toc-list');
    const articleContent = document.getElementById('article-content');
    if (tocList && articleContent) {
        const headings = Array.from(articleContent.querySelectorAll('h2, h3'));
        const links = headings.map((h, i) => {
            if (!h.id) h.id = 'section-' + (i + 1);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent.replace(/^#\s*/, '');
            if (h.tagName === 'H3') a.className = 'is-sub';
            li.appendChild(a);
            tocList.appendChild(li);
            return a;
        });
        if (!headings.length) {
            tocList.closest('.toc').remove();
        } else if ('IntersectionObserver' in window) {
            const spy = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    links.forEach(a => a.classList.toggle('is-active', a.hash === '#' + entry.target.id));
                });
            }, { rootMargin: '-80px 0px -70% 0px' });
            headings.forEach(h => spy.observe(h));
        }
    }
});

// =====================
// 访客计数 - 北城首页
// =====================

const NORTHCITY_STATS_API = 'https://timepill.api.northcity.top/1/classes/Statistics';
const NORTHCITY_API_HEADERS = {
    'X-Bmob-Application-Id': '075c9e426a01a48a81aa12305924e532',
    'X-Bmob-REST-API-Key': 'a92fd1416101a7ee4de0ee0850572b91',
    'Content-Type': 'application/json'
};

async function getNorthcityVisitCount() {
    try {
        const response = await fetch(`${NORTHCITY_STATS_API}?count=1&limit=1&where=${encodeURIComponent(JSON.stringify({ type: 'visit' }))}`, {
            method: 'GET',
            headers: NORTHCITY_API_HEADERS
        });

        if (!response.ok) {
            throw new Error('获取访客数失败');
        }

        const data = await response.json();
        const total = typeof data.count === 'number' ? data.count : (data.results || []).length;

        const el = document.getElementById('northcityVisitCount');
        if (el) el.textContent = total.toLocaleString();
    } catch (error) {
        console.error('获取访客数失败:', error);
        const el = document.getElementById('northcityVisitCount');
        if (el) el.textContent = '0';
    }
}

async function recordNorthcityVisit() {
    try {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        await fetch(NORTHCITY_STATS_API, {
            method: 'POST',
            headers: NORTHCITY_API_HEADERS,
            body: JSON.stringify({ type: 'visit', timestamp })
        });
        await getNorthcityVisitCount();
    } catch (error) {
        console.error('记录访问失败:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (isLocalPreview) {
        const count = document.getElementById('northcityVisitCount');
        if (count) count.closest('.footer-visit-count').hidden = true;
        return;
    }
    if (document.getElementById('northcityVisitCount')) {
        recordNorthcityVisit();
    }
});

// Console Easter Egg
console.log('%c👋 你好！', 'font-size: 24px; font-weight: bold;');
console.log('%c欢迎来到北城的个人网站。', 'font-size: 14px;');
console.log('%c如果你对代码感兴趣，欢迎在 GitHub 上找我聊聊。', 'font-size: 14px; color: #666;');
