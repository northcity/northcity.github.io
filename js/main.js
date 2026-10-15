/**
 * NorthCity - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
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
