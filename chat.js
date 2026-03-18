const TOPICS = {
  'pt-BR': {
    start: {
      message: 'Olá! 👋 Sou o assistente virtual do Leandro. Por onde quer começar?',
      options: [
        { label: 'Quem é o Leandro?', next: 'about' },
        { label: 'Resumo rápido do perfil', next: 'full_summary' },
        { label: 'Trajetória profissional', next: 'experience' },
        { label: 'Tecnologias e habilidades', next: 'skills' },
        { label: 'Formação e certificações', next: 'education' },
        { label: 'Quero entrar em contato', next: 'contact', type: 'contact' },
      ],
    },
    about: {
      message: 'Claro! O Leandro Severo é um profissional de DevOps que atua em Curitiba, PR. Atualmente, ele é Supervisor de DevOps na Employer Tudo do RH, onde lidera times de engenharia e define estratégias de infraestrutura, automação e alta disponibilidade.',
      options: [
        { label: 'Ver resumo rápido do perfil', next: 'full_summary' },
        { label: 'Trajetória profissional', next: 'experience' },
        { label: 'Tecnologias que domina', next: 'skills' },
        { label: 'Falar com ele', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    full_summary: {
      message: 'Aqui vai um pitch rápido 🚀\n\nLeandro tem mais de 4 anos de experiência em infraestrutura e DevOps, com foco em cloud (AWS, Azure, GCP), automação de pipelines CI/CD e orquestração de containers com Kubernetes. Hoje lidera o time de DevOps da Employer Tudo do RH, combinando visão técnica com gestão de pessoas — formação em ADS e pós em Gestão de Pessoas.',
      options: [
        { label: 'Ver trajetória completa', next: 'experience' },
        { label: 'Tecnologias em detalhes', next: 'skills' },
        { label: 'Certificações', next: 'certs' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    experience: {
      message: 'Aqui está a trajetória do Leandro:\n\n• Supervisor de DevOps – Employer Tudo do RH (Jul 2025 – Presente)\n• Analista DevOps – Employer (Set 2024 – Jul 2025)\n• Analista de Infraestrutura TI – Employer (Fev 2023 – Set 2024)\n• Helpdesk e Telecom – Employer (Fev 2022 – Fev 2023)\n• Telecom – Employer (Jun 2021 – Fev 2022)\n• Soldado – Exército Brasileiro (Fev 2018 – Fev 2021)',
      options: [
        { label: 'Detalhar o cargo atual', next: 'current_role' },
        { label: 'Stacks que utiliza', next: 'skills' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    current_role: {
      message: 'No cargo atual, Leandro lidera o time de DevOps na Employer, definindo a estratégia de infraestrutura cloud, construindo pipelines CI/CD e garantindo alta disponibilidade dos sistemas. No dia a dia trabalha com AWS, Azure, Kubernetes (AKS) para orquestração e Docker para containerização.',
      options: [
        { label: 'Ver todas as tecnologias', next: 'skills' },
        { label: 'Ver trajetória completa', next: 'experience' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    skills: {
      message: 'Boa escolha! Aqui estão as principais tecnologias:\n\n☁️ Cloud: AWS, Azure, GCP\n🐳 Containers: Docker\n🔧 Orquestração: Kubernetes (AKS)\n🖥️ Sistemas: Linux, Windows Server\n📊 Monitoramento: Grafana\n🗄️ Banco de dados: MongoDB\n🔐 Segurança: Fortinet\n⚙️ CI/CD: Azure DevOps\n💾 Backup: Veeam\n📨 Mensageria: RabbitMQ',
      options: [
        { label: 'Ver certificações', next: 'certs' },
        { label: 'Ver trajetória profissional', next: 'experience' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    education: {
      message: 'A formação do Leandro une técnica e liderança:\n\n🎓 Análise e Desenvolvimento de Sistemas – UNICURITIBA\n📚 Pós-graduação em Gestão de Pessoas – PUCPR\n\nEssa combinação é o que permite entregar soluções robustas e liderar times com clareza.',
      options: [
        { label: 'Ver certificações', next: 'certs' },
        { label: 'Tecnologias que domina', next: 'skills' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    certs: {
      message: 'Aqui estão as certificações mais relevantes:\n\n🛡️ Fortinet Certified Associate Cybersecurity\n☁️ Azure DevOps – CI/CD (Udemy)\n☁️ AWS Cloud Essentials (Amazon)\n🔒 Fortinet NSE 1 & 2\n🌐 Arquitetura de Redes\n🖥️ Active Directory – Do Zero ao Avançado\n🏅 Liderança Inovadora (STF)\n🔐 Segurança da Informação (Bradesco)',
      options: [
        { label: 'Ver formação acadêmica', next: 'education' },
        { label: 'Tecnologias que usa', next: 'skills' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    contact: {
      message: 'Ótimo! O Leandro está aberto a novos desafios, oportunidades e colaborações. Escolha o canal que preferir: 🤝',
      options: [
        { label: '💼 LinkedIn', next: 'contact', type: 'link', url: 'https://www.linkedin.com/in/leandrosevero' },
        { label: '📧 Enviar e-mail', next: 'contact', type: 'open-contact-modal' },
        { label: '📷 Instagram', next: 'contact', type: 'link', url: 'https://www.instagram.com/leeandro.sv/' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    fallback: {
      message: 'Hmm, não encontrei essa informação. Mas posso te ajudar com outras coisas sobre o Leandro!',
      options: [
        { label: 'Ver resumo do perfil', next: 'full_summary' },
        { label: 'Trajetória profissional', next: 'experience' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
        { label: '← Voltar ao início', next: 'start', type: 'back' },
      ],
    },
    redirect: 'Feito! Redirecionando agora. Posso te ajudar com mais alguma coisa?',
    assistantName: 'Assistente do Leandro',
    onlineStatus: 'Online agora',
  },
  en: {
    start: {
      message: "Hey there! 👋 I'm Leandro's virtual assistant. What would you like to know?",
      options: [
        { label: 'Who is Leandro?', next: 'about' },
        { label: 'Quick profile summary', next: 'full_summary' },
        { label: 'Professional experience', next: 'experience' },
        { label: 'Technologies & skills', next: 'skills' },
        { label: 'Education & certifications', next: 'education' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
      ],
    },
    about: {
      message: "Sure! Leandro Severo is a DevOps professional based in Curitiba, Brazil. He currently works as DevOps Supervisor at Employer Tudo do RH, leading engineering teams and shaping the company's infrastructure, automation and high-availability strategy.",
      options: [
        { label: 'See quick profile summary', next: 'full_summary' },
        { label: 'Career timeline', next: 'experience' },
        { label: 'Tech stack', next: 'skills' },
        { label: 'Reach out to him', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    full_summary: {
      message: "Here's a quick pitch 🚀\n\nLeandro has 4+ years in infrastructure and DevOps, focused on cloud (AWS, Azure, GCP), CI/CD pipeline automation, and container orchestration with Kubernetes. Today he leads the DevOps team at Employer Tudo do RH, combining strong technical vision with people management skills — backed by a degree in Systems Analysis and a postgrad in People Management.",
      options: [
        { label: 'Full career timeline', next: 'experience' },
        { label: 'Technologies in detail', next: 'skills' },
        { label: 'Certifications', next: 'certs' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    experience: {
      message: "Here's Leandro's career timeline:\n\n• DevOps Supervisor – Employer Tudo do RH (Jul 2025 – Present)\n• DevOps Analyst – Employer (Sep 2024 – Jul 2025)\n• IT Infrastructure Analyst – Employer (Feb 2023 – Sep 2024)\n• Helpdesk & Telecom – Employer (Feb 2022 – Feb 2023)\n• Telecom – Employer (Jun 2021 – Feb 2022)\n• Soldier – Brazilian Army (Feb 2018 – Feb 2021)",
      options: [
        { label: 'Current role in detail', next: 'current_role' },
        { label: 'Tech stack he uses', next: 'skills' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    current_role: {
      message: "In his current role, Leandro leads the DevOps team at Employer, defining cloud infrastructure strategy, building CI/CD pipelines and ensuring system high availability. He works daily with AWS, Azure, Kubernetes (AKS) for orchestration and Docker for containerization.",
      options: [
        { label: 'All technologies', next: 'skills' },
        { label: 'Full career timeline', next: 'experience' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    skills: {
      message: "Good choice! Here's his core tech stack:\n\n☁️ Cloud: AWS, Azure, GCP\n🐳 Containers: Docker\n🔧 Orchestration: Kubernetes (AKS)\n🖥️ OS: Linux, Windows Server\n📊 Monitoring: Grafana\n🗄️ Database: MongoDB\n🔐 Security: Fortinet\n⚙️ CI/CD: Azure DevOps\n💾 Backup: Veeam\n📨 Messaging: RabbitMQ",
      options: [
        { label: 'View certifications', next: 'certs' },
        { label: 'Career timeline', next: 'experience' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    education: {
      message: "Leandro's background blends tech and leadership:\n\n🎓 Systems Analysis and Development – UNICURITIBA\n📚 Postgraduate in People Management – PUCPR\n\nThis mix is what allows him to deliver robust solutions while leading teams effectively.",
      options: [
        { label: 'View certifications', next: 'certs' },
        { label: 'Tech stack', next: 'skills' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    certs: {
      message: "Here are his most relevant certifications:\n\n🛡️ Fortinet Certified Associate Cybersecurity\n☁️ Azure DevOps – CI/CD (Udemy)\n☁️ AWS Cloud Essentials (Amazon)\n🔒 Fortinet NSE 1 & 2\n🌐 Network Architecture\n🖥️ Active Directory – Zero to Advanced\n🏅 Innovative Leadership (STF)\n🔐 Information Security (Bradesco)",
      options: [
        { label: 'Academic background', next: 'education' },
        { label: 'Tech stack', next: 'skills' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    contact: {
      message: "Great! Leandro is open to new challenges, opportunities and collaborations. Pick your preferred channel: 🤝",
      options: [
        { label: '💼 LinkedIn', next: 'contact', type: 'link', url: 'https://www.linkedin.com/in/leandrosevero' },
        { label: '📧 Send an email', next: 'contact', type: 'open-contact-modal' },
        { label: '📷 Instagram', next: 'contact', type: 'link', url: 'https://www.instagram.com/leeandro.sv/' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    fallback: {
      message: "Hmm, I couldn't find that. But I can help you with other things about Leandro!",
      options: [
        { label: 'Quick profile summary', next: 'full_summary' },
        { label: 'Career timeline', next: 'experience' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
        { label: '← Back to start', next: 'start', type: 'back' },
      ],
    },
    redirect: "Done! Redirecting now. Can I help with anything else?",
    assistantName: "Leandro's Assistant",
    onlineStatus: 'Online now',
  },
};

const fab = document.getElementById('chat-fab');
const floatPanel = document.getElementById('chat-float');
const closeBtn = document.getElementById('chat-close-btn');
const soundBtn = document.getElementById('chat-sound-btn');
const soundIconOn = document.getElementById('chat-sound-icon-on');
const soundIconOff = document.getElementById('chat-sound-icon-off');
const messagesEl = document.getElementById('chat-messages');
const optionsEl = document.getElementById('chat-options');
const badge = document.getElementById('chat-fab-badge');
const headerName = floatPanel ? floatPanel.querySelector('.chat-header-name') : null;
const headerStatus = floatPanel ? floatPanel.querySelector('.chat-header-status') : null;
const suggestionBubble = document.getElementById('chat-suggestion-bubble');

let chatInitialized = false;
let isOpen = false;
let suggestionShown = false;
let idleTimer = null;
let suggestionDismissTimer = null;
let soundEnabled = true;

const updateSoundIcon = () => {
  if (!soundIconOn || !soundIconOff) return;
  soundIconOn.style.display = soundEnabled ? '' : 'none';
  soundIconOff.style.display = soundEnabled ? 'none' : '';
};

let voicesLoaded = false;

const loadVoices = () => new Promise((resolve) => {
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) { voicesLoaded = true; resolve(voices); return; }
  speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    resolve(speechSynthesis.getVoices());
  };
});

const pickVoice = (voices, lang) => {
  if (lang === 'pt-BR') {
    return (
      voices.find(v => v.name === 'Google português do Brasil') ||
      voices.find(v => v.name.includes('Microsoft Maria')) ||
      voices.find(v => v.lang === 'pt-BR') ||
      voices.find(v => v.lang.startsWith('pt')) ||
      null
    );
  }
  return (
    voices.find(v => v.name.toLowerCase().includes('google') && (v.lang === 'en-US' || v.lang === 'en-GB')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en')) ||
    null
  );
};

const speak = async (text) => {
  if (!soundEnabled || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const clean = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return;
  const voices = await loadVoices();
  const lang = getLang() === 'en' ? 'en-US' : 'pt-BR';
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = lang;
  utter.voice = pickVoice(voices, lang);
  utter.rate = lang === 'pt-BR' ? 0.95 : 1;
  utter.pitch = 1;
  speechSynthesis.speak(utter);
};

let soundHintShown = false;
let soundHintTimer = null;

const animateSoundIcon = () => {
  if (!soundBtn) return;
  soundBtn.classList.remove('sound-animate');
  void soundBtn.offsetWidth;
  soundBtn.classList.add('sound-animate');
  setTimeout(() => soundBtn.classList.remove('sound-animate'), 1300);
};

const showSoundToast = () => {
  const toast = document.getElementById('chat-sound-toast');
  if (!toast) return;
  toast.removeAttribute('hidden');
  toast.classList.remove('toast-hiding');
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.setAttribute('hidden', ''), 380);
  }, 7500);
};

const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('chat-sound', soundEnabled ? 'on' : 'off');
  if (!soundEnabled) speechSynthesis.cancel();
  updateSoundIcon();
};

const SUGGESTION_MESSAGES = {
  'pt-BR': 'Quer saber mais sobre o Leandro? Posso te contar sobre a experiência, habilidades e certificações dele!',
  en: 'Want to know more about Leandro? I can tell you about his experience, skills and certifications!',
};

const showSuggestionBubble = () => {
  if (suggestionShown || isOpen || !fab || fab.hasAttribute('hidden')) return;
  suggestionShown = true;
  const lang = getLang();
  const msg = SUGGESTION_MESSAGES[lang] || SUGGESTION_MESSAGES['pt-BR'];
  suggestionBubble.textContent = msg;
  suggestionBubble.removeAttribute('hidden');
  suggestionBubble.classList.add('chat-suggestion-visible');
  if (badge) badge.style.animation = 'none';
  if (suggestionDismissTimer) clearTimeout(suggestionDismissTimer);
  suggestionDismissTimer = setTimeout(hideSuggestionBubble, 8000);
};

const hideSuggestionBubble = () => {
  if (!suggestionBubble) return;
  suggestionBubble.classList.remove('chat-suggestion-visible');
  setTimeout(() => suggestionBubble.setAttribute('hidden', ''), 350);
};

const resetIdleTimer = () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!isOpen && !suggestionShown) showSuggestionBubble();
  }, 30000);
};

const setFabIcon = (open) => {
  const icon = fab.querySelector('.chat-fab-icon');
  const arrow = fab.querySelector('.chat-fab-arrow');
  if (!icon || !arrow) return;
  if (open) {
    icon.style.display = 'none';
    arrow.style.display = '';
  } else {
    icon.style.display = '';
    arrow.style.display = 'none';
  }
};

const getLang = () => localStorage.getItem('lang') || 'pt-BR';
const getTopics = () => TOPICS[getLang()] || TOPICS['pt-BR'];

const getChatAvatarSrc = () => {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? '/atendimentoescuro.svg' : '/atendimento.svg';
};

const addBotBubble = (text) => {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `
    <div class="chat-bubble-avatar">
      <img src="${getChatAvatarSrc()}" alt="Bot">
    </div>
    <div class="chat-bubble-text">${text.replace(/\n/g, '<br>')}</div>
  `;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  speak(text);
};

const addUserBubble = (text) => {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-bubble';
  bubble.innerHTML = `<div class="chat-bubble-text">${text}</div>`;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const showTyping = () => {
  const typing = document.createElement('div');
  typing.className = 'chat-bubble';
  typing.id = 'typing-indicator';
  typing.innerHTML = `
    <div class="chat-bubble-avatar">
      <img src="${getChatAvatarSrc()}" alt="Bot">
    </div>
    <div class="chat-typing">
      <span></span><span></span><span></span>
    </div>
  `;
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const removeTyping = () => {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
};

const renderOptions = (options) => {
  optionsEl.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-option-btn';
    if (opt.type === 'contact' || opt.type === 'link') btn.classList.add('contact-btn');
    if (opt.type === 'back') btn.classList.add('back-btn');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => handleOption(opt));
    optionsEl.appendChild(btn);
  });
};

const handleOption = (opt) => {
  if (opt.type === 'open-contact-modal') {
    addUserBubble(opt.label);
    optionsEl.innerHTML = '';
    setTimeout(() => {
      const trigger = document.querySelector('[data-open-contact-modal]');
      if (trigger) trigger.click();
      const onModalClose = () => {
        document.removeEventListener('contact-modal-closed', onModalClose);
        openChat();
        showTyping();
        setTimeout(() => {
          removeTyping();
          addBotBubble(getTopics().redirect);
          renderOptions(getTopics().contact.options);
        }, 800);
      };
      document.addEventListener('contact-modal-closed', onModalClose);
    }, 300);
    return;
  }

  if (opt.type === 'link') {
    addUserBubble(opt.label);
    optionsEl.innerHTML = '';
    setTimeout(() => {
      window.open(opt.url, '_blank', 'noopener,noreferrer');
      showTyping();
      setTimeout(() => {
        removeTyping();
        addBotBubble(getTopics().redirect);
        renderOptions(getTopics().contact.options);
      }, 900);
    }, 300);
    return;
  }

  addUserBubble(opt.label);
  optionsEl.innerHTML = '';

  showTyping();
  setTimeout(() => {
    removeTyping();
    const topics = getTopics();
    const topic = topics[opt.next] || topics.fallback;
    if (topic) {
      addBotBubble(topic.message);
      renderOptions(topic.options);
    }
  }, 800);
};

const updateHeaderLabels = () => {
  const t = getTopics();
  if (headerName) headerName.textContent = t.assistantName;
  if (headerStatus) headerStatus.textContent = t.onlineStatus;
};

const resetChat = () => {
  chatInitialized = false;
  if (messagesEl) messagesEl.innerHTML = '';
  if (optionsEl) optionsEl.innerHTML = '';
  updateHeaderLabels();
  if (isOpen) startChat();
};

const startChat = () => {
  chatInitialized = true;
  showTyping();
  setTimeout(() => {
    removeTyping();
    const t = getTopics();
    addBotBubble(t.start.message);
    renderOptions(t.start.options);
  }, 700);
};

const openChat = () => {
  isOpen = true;
  hideSuggestionBubble();
  floatPanel.removeAttribute('hidden');
  setFabIcon(true);
  if (badge) badge.remove();
  if (!chatInitialized) {
    updateHeaderLabels();
    startChat();
  }
  if (!soundHintShown) {
    soundHintShown = true;
    soundHintTimer = setTimeout(() => {
      soundHintTimer = null;
      if (soundEnabled && isOpen) {
        animateSoundIcon();
        showSoundToast();
      }
    }, 1200);
  }
};

const closeChat = () => {
  isOpen = false;
  floatPanel.setAttribute('hidden', '');
  setFabIcon(false);
  if (soundHintTimer) {
    clearTimeout(soundHintTimer);
    soundHintTimer = null;
  }
  const toast = document.getElementById('chat-sound-toast');
  if (toast) {
    toast.classList.remove('toast-hiding');
    toast.setAttribute('hidden', '');
  }
};

const showFab = () => {
  fab.removeAttribute('hidden');
  resetIdleTimer();
};

const initChatWidget = () => {
  if (!fab || !floatPanel) return;

  updateSoundIcon();
  if (soundBtn) soundBtn.addEventListener('click', toggleSound);

  updateHeaderLabels();

  fab.addEventListener('click', () => {
    isOpen ? closeChat() : openChat();
  });

  if (suggestionBubble) {
    suggestionBubble.addEventListener('click', () => {
      hideSuggestionBubble();
      openChat();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  [document.getElementById('lang-toggle'), document.getElementById('lang-toggle-mobile')]
    .forEach(btn => btn && btn.addEventListener('click', () => {
      setTimeout(resetChat, 50);
    }));

  document.addEventListener('mousemove', resetIdleTimer, { passive: true });
  document.addEventListener('keydown', resetIdleTimer, { passive: true });
  document.addEventListener('touchstart', resetIdleTimer, { passive: true });

  let scrollTriggered = false;
  window.addEventListener('scroll', () => {
    if (!scrollTriggered && window.scrollY > 300 && !isOpen && !suggestionShown) {
      scrollTriggered = true;
      setTimeout(showSuggestionBubble, 1500);
    }
    resetIdleTimer();
  }, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          showFab();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    observer.observe(heroSection);
  } else {
    showFab();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
  initChatWidget();
}
