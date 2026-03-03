import { dictionaries } from './i18n.js';

const getThemePreference = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateLogo = (theme) => {
  const logo = document.getElementById('logo-img');
  if (!logo) return;
  logo.src = theme === 'dark' ? '/logo.png' : '/logoparaofundobranco.png';
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateLogo(theme);
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
};

const getLangPreference = () => {
  return localStorage.getItem('lang') || 'pt-BR';
};

const applyTranslations = (locale) => {
  const dict = dictionaries[locale];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';

  const flagEl = document.getElementById('lang-flag');
  const flagMobileEl = document.getElementById('lang-flag-mobile');
  const flag = locale === 'pt-BR' ? '🇧🇷' : '🇺🇸';
  if (flagEl) flagEl.textContent = flag;
  if (flagMobileEl) flagMobileEl.textContent = flag;
};

const toggleLang = () => {
  const current = localStorage.getItem('lang') || 'pt-BR';
  const next = current === 'pt-BR' ? 'en' : 'pt-BR';
  localStorage.setItem('lang', next);
  applyTranslations(next);
};

const initTheme = () => {
  const theme = getThemePreference();
  setTheme(theme);
};

const initLang = () => {
  applyTranslations(getLangPreference());
};

const initThemeToggle = () => {
  [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')]
    .forEach(btn => btn && btn.addEventListener('click', toggleTheme));
};

const initLangToggle = () => {
  [document.getElementById('lang-toggle'), document.getElementById('lang-toggle-mobile')]
    .forEach(btn => btn && btn.addEventListener('click', toggleLang));
};

const initMobileMenu = () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    isExpanded ? mobileMenu.setAttribute('hidden', '') : mobileMenu.removeAttribute('hidden');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('hidden', '');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('hidden', '');
    }
  });
};

const initScrollHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 80);
  }, { passive: true });
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
      }
    });
  });
};

const initYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

const initLocationMap = () => {
  const card = document.getElementById('location-card');
  const popup = document.getElementById('map-popup');
  if (!card || !popup) return;

  let hoverTimer = null;

  const showMap = () => {
    popup.removeAttribute('hidden');
  };

  const hideMap = () => {
    popup.setAttribute('hidden', '');
    clearTimeout(hoverTimer);
  };

  card.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(showMap, 2000);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    hideMap();
  });
};

const initAccordion = () => {
  document.querySelectorAll('.role-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      const desc = document.getElementById(`role-${role}`);
      if (!desc) return;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (isExpanded) {
        desc.setAttribute('hidden', '');
      } else {
        desc.removeAttribute('hidden');
      }
    });
  });
};

const init = () => {
  initTheme();
  initLang();
  initThemeToggle();
  initLangToggle();
  initMobileMenu();
  initScrollHeader();
  initSmoothScroll();
  initYear();
  initAccordion();
  initLocationMap();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
