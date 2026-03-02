"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "pt-BR" | "en"

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const dictionaries: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    // Navigation
    "nav.about": "Sobre",
    "nav.skills": "Skills",
    "nav.certificates": "Certificados",
    "nav.experience": "Experiência",
    "nav.contact": "Contato",
    "nav.menu": "Menu de navegação",

    // Hero
    "hero.badge": "Supervisor de DevOps",
    "hero.description": "Infraestrutura, Cloud e Cybersecurity. Construindo soluções robustas e escalaveis com foco em automacao e excelencia operacional.",
    "hero.contact": "Contato",
    "hero.scrollDown": "Rolar para baixo",

    // About
    "about.section": "01. Sobre",
    "about.title": "Quem sou eu",
    "about.p1.prefix": "Formado em ",
    "about.p1.degree": "Analise e Desenvolvimento de Sistemas",
    "about.p1.mid": " pelo UNICURITIBA e com pos-graduação em ",
    "about.p1.postgrad": "Gestão de Pessoas",
    "about.p1.suffix": " pela PUCPR, atuo como DevOps com foco em soluções tecnologicas robustas e eficientes.",
    "about.p2": "Tenho experiência pratica em diversas tecnologias e plataformas, incluindo AWS, Azure, Azure DevOps, AKS, Docker, Microsoft 365, Windows Server, Sistemas Linux, MongoDB, Elastic Cloud e Veeam Backup.",
    "about.p3": "Estou sempre em busca de novas oportunidades para aplicar meu conhecimento e colaborar em projetos inovadores com equipes multidisciplinares.",
    "about.card1.title": "DevOps & Cloud",
    "about.card1.desc": "Automacao de infraestrutura, CI/CD e orquestração de containers.",
    "about.card2.title": "Formacao Academica",
    "about.card2.desc": "ADS - UNICURITIBA e Pos em Gestão de Pessoas - PUCPR.",
    "about.card3.title": "Liderança",
    "about.card3.desc": "Gestão de equipes e projetos com foco em resultados.",

    // Skills
    "skills.section": "02. Skills",
    "skills.title": "Tecnologias & Ferramentas",

    // Certificates
    "certs.section": "03. Certificados",
    "certs.title": "Certificacoes & Cursos",
    "certs.fortinet.date": "Dez 2023",
    "certs.azure.date": "Dez 2023",
    "certs.aws.date": "Ago 2023",
    "certs.seginfo.name": "Segurança da Informação",
    "certs.seginfo.date": "Out 2024",
    "certs.lideranca.name": "Liderança Inovadora",
    "certs.lideranca.date": "Mai 2024",
    "certs.ad.name": "Active Directory - Do Zero ao Avançado",
    "certs.ad.date": "Ago 2023",
    "certs.redes.name": "Arquitetura de Redes",
    "certs.redes.date": "Jun 2023",
    "certs.hardware.date": "Jul 2023",
    "certs.fortinetNse.date": "Jul - Ago 2023",
    "certs.da.name": "Noções basicas de DA",
    "certs.da.date": "Ago 2022",

    // Experience
    "exp.section": "04. Experiência",
    "exp.title": "Trajetoria Profissional",
    "exp.current": "Atual",
    "exp.1.role": "Supervisor de DevOps",
    "exp.1.period": "Jul 2025 - Presente",
    "exp.1.desc": "Liderança da equipe de DevOps, definindo estrategias de infraestrutura, automação de processos e garantindo a alta disponibilidade dos sistemas.",
    "exp.2.role": "DevOps",
    "exp.2.period": "Set 2024 - Jul 2025",
    "exp.2.desc": "Implementacao e manutencao de pipelines CI/CD, gerenciamento de containers e orquestração com Kubernetes no Azure AKS.",
    "exp.3.role": "Analista de Infraestrutura de TI",
    "exp.3.period": "Fev 2023 - Set 2024",
    "exp.3.desc": "Administracao de servidores Windows e Linux, gerenciamento de backups com Veeam, monitoramento de infraestrutura e suporte a aplicacoes.",
    "exp.4.role": "Suporte de Helpdesk e Telecom",
    "exp.4.period": "Fev 2022 - Fev 2023",
    "exp.4.desc": "Atendimento de chamados de TI, suporte a usuarios e manutenção de infraestrutura de telecomunicações.",
    "exp.5.role": "Telecom",
    "exp.5.period": "Jun 2021 - Fev 2022",
    "exp.5.desc": "Gestão de telefonia corporativa e infraestrutura de telecomunicações.",
    "exp.6.role": "Soldado",
    "exp.6.period": "Fev 2018 - Fev 2021",
    "exp.6.desc": "Servico militar com foco em disciplina, liderança e trabalho em equipe.",

    // Contact
    "contact.section": "05. Contato",
    "contact.title": "Vamos conversar?",
    "contact.desc": "Estou aberto a novas oportunidades, colaborações e conversas sobre tecnologia. Entre em contato!",
    "contact.email": "E-mail",
    "contact.location": "Localização",
    "contact.locationValue": "Curitiba - PR, Brasil",

    // Footer
    "footer.rights": "Todos os direitos reservados.",

    // Theme
    "theme.toggle": "Alternar tema",
  },
  en: {
    // Navigation
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.certificates": "Certificates",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "nav.menu": "Navigation menu",

    // Hero
    "hero.badge": "DevOps Supervisor",
    "hero.description": "Infrastructure, Cloud and Cybersecurity. Building robust and scalable solutions focused on automation and operational excellence.",
    "hero.contact": "Contact",
    "hero.scrollDown": "Scroll down",

    // About
    "about.section": "01. About",
    "about.title": "Who I am",
    "about.p1.prefix": "Graduated in ",
    "about.p1.degree": "Systems Analysis and Development",
    "about.p1.mid": " from UNICURITIBA with a postgraduate degree in ",
    "about.p1.postgrad": "People Management",
    "about.p1.suffix": " from PUCPR, I work as a DevOps professional focused on robust and efficient technology solutions.",
    "about.p2": "I have hands-on experience with various technologies and platforms, including AWS, Azure, Azure DevOps, AKS, Docker, Microsoft 365, Windows Server, Linux Systems, MongoDB, Elastic Cloud, and Veeam Backup.",
    "about.p3": "I am always looking for new opportunities to apply my knowledge and collaborate on innovative projects with multidisciplinary teams.",
    "about.card1.title": "DevOps & Cloud",
    "about.card1.desc": "Infrastructure automation, CI/CD, and container orchestration.",
    "about.card2.title": "Academic Background",
    "about.card2.desc": "ADS - UNICURITIBA and Postgrad in People Management - PUCPR.",
    "about.card3.title": "Leadership",
    "about.card3.desc": "Team and project management focused on results.",

    // Skills
    "skills.section": "02. Skills",
    "skills.title": "Technologies & Tools",

    // Certificates
    "certs.section": "03. Certificates",
    "certs.title": "Certifications & Courses",
    "certs.fortinet.date": "Dec 2023",
    "certs.azure.date": "Dec 2023",
    "certs.aws.date": "Aug 2023",
    "certs.seginfo.name": "Information Security",
    "certs.seginfo.date": "Oct 2024",
    "certs.lideranca.name": "Innovative Leadership",
    "certs.lideranca.date": "May 2024",
    "certs.ad.name": "Active Directory - From Zero to Advanced",
    "certs.ad.date": "Aug 2023",
    "certs.redes.name": "Network Architecture",
    "certs.redes.date": "Jun 2023",
    "certs.hardware.date": "Jul 2023",
    "certs.fortinetNse.date": "Jul - Aug 2023",
    "certs.da.name": "DA Fundamentals",
    "certs.da.date": "Aug 2022",

    // Experience
    "exp.section": "04. Experience",
    "exp.title": "Professional Journey",
    "exp.current": "Current",
    "exp.1.role": "DevOps Supervisor",
    "exp.1.period": "Jul 2025 - Present",
    "exp.1.desc": "Leading the DevOps team, defining infrastructure strategies, process automation, and ensuring high system availability.",
    "exp.2.role": "DevOps",
    "exp.2.period": "Sep 2024 - Jul 2025",
    "exp.2.desc": "Implementation and maintenance of CI/CD pipelines, container management, and orchestration with Kubernetes on Azure AKS.",
    "exp.3.role": "IT Infrastructure Analyst",
    "exp.3.period": "Feb 2023 - Sep 2024",
    "exp.3.desc": "Administration of Windows and Linux servers, backup management with Veeam, infrastructure monitoring, and application support.",
    "exp.4.role": "Helpdesk & Telecom Support",
    "exp.4.period": "Feb 2022 - Feb 2023",
    "exp.4.desc": "IT ticket management, user support, and telecom infrastructure maintenance.",
    "exp.5.role": "Telecom",
    "exp.5.period": "Jun 2021 - Feb 2022",
    "exp.5.desc": "Corporate telephony management and telecom infrastructure.",
    "exp.6.role": "Soldier",
    "exp.6.period": "Feb 2018 - Feb 2021",
    "exp.6.desc": "Military service focused on discipline, leadership, and teamwork.",

    // Contact
    "contact.section": "05. Contact",
    "contact.title": "Let's talk?",
    "contact.desc": "I'm open to new opportunities, collaborations, and conversations about technology. Get in touch!",
    "contact.email": "Email",
    "contact.location": "Location",
    "contact.locationValue": "Curitiba - PR, Brazil",

    // Footer
    "footer.rights": "All rights reserved.",

    // Theme
    "theme.toggle": "Toggle theme",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt-BR")

  const t = useCallback(
    (key: string): string => {
      return dictionaries[locale][key] ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
