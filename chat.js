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
    message: 'Leandro Severo é um profissional de DevOps baseado em Curitiba - PR, Brasil. Atualmente atua como Supervisor de DevOps na Employer Tudo do RH, liderando equipes de engenharia e definindo estratégias de infraestrutura, automação e alta disponibilidade. Tem sólida experiência em Cloud, Containers, Segurança e Liderança técnica.',
    options: [
      { label: 'Onde ele trabalhou?', next: 'experience' },
      { label: 'Quais são as habilidades?', next: 'skills' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  experience: {
    message: 'A trajetória profissional do Leandro inclui:\n\n• Supervisor de DevOps – Employer (Jul 2025 - Presente)\n• DevOps – Employer (Set 2024 - Jul 2025)\n• Analista de Infraestrutura de TI – Employer (Fev 2023 - Set 2024)\n• Suporte Helpdesk e Telecom – Employer (Fev 2022 - Fev 2023)\n• Telecom – Employer (Jun 2021 - Fev 2022)\n• Soldado – Exército Brasileiro (Fev 2018 - Fev 2021)',
    options: [
      { label: 'O que ele faz no cargo atual?', next: 'current_role' },
      { label: 'Habilidades utilizadas', next: 'skills' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  current_role: {
    message: 'Como Supervisor de DevOps na Employer Tudo do RH, o Leandro lidera a equipe de DevOps definindo estratégias de infraestrutura cloud, automatizando processos com pipelines CI/CD e garantindo a alta disponibilidade dos sistemas. Trabalha com AWS, Azure, Kubernetes e Docker no dia a dia.',
    options: [
      { label: 'Tecnologias que usa', next: 'skills' },
      { label: 'Ver toda a trajetória', next: 'experience' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  skills: {
    message: 'O Leandro domina um conjunto robusto de tecnologias:\n\n☁️ Cloud: AWS, Azure, GCP\n🐳 Containers: Docker, Kubernetes (AKS)\n🖥️ Sistemas: Linux, Windows Server\n📊 Monitoramento: Elastic Stack\n🗄️ Banco de dados: MongoDB\n🔐 Segurança: Fortinet\n⚙️ CI/CD: Azure DevOps\n💾 Backup: Veeam Backup\n📨 Mensageria: RabbitMQ\n👥 Identidade: Active Directory, Microsoft 365',
    options: [
      { label: 'Ver certificações', next: 'certs' },
      { label: 'Como aplicou na prática?', next: 'experience' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  education: {
    message: 'O Leandro possui sólida formação acadêmica:\n\n🎓 Análise e Desenvolvimento de Sistemas – UNICURITIBA\n📚 Pós-graduação em Gestão de Pessoas – PUCPR\n\nEssa combinação de formação técnica e em gestão é o que permite a ele liderar equipes com excelência técnica e visão humana.',
    options: [
      { label: 'Ver certificações', next: 'certs' },
      { label: 'Quais habilidades tem?', next: 'skills' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  certs: {
    message: 'O Leandro possui diversas certificações relevantes:\n\n🛡️ Fortinet Certified Associate Cybersecurity (Dez 2023)\n☁️ Azure DevOps – CI/CD – Udemy (Dez 2023)\n☁️ AWS Cloud Essentials – Amazon (Ago 2023)\n🔒 Fortinet NSE 1 & 2 (Jul-Ago 2023)\n🌐 Arquitetura de Redes – Udemy (Jun 2023)\n🖥️ Active Directory Do Zero ao Avançado – Udemy (Ago 2023)\n💡 Computer Hardware Basics – Cisco (Jul 2023)\n🏅 Liderança Inovadora – STF (Mai 2024)\n🔐 Segurança da Informação – Fundação Bradesco (Out 2024)\n📋 Disciplined Agile – PMI (Ago 2022)',
    options: [
      { label: 'Formação acadêmica', next: 'education' },
      { label: 'Habilidades técnicas', next: 'skills' },
      { label: 'Falar com o Leandro', next: 'contact', type: 'contact' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
  contact: {
    message: 'Ótimo! O Leandro está aberto a novas oportunidades, colaborações e conversas sobre tecnologia. Escolha como prefere entrar em contato:',
    options: [
      { label: '💼 LinkedIn', next: 'linkedin_link', type: 'link', url: 'https://www.linkedin.com/in/leandrosevero' },
      { label: '📧 E-mail', next: 'email_link', type: 'link', url: 'mailto:leandroolise@gmail.com' },
      { label: '📷 Instagram', next: 'instagram_link', type: 'link', url: 'https://www.instagram.com/leeandro.sv/' },
      { label: '← Voltar ao início', next: 'start', type: 'back' },
    ],
  },
};

const messagesEl = document.getElementById('chat-messages');
const optionsEl = document.getElementById('chat-options');

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
        addBotBubble('Ótimo! Redirecionando você agora. Qualquer outra dúvida, estou por aqui!');
        renderOptions(TOPICS.contact.options);
      }, 1000);
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
  }, 900);
};

const initChat = () => {
  if (!messagesEl || !optionsEl) return;

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      addBotBubble(TOPICS.start.message);
      renderOptions(TOPICS.start.options);
    }, 800);
  }, 400);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}
