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
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navigation
    const nav = document.querySelector('.nav');
    if (nav) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.05)';
            } else {
                nav.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
    
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
    
    // Add animation to elements on scroll
    if ('IntersectionObserver' in window) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.product-card, .essay-card, .connect-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animateObserver.observe(el);
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
    if (document.getElementById('northcityVisitCount')) {
        recordNorthcityVisit();
    }
});

// Console Easter Egg
console.log('%c👋 你好！', 'font-size: 24px; font-weight: bold;');
console.log('%c欢迎来到北城的个人网站。', 'font-size: 14px;');
console.log('%c如果你对代码感兴趣，欢迎在 GitHub 上找我聊聊。', 'font-size: 14px; color: #666;');
