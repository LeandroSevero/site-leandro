const TOPICS = {
  'pt-BR': {
    start: {
      message: 'Olá! Sou o assistente virtual do Leandro. Fico feliz em te apresentar um pouco sobre ele. O que você gostaria de saber?',
      options: [
        { label: 'Quem é o Leandro?', next: 'about' },
        { label: 'Experiência profissional', next: 'experience' },
        { label: 'Tecnologias e habilidades', next: 'skills' },
        { label: 'Formação acadêmica', next: 'education' },
        { label: 'Certificações', next: 'certs' },
        { label: 'Entrar em contato', next: 'contact', type: 'contact' },
      ],
    },
    about: {
      message: 'Leandro Severo é um profissional de DevOps baseado em Curitiba - PR, Brasil. Atualmente atua como Supervisor de DevOps na Employer Tudo do RH, liderando equipes de engenharia e definindo estratégias de infraestrutura, automação e alta disponibilidade.',
      options: [
        { label: 'Onde ele trabalhou?', next: 'experience' },
        { label: 'Quais são as habilidades?', next: 'skills' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    experience: {
      message: 'Trajetória profissional:\n\n• Supervisor de DevOps – Employer (Jul 2025 - Presente)\n• DevOps – Employer (Set 2024 - Jul 2025)\n• Analista de Infra TI – Employer (Fev 2023 - Set 2024)\n• Helpdesk e Telecom – Employer (Fev 2022 - Fev 2023)\n• Telecom – Employer (Jun 2021 - Fev 2022)\n• Soldado – Exército Brasileiro (Fev 2018 - Fev 2021)',
      options: [
        { label: 'Cargo atual em detalhes', next: 'current_role' },
        { label: 'Habilidades utilizadas', next: 'skills' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    current_role: {
      message: 'Como Supervisor de DevOps na Employer Tudo do RH, o Leandro lidera a equipe definindo estratégias de infraestrutura cloud, automatizando processos com pipelines CI/CD e garantindo alta disponibilidade. Trabalha com AWS, Azure, Kubernetes e Docker no dia a dia.',
      options: [
        { label: 'Tecnologias que usa', next: 'skills' },
        { label: 'Ver toda a trajetória', next: 'experience' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    skills: {
      message: 'Principais tecnologias:\n\n☁️ Cloud: AWS, Azure, GCP\n🐳 Containers: Docker, Kubernetes (AKS)\n🖥️ Sistemas: Linux, Windows Server\n📊 Monitoramento: Elastic Stack\n🗄️ Banco de dados: MongoDB\n🔐 Segurança: Fortinet\n⚙️ CI/CD: Azure DevOps\n💾 Backup: Veeam\n📨 Mensageria: RabbitMQ',
      options: [
        { label: 'Ver certificações', next: 'certs' },
        { label: 'Experiência prática', next: 'experience' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    education: {
      message: 'Formação acadêmica:\n\n🎓 Análise e Desenvolvimento de Sistemas – UNICURITIBA\n📚 Pós-graduação em Gestão de Pessoas – PUCPR\n\nEssa combinação técnica e de gestão permite liderar equipes com excelência.',
      options: [
        { label: 'Ver certificações', next: 'certs' },
        { label: 'Quais habilidades tem?', next: 'skills' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    certs: {
      message: 'Certificações relevantes:\n\n🛡️ Fortinet Certified Associate Cybersecurity\n☁️ Azure DevOps – CI/CD (Udemy)\n☁️ AWS Cloud Essentials (Amazon)\n🔒 Fortinet NSE 1 & 2\n🌐 Arquitetura de Redes\n🖥️ Active Directory Avançado\n🏅 Liderança Inovadora (STF)\n🔐 Segurança da Informação (Bradesco)',
      options: [
        { label: 'Formação acadêmica', next: 'education' },
        { label: 'Habilidades técnicas', next: 'skills' },
        { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    contact: {
      message: 'O Leandro está aberto a novas oportunidades e colaborações. Escolha como prefere entrar em contato:',
      options: [
        { label: '💼 LinkedIn', next: 'contact', type: 'link', url: 'https://www.linkedin.com/in/leandrosevero' },
        { label: '📧 E-mail', next: 'contact', type: 'link', url: 'mailto:leandroolise@gmail.com' },
        { label: '📷 Instagram', next: 'contact', type: 'link', url: 'https://www.instagram.com/leeandro.sv/' },
        { label: '← Início', next: 'start', type: 'back' },
      ],
    },
    redirect: 'Ótimo! Redirecionando você agora. Mais alguma coisa?',
    assistantName: 'Assistente do Leandro',
    onlineStatus: 'Online agora',
  },
  en: {
    start: {
      message: "Hi! I'm Leandro's virtual assistant. I'd love to tell you a bit about him. What would you like to know?",
      options: [
        { label: 'Who is Leandro?', next: 'about' },
        { label: 'Professional experience', next: 'experience' },
        { label: 'Technologies & skills', next: 'skills' },
        { label: 'Academic background', next: 'education' },
        { label: 'Certifications', next: 'certs' },
        { label: 'Get in touch', next: 'contact', type: 'contact' },
      ],
    },
    about: {
      message: 'Leandro Severo is a DevOps professional based in Curitiba - PR, Brazil. He currently works as DevOps Supervisor at Employer Tudo do RH, leading engineering teams and defining strategies for infrastructure, automation and high availability.',
      options: [
        { label: 'Where has he worked?', next: 'experience' },
        { label: 'What are his skills?', next: 'skills' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    experience: {
      message: 'Professional journey:\n\n• DevOps Supervisor – Employer (Jul 2025 - Present)\n• DevOps – Employer (Sep 2024 - Jul 2025)\n• IT Infrastructure Analyst – Employer (Feb 2023 - Sep 2024)\n• Helpdesk & Telecom – Employer (Feb 2022 - Feb 2023)\n• Telecom – Employer (Jun 2021 - Feb 2022)\n• Soldier – Brazilian Army (Feb 2018 - Feb 2021)',
      options: [
        { label: 'Current role in detail', next: 'current_role' },
        { label: 'Skills used', next: 'skills' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    current_role: {
      message: 'As DevOps Supervisor at Employer Tudo do RH, Leandro leads the team defining cloud infrastructure strategies, automating processes with CI/CD pipelines, and ensuring high availability. He works with AWS, Azure, Kubernetes and Docker daily.',
      options: [
        { label: 'Technologies he uses', next: 'skills' },
        { label: 'Full career timeline', next: 'experience' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    skills: {
      message: 'Core technologies:\n\n☁️ Cloud: AWS, Azure, GCP\n🐳 Containers: Docker, Kubernetes (AKS)\n🖥️ OS: Linux, Windows Server\n📊 Monitoring: Elastic Stack\n🗄️ Database: MongoDB\n🔐 Security: Fortinet\n⚙️ CI/CD: Azure DevOps\n💾 Backup: Veeam\n📨 Messaging: RabbitMQ',
      options: [
        { label: 'View certifications', next: 'certs' },
        { label: 'Practical experience', next: 'experience' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    education: {
      message: 'Academic background:\n\n🎓 Systems Analysis and Development – UNICURITIBA\n📚 Postgraduate in People Management – PUCPR\n\nThis combination of technical and management education allows him to lead teams with excellence.',
      options: [
        { label: 'View certifications', next: 'certs' },
        { label: 'What skills does he have?', next: 'skills' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    certs: {
      message: 'Key certifications:\n\n🛡️ Fortinet Certified Associate Cybersecurity\n☁️ Azure DevOps – CI/CD (Udemy)\n☁️ AWS Cloud Essentials (Amazon)\n🔒 Fortinet NSE 1 & 2\n🌐 Network Architecture\n🖥️ Active Directory Advanced\n🏅 Innovative Leadership (STF)\n🔐 Information Security (Bradesco)',
      options: [
        { label: 'Academic background', next: 'education' },
        { label: 'Technical skills', next: 'skills' },
        { label: 'Talk to Leandro', next: 'contact', type: 'contact' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    contact: {
      message: "Leandro is open to new opportunities and collaborations. How would you like to get in touch?",
      options: [
        { label: '💼 LinkedIn', next: 'contact', type: 'link', url: 'https://www.linkedin.com/in/leandrosevero' },
        { label: '📧 Email', next: 'contact', type: 'link', url: 'mailto:leandroolise@gmail.com' },
        { label: '📷 Instagram', next: 'contact', type: 'link', url: 'https://www.instagram.com/leeandro.sv/' },
        { label: '← Back', next: 'start', type: 'back' },
      ],
    },
    redirect: "Great! Redirecting you now. Anything else?",
    assistantName: "Leandro's Assistant",
    onlineStatus: 'Online now',
  },
};

const fab = document.getElementById('chat-fab');
const floatPanel = document.getElementById('chat-float');
const closeBtn = document.getElementById('chat-close-btn');
const messagesEl = document.getElementById('chat-messages');
const optionsEl = document.getElementById('chat-options');
const badge = document.getElementById('chat-fab-badge');
const headerName = floatPanel ? floatPanel.querySelector('.chat-header-name') : null;
const headerStatus = floatPanel ? floatPanel.querySelector('.chat-header-status') : null;

let chatInitialized = false;
let isOpen = false;

const getLang = () => localStorage.getItem('lang') || 'pt-BR';
const getTopics = () => TOPICS[getLang()] || TOPICS['pt-BR'];

const addBotBubble = (text) => {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `
    <div class="chat-bubble-avatar">
      <img src="/logoia.png" alt="Bot">
    </div>
    <div class="chat-bubble-text">${text.replace(/\n/g, '<br>')}</div>
  `;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
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
      <img src="/logoia.png" alt="Bot">
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
    const topic = getTopics()[opt.next];
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
  floatPanel.removeAttribute('hidden');
  if (badge) badge.remove();
  if (!chatInitialized) {
    updateHeaderLabels();
    startChat();
  }
};

const closeChat = () => {
  isOpen = false;
  floatPanel.setAttribute('hidden', '');
};

const showFab = () => {
  fab.removeAttribute('hidden');
};

const initChatWidget = () => {
  if (!fab || !floatPanel) return;

  updateHeaderLabels();

  fab.addEventListener('click', () => {
    isOpen ? closeChat() : openChat();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  [document.getElementById('lang-toggle'), document.getElementById('lang-toggle-mobile')]
    .forEach(btn => btn && btn.addEventListener('click', () => {
      setTimeout(resetChat, 50);
    }));

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
