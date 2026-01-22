/**
 * NorthCity Site - Theme and Language Switcher
 */

(function() {
    'use strict';

    // ==================== Theme (Dark Mode) ====================
    const THEME_KEY = 'nc-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        return THEME_LIGHT;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        updateThemeButton(theme);
    }

    function updateThemeButton(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (theme === THEME_DARK) {
            if (icon) icon.className = 'fas fa-sun';
            if (text) text.textContent = btn.dataset.lightText || 'Light';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (text) text.textContent = btn.dataset.darkText || 'Dark';
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
        const stored = localStorage.getItem(LANG_KEY);
        if (stored) return stored;
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('zh')) {
            return LANG_ZH;
        }
        return LANG_ZH; // Default to Chinese
    }

    function setLanguage(lang) {
        document.documentElement.setAttribute('data-lang', lang);
        localStorage.setItem(LANG_KEY, lang);
        updateLanguageContent(lang);
        updateLanguageButton(lang);
    }

    function updateLanguageButton(lang) {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        
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
        setTheme(getPreferredTheme());
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
                if (!localStorage.getItem(THEME_KEY)) {
                    setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                }
            });
        }
    }

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
