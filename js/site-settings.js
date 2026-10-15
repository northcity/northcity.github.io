/**
 * NorthCity Site - Theme and Language Switcher
 */

(function() {
    'use strict';

    // ==================== Theme (Dark Mode) ====================
    const storage = {
        getItem(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
        setItem(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
    };
    const THEME_KEY = 'nc-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    function getPreferredTheme() {
        const stored = storage.getItem(THEME_KEY);
        if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        return THEME_LIGHT;
    }

    function setTheme(theme, persist = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) storage.setItem(THEME_KEY, theme);
        updateThemeButton(theme);
    }

    function updateThemeButton(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        const english = document.documentElement.getAttribute('data-lang') === 'en';
        btn.setAttribute('aria-label', theme === THEME_DARK ? (english ? 'Switch to light mode' : '切换亮色模式') : (english ? 'Switch to dark mode' : '切换暗色模式'));
        
        if (theme === THEME_DARK) {
            if (icon) icon.className = 'fas fa-sun';
            if (text) text.textContent = english ? 'Light' : '亮色';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (text) text.textContent = english ? 'Dark' : '暗色';
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
        const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        setTheme(next);
    }

    // ==================== Language ====================
    const LANG_KEY = 'nc-lang';
    const LANG_ZH = 'zh';
    const LANG_EN = 'en';

    function getPreferredLanguage() {
        const stored = storage.getItem(LANG_KEY);
        if (stored === LANG_EN || stored === LANG_ZH) return stored;
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('zh')) {
            return LANG_ZH;
        }
        return LANG_ZH; // Default to Chinese
    }

    function setLanguage(lang) {
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.lang = lang === LANG_EN ? 'en' : 'zh-CN';
        storage.setItem(LANG_KEY, lang);
        updateLanguageContent(lang);
        updateLanguageButton(lang);
        updateThemeButton(document.documentElement.getAttribute('data-theme'));
    }

    function updateLanguageButton(lang) {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        
        btn.setAttribute('aria-label', lang === LANG_ZH ? 'Switch to English' : '切换中文');
        const text = btn.querySelector('span');
        if (text) {
            text.textContent = lang === LANG_ZH ? 'EN' : '中文';
        }
    }

    function updateLanguageContent(lang) {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const zhText = el.getAttribute('data-zh');
            const enText = el.getAttribute('data-en');
            
            if (lang === LANG_EN && enText) {
                el.textContent = enText;
            } else if (zhText) {
                el.textContent = zhText;
            }
        });

        // Show/hide language-specific elements
        document.querySelectorAll('[data-lang-show]').forEach(el => {
            const showLang = el.getAttribute('data-lang-show');
            el.style.display = showLang === lang ? '' : 'none';
        });
    }

    function toggleLanguage() {
        const current = document.documentElement.getAttribute('data-lang') || LANG_ZH;
        const next = current === LANG_ZH ? LANG_EN : LANG_ZH;
        setLanguage(next);
    }

    // ==================== Initialize ====================
    function init() {
        // Apply saved preferences
        setTheme(getPreferredTheme(), false);
        setLanguage(getPreferredLanguage());

        // Bind toggle buttons
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }

        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', toggleLanguage);
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!storage.getItem(THEME_KEY)) {
                    setTheme(e.matches ? THEME_DARK : THEME_LIGHT, false);
                }
            });
        }
    }

    document.documentElement.setAttribute('data-theme', getPreferredTheme());
    document.documentElement.setAttribute('data-lang', getPreferredLanguage());

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions globally
    window.NCSite = {
        toggleTheme,
        toggleLanguage,
        setTheme,
        setLanguage
    };
})();
