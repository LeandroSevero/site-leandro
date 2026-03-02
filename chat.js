const TOPICS = {
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
};

const fab = document.getElementById('chat-fab');
const floatPanel = document.getElementById('chat-float');
const closeBtn = document.getElementById('chat-close-btn');
const messagesEl = document.getElementById('chat-messages');
const optionsEl = document.getElementById('chat-options');
const badge = document.getElementById('chat-fab-badge');

let chatInitialized = false;
let isOpen = false;

const addBotBubble = (text) => {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `
    <div class="chat-bubble-avatar">
      <img src="/logofoguete.png" alt="Bot">
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
      <img src="/logofoguete.png" alt="Bot">
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
        addBotBubble('Ótimo! Redirecionando você agora. Mais alguma coisa?');
        renderOptions(TOPICS.contact.options);
      }, 900);
    }, 300);
    return;
  }

  addUserBubble(opt.label);
  optionsEl.innerHTML = '';

  showTyping();
  setTimeout(() => {
    removeTyping();
    const topic = TOPICS[opt.next];
    if (topic) {
      addBotBubble(topic.message);
      renderOptions(topic.options);
    }
  }, 800);
};

const startChat = () => {
  chatInitialized = true;
  showTyping();
  setTimeout(() => {
    removeTyping();
    addBotBubble(TOPICS.start.message);
    renderOptions(TOPICS.start.options);
  }, 700);
};

const openChat = () => {
  isOpen = true;
  floatPanel.removeAttribute('hidden');
  if (badge) badge.remove();
  if (!chatInitialized) startChat();
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

  fab.addEventListener('click', () => {
    isOpen ? closeChat() : openChat();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

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
