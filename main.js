import { dictionaries } from './i18n.js';
import { initContactModal } from './contact-modal.js';
import {
  logoDark,
  logoLight,
  leandroDark,
  leandroLight,
  chatAvatarLight,
  chatAvatarDark,
} from './src/assets/images.js';

const getThemePreference = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return 'dark';
};

const updateLogo = (theme) => {
  const logo = document.getElementById('logo-img');
  if (logo) logo.src = theme === 'dark' ? logoDark : logoLight;
  const favicon = document.getElementById('favicon');
  if (favicon) favicon.href = theme === 'dark' ? logoDark : logoLight;
};

const updateHeroImage = (theme) => {
  const heroImg = document.querySelector('.hero-image .image-wrapper img');
  if (!heroImg) return;
  heroImg.src = theme === 'dark' ? leandroDark : leandroLight;
};

const updateChatImages = (theme) => {
  const src = theme === 'dark' ? chatAvatarDark : chatAvatarLight;
  document.querySelectorAll('.chat-fab img, .chat-header-avatar img, .chat-bubble-avatar img').forEach(img => {
    img.src = src;
  });
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateLogo(theme);
  updateHeroImage(theme);
  updateChatImages(theme);
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
};

const getLangPreference = () => {
  return localStorage.getItem('lang') || 'pt-BR';
};

let currentSkillKey = 'azure-devops';

const getSkillDesc = (key, locale) => {
  const dict = dictionaries[locale || getLangPreference()];
  return dict ? (dict[`skill.${key}.desc`] || SKILL_DATA[key]?.desc || '') : (SKILL_DATA[key]?.desc || '');
};

const updateSkillDescs = (locale) => {
  if (!currentSkillKey) return;
  const textEl = document.getElementById('skills-desc-text');
  if (textEl) textEl.textContent = getSkillDesc(currentSkillKey, locale);
  const carouselTextEl = document.getElementById('skills-carousel-desc-text');
  if (carouselTextEl) carouselTextEl.textContent = getSkillDesc(currentSkillKey, locale);
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

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.placeholder = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-label');
    if (dict[key] !== undefined) {
      const required = el.querySelector('.contact-form-required');
      Array.from(el.childNodes).forEach(n => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
      const textNode = document.createTextNode(dict[key] + (required ? ' ' : ''));
      el.insertBefore(textNode, el.firstChild);
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';

  const isBR = locale === 'pt-BR';
  [document.getElementById('lang-flag'), document.getElementById('lang-flag-mobile')].forEach(el => {
    if (!el) return;
    const br = el.querySelector('.flag-br');
    const us = el.querySelector('.flag-us');
    if (br) br.style.display = isBR ? '' : 'none';
    if (us) us.style.display = isBR ? 'none' : '';
  });

  updateSkillDescs(locale);
};

const toggleLang = () => {
  const current = localStorage.getItem('lang') || 'pt-BR';
  const next = current === 'pt-BR' ? 'en' : 'pt-BR';
  localStorage.setItem('lang', next);
  applyTranslations(next);
  const badge = document.querySelector('.hero-text .badge');
  if (badge) typewriterAnimate(badge, badge.textContent.trim());
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

const SECTION_SLUG_MAP = {
  'sobre': 'sobre',
  'skills': 'skills',
  'certificados': 'certificados',
  'experiencia': 'experiencia',
  'contato': 'contato',
};

const scrollToSection = (sectionId, updateUrl = true) => {
  const target = document.getElementById(sectionId);
  if (!target) return;
  window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  if (updateUrl && SECTION_SLUG_MAP[sectionId]) {
    history.pushState({ section: sectionId }, '', '/' + SECTION_SLUG_MAP[sectionId]);
  }
};

const handleDeepLink = () => {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  if (!path) return;
  const sectionId = Object.keys(SECTION_SLUG_MAP).find(k => SECTION_SLUG_MAP[k] === path);
  if (sectionId) {
    requestAnimationFrame(() => scrollToSection(sectionId, false));
  }
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        history.pushState({}, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const sectionId = href.replace('#', '');
      const target = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        scrollToSection(sectionId);
      }
    });
  });

  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (!path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const sectionId = Object.keys(SECTION_SLUG_MAP).find(k => SECTION_SLUG_MAP[k] === path);
    if (sectionId) scrollToSection(sectionId, false);
  });
};

const initYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

let typewriterTimer = null;

const typewriterAnimate = (el, text, speed = 55) => {
  if (typewriterTimer) clearTimeout(typewriterTimer);
  el.textContent = '';
  el.classList.add('typewriter-active');
  let i = 0;
  const type = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      typewriterTimer = setTimeout(type, speed);
    } else {
      el.classList.remove('typewriter-active');
    }
  };
  type();
};

const initTypewriter = () => {
  const badge = document.querySelector('.hero-text .badge');
  if (!badge) return;
  const text = badge.textContent.trim();
  typewriterAnimate(badge, text);
};

const SKILL_DATA = {
  'azure-devops': {
    name: 'Azure DevOps',
    category: 'CI/CD',
    url: 'dev.azure.com',
    color: '#0078d4',
    bgIcon: 'rgba(0, 120, 212, 0.14)',
    bg: 'rgba(0, 120, 212, 0.06)',
    iconName: 'Azure DevOps',
    desc: 'Azure DevOps é a plataforma da Microsoft para gestão de pipelines CI/CD, controle de versão, planejamento de sprints e entrega contínua. Utilizo o Azure DevOps para criar e manter pipelines de build e deploy automatizados, configurar ambientes, gerenciar repositórios Git e controlar releases de aplicações em produção com segurança e rastreabilidade.',
  },
  'azure': {
    name: 'Azure',
    category: 'Cloud',
    url: 'portal.azure.com',
    color: '#0078d4',
    bgIcon: 'rgba(0, 120, 212, 0.14)',
    bg: 'rgba(0, 120, 212, 0.06)',
    iconName: 'Azure',
    desc: 'Microsoft Azure é a plataforma de computação em nuvem da Microsoft, utilizada para hospedar, gerenciar e escalar aplicações e serviços. Como administrador do ambiente, sou responsável pela criação, configuração e gerenciamento dos recursos dentro da plataforma, além do monitoramento da infraestrutura e da implementação de melhorias e novas soluções. Também acompanho o uso dos serviços para garantir estabilidade, segurança e controle de custos do ambiente em nuvem.',
  },
  'm365': {
    name: 'Microsoft 365',
    category: 'Productivity',
    url: 'admin.cloud.microsoft',
    color: '#d83b01',
    bgIcon: 'rgba(216, 59, 1, 0.14)',
    bg: 'rgba(216, 59, 1, 0.06)',
    iconName: 'Microsoft 365',
    desc: 'Microsoft 365 é o ecossistema de produtividade e colaboração da Microsoft, que inclui Exchange Online, Teams, SharePoint, OneDrive e muito mais. Gerencio o ambiente M365 da organização via Admin Center, cuidando do provisionamento de usuários, licenças, políticas de segurança, grupos e configurações de conformidade para garantir a operação eficiente e segura de toda a força de trabalho.',
  },
  'gcp': {
    name: 'GCP',
    category: 'Cloud',
    url: 'console.cloud.google.com',
    color: '#4285f4',
    bgIcon: 'rgba(66, 133, 244, 0.14)',
    bg: 'rgba(66, 133, 244, 0.06)',
    iconName: 'GCP',
    desc: 'Google Cloud Platform é a plataforma de nuvem do Google, oferecendo serviços de computação, armazenamento, banco de dados e rede em escala global. Utilizo o GCP para complementar estratégias multi-cloud, explorando serviços como Compute Engine, GKE, Cloud Storage e Cloud Run para workloads específicos que se beneficiam da infraestrutura do Google.',
  },
  'aws': {
    name: 'AWS',
    category: 'Cloud',
    url: 'console.aws.amazon.com',
    color: '#ff9900',
    bgIcon: 'rgba(255, 153, 0, 0.14)',
    bg: 'rgba(255, 153, 0, 0.06)',
    iconName: 'AWS',
    desc: 'Amazon Web Services é a maior plataforma de nuvem do mundo, com centenas de serviços que cobrem computação, armazenamento, rede, banco de dados e segurança. Trabalho com AWS para provisionamento de infraestrutura, gerenciamento de EC2, S3, RDS, IAM e outros serviços essenciais, garantindo alta disponibilidade e escalabilidade das aplicações hospedadas.',
  },
  'kubernetes': {
    name: 'Kubernetes',
    category: 'Containers',
    color: '#326ce5',
    bgIcon: 'rgba(50, 108, 229, 0.14)',
    bg: 'rgba(50, 108, 229, 0.06)',
    iconName: 'Kubernetes',
    desc: 'Kubernetes é a plataforma de orquestração de containers mais utilizada no mundo. Gerencio clusters Kubernetes no Azure AKS para orquestrar workloads em produção, incluindo deployments, services, ingress controllers, HPA e configurações de namespaces. Realizo atualizações de cluster, troubleshooting de pods e monitoramento de recursos para garantir a estabilidade dos ambientes.',
  },
  'linux': {
    name: 'Linux',
    category: 'OS',
    color: '#f5a623',
    bgIcon: 'rgba(245, 166, 35, 0.14)',
    bg: 'rgba(245, 166, 35, 0.06)',
    iconName: 'Linux',
    desc: 'Linux é o sistema operacional base da infraestrutura moderna de TI e DevOps. Tenho ampla experiência com distribuições como Ubuntu, Debian e CentOS para administração de servidores, configuração de serviços, scripting com Bash, gerenciamento de permissões, análise de logs e troubleshooting de sistemas em ambientes de produção.',
  },
  'windows': {
    name: 'Windows Server',
    category: 'OS',
    color: '#00a1f1',
    bgIcon: 'rgba(0, 161, 241, 0.14)',
    bg: 'rgba(0, 161, 241, 0.06)',
    iconName: 'Windows Server',
    desc: 'Windows Server é a plataforma de servidor da Microsoft, fundamental para ambientes corporativos. Administro servidores Windows Server em versões 2016, 2019 e 2022, gerenciando Active Directory, DNS, DHCP, File Server, IIS e políticas de grupo (GPO). Também realizo atualizações, monitoramento de performance e suporte a aplicações que dependem do ecossistema Windows.',
  },
  'grafana': {
    name: 'Grafana',
    category: 'Monitoring',
    color: '#f46800',
    bgIcon: 'rgba(244, 104, 0, 0.14)',
    bg: 'rgba(244, 104, 0, 0.06)',
    iconName: 'Grafana',
    desc: 'Grafana é a plataforma líder em visualização e monitoramento de métricas e logs. Utilizo Grafana para criar dashboards de observabilidade conectados a fontes como Prometheus, Loki e Azure Monitor, possibilitando o acompanhamento em tempo real da saúde dos sistemas, alertas configurados e análise de performance de toda a infraestrutura.',
  },
  'rabbitmq': {
    name: 'RabbitMQ',
    category: 'Messaging',
    color: '#ff6600',
    bgIcon: 'rgba(255, 102, 0, 0.14)',
    bg: 'rgba(255, 102, 0, 0.06)',
    iconName: 'RabbitMQ',
    desc: 'RabbitMQ é um message broker open-source amplamente utilizado para comunicação assíncrona entre serviços. Gerencio instâncias RabbitMQ para garantir a entrega confiável de mensagens entre microsserviços, monitorando filas, consumers, exchanges e realizando tunning de performance para suportar o volume de mensagens dos sistemas em produção.',
  },
  'mongodb': {
    name: 'MongoDB',
    category: 'Database',
    color: '#47a248',
    bgIcon: 'rgba(71, 162, 72, 0.14)',
    bg: 'rgba(71, 162, 72, 0.06)',
    iconName: 'MongoDB',
    desc: 'MongoDB é o banco de dados NoSQL de documentos mais popular do mercado. Administro instâncias MongoDB gerenciando collections, índices, usuários e permissões, realizando backups e monitorando performance. Atuo também na análise de queries lentas e na otimização de operações para garantir a performance das aplicações que dependem do banco.',
  },
  'ad': {
    name: 'Active Directory',
    category: 'Identity',
    color: '#0078d4',
    bgIcon: 'rgba(0, 120, 212, 0.14)',
    bg: 'rgba(0, 120, 212, 0.06)',
    iconName: 'Active Directory',
    desc: 'Active Directory é o serviço de diretório da Microsoft, essencial para gerenciamento de identidades corporativas. Administro o AD gerenciando usuários, grupos, unidades organizacionais, políticas de grupo (GPO), delegações de permissão e integração com outros sistemas. Garanto a segurança das contas, controle de acesso e conformidade com as políticas da organização.',
  },
};

const initSkillIcons = () => {
  const extensions = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
  document.querySelectorAll('[data-skill-icon]').forEach(iconEl => {
    const name = iconEl.getAttribute('data-skill-icon');
    const tryLoad = (index) => {
      if (index >= extensions.length) return;
      const ext = extensions[index];
      const img = new Image();
      img.src = `/icons/${encodeURIComponent(name)}/icon.${ext}?v=1`;
      img.onload = () => {
        iconEl.innerHTML = '';
        const size = iconEl.classList.contains('skill-detail-icon-wrap') ? 30 : 22;
        img.width = size;
        img.height = size;
        img.alt = name;
        img.className = 'skill-custom-icon';
        iconEl.appendChild(img);
      };
      img.onerror = () => tryLoad(index + 1);
    };
    tryLoad(0);
  });
};

const initCertIcons = () => {
  const extensions = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
  document.querySelectorAll('[data-cert-icon]').forEach(iconEl => {
    const name = iconEl.getAttribute('data-cert-icon');
    const tryLoad = (index) => {
      if (index >= extensions.length) return;
      const ext = extensions[index];
      const img = new Image();
      img.src = `/icons/${encodeURIComponent(name)}/icon.${ext}?v=1`;
      img.onload = () => {
        iconEl.innerHTML = '';
        const size = iconEl.classList.contains('cert-icon-small') ? 16 : 22;
        img.width = size;
        img.height = size;
        img.alt = name;
        img.className = 'cert-custom-icon';
        iconEl.appendChild(img);
      };
      img.onerror = () => tryLoad(index + 1);
    };
    tryLoad(0);
  });
};


const setDescPanel = (key) => {
  const data = SKILL_DATA[key];
  if (!data) return;

  currentSkillKey = key;

  const nameEl = document.getElementById('skills-desc-name');
  const textEl = document.getElementById('skills-desc-text');
  const content = document.getElementById('skills-desc-content');

  if (!content) return;

  if (nameEl) {
    nameEl.textContent = data.name;
    nameEl.style.color = data.color;
  }

  if (textEl) {
    textEl.style.opacity = '0';
    requestAnimationFrame(() => {
      textEl.textContent = getSkillDesc(key);
      textEl.style.transition = 'opacity 260ms ease';
      textEl.style.opacity = '1';
    });
  }

  content.style.animation = 'none';
  content.offsetHeight;
  content.style.animation = 'skill-fade-in 260ms ease';
};

const initSkillsInteraction = () => {
  const cards = document.querySelectorAll('.skill-card[data-skill]');
  let defaultCard = null;

  cards.forEach(card => {
    const key = card.getAttribute('data-skill');
    const data = SKILL_DATA[key];
    if (data) {
      card.style.setProperty('--skill-color', data.color);
      card.style.setProperty('--skill-bg-icon', data.bgIcon);
      card.style.setProperty('--skill-bg', data.bg);
    }
    if (key === 'azure-devops') defaultCard = card;
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      setDescPanel(key);
    });
  });

  if (defaultCard) {
    defaultCard.classList.add('active');
    setDescPanel('azure-devops');
  }
};

const initSkillsCarousel = () => {
  const track = document.getElementById('skills-carousel-track');
  const dotsContainer = document.getElementById('skills-carousel-dots');
  const prevBtn = document.getElementById('skills-carousel-prev');
  const nextBtn = document.getElementById('skills-carousel-next');
  const descHeader = document.getElementById('skills-carousel-desc-header');
  const descIconEl = document.getElementById('skills-carousel-desc-icon');
  const descNameEl = document.getElementById('skills-carousel-desc-name');
  const descCatEl = document.getElementById('skills-carousel-desc-cat');
  const descTextEl = document.getElementById('skills-carousel-desc-text');

  if (!track) return;

  const skillKeys = Object.keys(SKILL_DATA);
  let current = 0;
  let autoTimer = null;

  skillKeys.forEach(key => {
    const data = SKILL_DATA[key];
    const slide = document.createElement('div');
    slide.className = 'skills-carousel-slide';
    slide.style.setProperty('--skill-color', data.color);
    slide.style.setProperty('--skill-bg-icon', data.bgIcon);
    slide.style.setProperty('--skill-bg', data.bg);

    slide.innerHTML = `
      <div class="skill-icon" data-skill-icon="${data.iconName}">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <span class="skill-name">${data.name}</span>
      <span class="skill-category">${data.category}</span>
    `;

    const iconEl = slide.querySelector('.skill-icon');
    const tryLoad = (i) => {
      const exts = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
      if (i >= exts.length) return;
      const img = new Image();
      img.src = `/icons/${encodeURIComponent(data.iconName)}/icon.${exts[i]}?v=1`;
      img.onload = () => {
        iconEl.innerHTML = '';
        img.width = 32; img.height = 32; img.alt = data.iconName;
        img.style.objectFit = 'contain';
        iconEl.appendChild(img);
      };
      img.onerror = () => tryLoad(i + 1);
    };
    tryLoad(0);

    track.appendChild(slide);
  });

  skillKeys.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'skills-carousel-dot';
    dot.setAttribute('aria-label', `Skill ${i + 1}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsContainer.appendChild(dot);
  });

  const updateDesc = (key) => {
    const data = SKILL_DATA[key];
    if (!data || !descTextEl) return;

    if (descIconEl) {
      descIconEl.style.backgroundColor = data.bgIcon;
      descIconEl.style.color = data.color;
      descIconEl.setAttribute('data-skill-icon', data.iconName);
      descIconEl.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/></svg>`;
      const tryLoad = (i) => {
        const exts = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
        if (i >= exts.length) return;
        const img = new Image();
        img.src = `/icons/${encodeURIComponent(data.iconName)}/icon.${exts[i]}?v=1`;
        img.onload = () => {
          descIconEl.innerHTML = '';
          img.width = 22; img.height = 22; img.alt = data.iconName;
          img.style.objectFit = 'contain';
          descIconEl.appendChild(img);
        };
        img.onerror = () => tryLoad(i + 1);
      };
      tryLoad(0);
    }

    if (descNameEl) descNameEl.textContent = data.name;
    if (descCatEl) descCatEl.textContent = data.category;

    if (descTextEl) {
      descTextEl.style.opacity = '0';
      setTimeout(() => {
        descTextEl.textContent = getSkillDesc(key);
        descTextEl.style.transition = 'opacity 300ms ease';
        descTextEl.style.opacity = '1';
      }, 120);
    }

    const descPanel = document.getElementById('skills-carousel-desc');
    if (descPanel) descPanel.style.borderColor = data.color;
  };

  const goTo = (idx, manual = false) => {
    current = (idx + skillKeys.length) % skillKeys.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    const slides = track.querySelectorAll('.skills-carousel-slide');
    const dots = dotsContainer.querySelectorAll('.skills-carousel-dot');
    const key = skillKeys[current];
    const data = SKILL_DATA[key];

    slides.forEach((s, i) => {
      if (i === current) {
        s.style.borderColor = data.color;
        s.style.backgroundColor = data.bg;
        s.querySelector('.skill-icon').style.backgroundColor = data.bgIcon;
        s.querySelector('.skill-icon').style.color = data.color;
        s.querySelector('.skill-name').style.color = data.color;
      } else {
        s.style.borderColor = '';
        s.style.backgroundColor = '';
        s.querySelector('.skill-icon').style.backgroundColor = '';
        s.querySelector('.skill-icon').style.color = '';
        s.querySelector('.skill-name').style.color = '';
      }
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      if (i === current) d.style.setProperty('--skill-dot-color', data.color);
    });

    currentSkillKey = key;
    updateDesc(key);

    if (manual) {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    }
  };

  prevBtn?.addEventListener('click', () => goTo(current - 1, true));
  nextBtn?.addEventListener('click', () => goTo(current + 1, true));

  goTo(0);
  autoTimer = setInterval(() => goTo(current + 1), 4500);

  const wrap = document.getElementById('skills-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    });
  }
};

const initLocationMap = () => {
  const card = document.getElementById('location-card');
  const popup = document.getElementById('map-popup');
  if (!card || !popup) return;

  card.addEventListener('mouseenter', () => {
    popup.removeAttribute('hidden');
  });

  card.addEventListener('mouseleave', (e) => {
    const to = e.relatedTarget;
    if (card.contains(to)) return;
    popup.setAttribute('hidden', '');
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

const initScrollReveal = () => {
  const selectors = [
    { sel: '.section-header', cls: 'reveal' },
    { sel: '.about-text', cls: 'reveal-left' },
    { sel: '.about-cards', cls: 'reveal-right' },
    { sel: '.skill-card', cls: 'reveal-scale' },
    { sel: '.cert-featured', cls: 'reveal' },
    { sel: '.timeline-item', cls: 'reveal' },
    { sel: '.contact-card', cls: 'reveal-scale' },
    { sel: '.card', cls: 'reveal' },
  ];

  selectors.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
};

const initCertsCarousel = () => {
  const track = document.getElementById('certs-carousel-track');
  if (!track) return;

  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');

    const iconEl = clone.querySelector('[data-cert-icon]');
    if (iconEl) {
      const name = iconEl.getAttribute('data-cert-icon');
      const extensions = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
      const tryLoad = (index) => {
        if (index >= extensions.length) return;
        const ext = extensions[index];
        const img = new Image();
        img.src = `/icons/${encodeURIComponent(name)}/icon.${ext}?v=1`;
        img.onload = () => {
          iconEl.innerHTML = '';
          const size = iconEl.classList.contains('cert-icon-small') ? 16 : 22;
          img.width = size;
          img.height = size;
          img.alt = name;
          img.className = 'cert-custom-icon';
          iconEl.appendChild(img);
        };
        img.onerror = () => tryLoad(index + 1);
      };
      tryLoad(0);
    }

    track.appendChild(clone);
  });

  track.style.animation = 'none';
  track.style.transform = 'translateX(0)';

  const SPEED_NORMAL = 0.7;
  const SPEED_SLOW = 0.1;
  const EASE_FACTOR = 0.04;

  let offset = 0;
  let currentSpeed = SPEED_NORMAL;
  let targetSpeed = SPEED_NORMAL;
  let halfWidth = 0;
  let lastTime = null;

  const wrapper = track.closest('.certs-carousel-wrapper');

  const measure = () => {
    halfWidth = track.scrollWidth / 2;
  };

  const tick = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    const delta = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;

    currentSpeed += (targetSpeed - currentSpeed) * EASE_FACTOR;

    offset += currentSpeed * delta / 16;
    if (offset >= halfWidth) offset -= halfWidth;

    track.style.transform = `translateX(-${offset}px)`;
    requestAnimationFrame(tick);
  };

  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => { targetSpeed = SPEED_SLOW; });
    wrapper.addEventListener('mouseleave', () => { targetSpeed = SPEED_NORMAL; });
  }

  measure();
  requestAnimationFrame(tick);
};

const initScrollTop = () => {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

const initAzureEasterEgg = () => {
  const trigger = document.getElementById('azure-cicd-egg');
  if (!trigger) return;

  let done = false;
  let animId = null;

  const spawnTrail = (x, y) => {
    const dot = document.createElement('div');
    dot.className = 'egg-trail';
    const size = 3 + Math.random() * 6;
    dot.style.left = `${x - size / 2}px`;
    dot.style.top = `${y - size / 2}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  };

  const cubicBezier = (p0, p1, p2, p3, t) => {
    const m = 1 - t;
    return {
      x: m*m*m*p0.x + 3*m*m*t*p1.x + 3*m*t*t*p2.x + t*t*t*p3.x,
      y: m*m*m*p0.y + 3*m*m*t*p1.y + 3*m*t*t*p2.y + t*t*t*p3.y,
    };
  };

  const lerpAngle = (a, b, t) => {
    let d = b - a;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return a + d * t;
  };

  const burstBubble = (bx, by) => {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const shard = document.createElement('div');
      shard.className = 'egg-shard';
      const spread = (Math.PI / 3);
      const baseAngle = -Math.PI / 4;
      const angle = baseAngle - spread / 2 + (i / (count - 1)) * spread;
      const dist  = 60 + Math.random() * 80;
      shard.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      shard.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      const size = 4 + Math.random() * 6;
      shard.style.width  = `${size}px`;
      shard.style.height = `${size}px`;
      shard.style.left   = `${bx}px`;
      shard.style.top    = `${by}px`;
      document.body.appendChild(shard);
      setTimeout(() => shard.remove(), 700);
    }

    const ring = document.createElement('div');
    ring.className = 'egg-ring';
    ring.style.left = `${bx}px`;
    ring.style.top  = `${by}px`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 600);
  };

  const handleClick = () => {
    if (done) return;
    done = true;

    trigger.style.opacity = '0.4';
    trigger.removeEventListener('click', handleClick);

    const iconImg = trigger.querySelector('img.cert-custom-icon');
    const iconEl  = iconImg || trigger.querySelector('svg');
    const iconRect = iconEl ? iconEl.getBoundingClientRect() : trigger.getBoundingClientRect();
    const ox = iconRect.left + iconRect.width  / 2;
    const oy = iconRect.top  + iconRect.height / 2;
    const iconSize = Math.max(iconRect.width, iconRect.height, 22);
    const half = iconSize / 2;

    const header = document.querySelector('header') || document.querySelector('nav');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 60;
    const ty = headerBottom + half;

    const ghost = document.createElement('div');
    ghost.className = 'egg-ghost';
    ghost.appendChild(iconEl.cloneNode(true));
    ghost.style.left    = `${ox - half}px`;
    ghost.style.top     = `${oy - half}px`;
    ghost.style.opacity = '1';
    document.body.appendChild(ghost);

    const vertDist = oy - ty;
    const horizDist = vertDist;
    const tx = ox + horizDist;
    const RISE_MS = Math.max(400, vertDist * 0.9);
    const t0 = performance.now();

    const step = (now) => {
      const el = now - t0;
      const p  = Math.min(el / RISE_MS, 1);
      const e  = p * p * (3 - 2 * p);

      const cx = ox + (tx - ox) * e;
      const cy = oy + (ty - oy) * e;

      ghost.style.left = `${cx - half}px`;
      ghost.style.top  = `${cy - half}px`;

      if (Math.random() < 0.55) spawnTrail(cx, cy);

      if (p >= 1) {
        ghost.style.opacity = '0';
        ghost.remove();
        burstBubble(tx, ty);
        trigger.style.opacity = '';
        trigger.classList.add('egg-done');
        return;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
  };

  trigger.addEventListener('click', handleClick);
};

const init = () => {
  initTheme();
  initLang();
  initTypewriter();
  initThemeToggle();
  initLangToggle();
  initMobileMenu();
  initScrollHeader();
  initSmoothScroll();
  initYear();
  initAccordion();
  initLocationMap();
  initSkillIcons();
  initCertIcons();
  initSkillsInteraction();
  initSkillsCarousel();
  initCertsCarousel();
  initScrollReveal();
  initTimelineDot();
  initContactModal();
  initScrollTop();
  initAzureEasterEgg();
  handleDeepLink();
};

const initTimelineDot = () => {
  const dot = document.getElementById('timeline-dot-floating');
  const timeline = dot && dot.closest('.timeline');
  if (!dot || !timeline) return;

  const items = Array.from(timeline.querySelectorAll('.timeline-item'));
  if (!items.length) return;

  let activeIndex = 0;
  let targetY = 0;
  let currentY = 0;
  let rafId = null;
  let leaveTimer = null;

  const getDotY = (item) => {
    const timelineRect = timeline.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return itemRect.top - timelineRect.top + itemRect.height / 2 - dot.offsetHeight / 2;
  };

  const snapToItem = (index) => {
    activeIndex = index;
    targetY = getDotY(items[index]);
  };

  const animate = () => {
    const diff = targetY - currentY;
    if (Math.abs(diff) > 0.3) {
      currentY += diff * 0.22;
      dot.style.top = currentY + 'px';
      rafId = requestAnimationFrame(animate);
    } else {
      currentY = targetY;
      dot.style.top = currentY + 'px';
      rafId = null;
    }
  };

  const moveTo = (index) => {
    snapToItem(index);
    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  const initPosition = () => {
    currentY = getDotY(items[0]);
    targetY = currentY;
    dot.style.top = currentY + 'px';
  };

  items.forEach((item, i) => {
    const card = item.querySelector('.timeline-card');
    if (!card) return;

    card.addEventListener('mouseenter', () => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      moveTo(i);
    });

    card.addEventListener('mouseleave', (e) => {
      const to = e.relatedTarget;
      const goingToCard = to && to.closest('.timeline-card');

      if (goingToCard) return;

      const rect = card.getBoundingClientRect();
      const goingLeft = e.clientX <= rect.left;
      const goingRight = e.clientX >= rect.right;
      const goingUp = e.clientY < rect.top;
      const goingDown = e.clientY > rect.bottom;

      const isFirst = i === 0;
      const isLast = i === items.length - 1;

      const shouldReset =
        goingLeft ||
        goingRight ||
        (goingUp && isFirst) ||
        (goingDown && isLast);

      if (shouldReset) {
        leaveTimer = setTimeout(() => {
          moveTo(0);
          leaveTimer = null;
        }, 80);
      }
    });
  });

  initPosition();
  window.addEventListener('resize', () => {
    currentY = getDotY(items[activeIndex]);
    targetY = currentY;
    dot.style.top = currentY + 'px';
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
