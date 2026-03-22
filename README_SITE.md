# Portfolio Leandro Severo — DevOps

Portfolio profissional de Leandro Severo, Supervisor de DevOps, desenvolvido com foco em performance, acessibilidade, SEO e experiência do usuário.

---

## Visão Geral

Site estático com funcionalidades avançadas, construído em HTML5, CSS3 e JavaScript Vanilla. Sem frameworks front-end. O backend é composto por uma API serverless para o formulário de contato, com envio de e-mail via Resend e persistência em MongoDB.

**URL de produção:** [leandrosevero.com.br](https://leandrosevero.com.br)

---

## Tecnologias Utilizadas

### Front-end
| Tecnologia | Uso |
|---|---|
| **HTML5 semântico** | Estrutura do site |
| **CSS3 com variáveis** | Estilização e temas |
| **JavaScript Vanilla (ES Modules)** | Todas as interações |
| **Vite 5** | Bundler e servidor de desenvolvimento |

### Back-end / Infra
| Tecnologia | Uso |
|---|---|
| **Node.js (API serverless)** | Endpoint `/api/contact` |
| **Resend** | Envio de e-mails transacionais |
| **MongoDB** | Persistência de submissions e rate limiting |
| **Cloudflare Turnstile** | CAPTCHA anti-spam |
| **Vercel** | Deploy e hosting |

---

## Funcionalidades

### Tema Claro / Escuro
- Alternância entre modo claro e escuro com um clique
- Preferência persistida no `localStorage`
- Troca automática de logo e imagem do hero conforme o tema

### Internacionalização (i18n)
- Suporte completo a **Português (pt-BR)** e **Inglês (en)**
- Sistema de traduções próprio com dicionário em `i18n.js`
- Atualiza texto, HTML com marcações (`<strong>`, etc.), placeholders, labels e aria-labels
- Mais de 150 chaves de tradução, incluindo:
  - Parágrafos da seção Sobre
  - Descrições de todas as tecnologias
  - Mensagens de validação do formulário
  - Estados do formulário (carregando, sucesso, erro, limite atingido)
  - Textos do assistente virtual
- Preferência de idioma persistida no `localStorage`

### Navegação e Scroll
- Scroll suave para seções com atualização da URL (History API)
- Header com sombra progressiva ao rolar a página
- Deep linking por âncora (`#sobre`, `#skills`, etc.)
- Botão "voltar ao topo"
- Menu mobile com hambúrguer, fechamento ao clicar fora ou em link

### Animações e Interações
- Scroll reveal bidirecional com `IntersectionObserver` (fade, slide, scale) — elementos animam ao entrar e ao sair da viewport, e reaplicam a animação a cada passagem pelo scroll
- Saída suave com movimento inverso coerente por tipo: `translateY` inverte direção, `translateX` inverte eixo, `scale` retrai levemente
- Animação de typewriter no badge do hero
- Timeline animada com ponto flutuante que acompanha o scroll
- Easter egg: clique no certificado Azure DevOps ativa animação de fantasma com rastro de partículas

### Seção de Skills
- **Desktop:** grid de cards clicáveis com painel lateral de descrição localizada
- **Mobile:** carrossel com navegação por botões, dots indicadores e auto-play (4,5s)
- Cores e ícones individuais por tecnologia
- Descrições traduzidas para pt-BR e en

### Seção de Certificados
- 3 certificados em destaque
- Carrossel infinito e contínuo com 8+ certificados adicionais
- Velocidade reduzida ao passar o mouse (hover)

### Seção de Experiência
- Timeline vertical com 6 posições profissionais
- Acordeão expansível por cargo com descrição detalhada
- Tags de tecnologias por posição

### Formulário de Contato (Modal)
- Campos: Nome, E-mail, Telefone (opcional), Assunto, Mensagem
- Máscara automática no campo de telefone
- Contadores de caracteres em tempo real (Assunto e Mensagem)
- Validação client-side com mensagens de erro localizadas
- Validação server-side com sanitização contra XSS e injeção
- CAPTCHA via Cloudflare Turnstile
- Rate limiting: máximo de **2 envios por dia** por IP e por e-mail
- Envio de e-mail ao admin e auto-resposta ao remetente via Resend
- Estados visuais distintos: carregando, sucesso, erro, limite atingido
- Textos de estado completamente traduzidos

### Assistente Virtual (Chat)
- Widget flutuante (FAB) com badge de notificação
- Aparece após o usuário rolar além da seção hero
- **12 fluxos de conversa** pré-definidos: sobre, resumo, experiência, cargo atual, tecnologias, formação, certificações, contato
- Bubble de sugestão automática após 30s de inatividade ou ao rolar >300px
- Text-to-speech com detecção de idioma e seleção de voz do navegador
- **Som desativado por padrão** — toast sugere ativar ao abrir o chat pela primeira vez
- Integração com o modal de contato diretamente pelo chat
- Textos completamente bilíngues (pt-BR / en)
- Reset automático ao trocar de idioma

### Mapa de Localização
- Card de localização com popup de mapa integrado (Google Maps iframe)
- Carregamento lazy do iframe

---

## Estrutura do Projeto

```
/
├── index.html                   # Entrada principal — 700+ linhas
├── main.js                      # Lógica central: tema, i18n, skills, timeline, animações
├── i18n.js                      # Dicionário de traduções (pt-BR + en, 150+ chaves)
├── chat.js                      # Assistente virtual: fluxos, TTS, FAB, sugestões
├── contact-modal.js             # Modal de contato: validação, estados, Turnstile
├── style.css                    # Estilos globais com CSS custom properties (~1700 linhas)
├── vite.config.js               # Configuração do Vite (SPA fallback)
├── vercel.json                  # Configuração de deploy (rewrites SPA)
├── package.json                 # Dependências e scripts
├── .env                         # Variáveis de ambiente (não versionado)
│
├── api/
│   ├── contact.js               # Endpoint POST /api/contact (validação, Resend, MongoDB)
│   └── lib/
│       └── mongodb.js           # Conexão e utilitários MongoDB (rate limiting, TTL)
│
├── src/
│   └── assets/
│       ├── images.js            # Módulo central de importação de imagens (cache busting)
│       ├── logo.svg             # Logo (versão fundo escuro)
│       ├── logoparaofundobranco.svg # Logo (versão fundo claro)
│       ├── leandro.svg          # Foto do hero (tema escuro)
│       ├── leandrofundobranco.svg   # Foto do hero (tema claro)
│       ├── atendimento.svg      # Avatar do chat (tema claro)
│       └── atendimentoescuro.svg    # Avatar do chat (tema escuro)
│
└── public/
    ├── robots.txt
    ├── sitemap.xml
    ├── _redirects               # Redirects para Netlify (compatibilidade)
    └── icons/                   # Ícones SVG das tecnologias (carregados dinamicamente, sem import)
        ├── Azure DevOps/
        ├── Azure/
        ├── AWS/
        ├── GCP/
        ├── Kubernetes/
        ├── Linux/
        ├── Windows Server/
        ├── Microsoft 365/
        ├── MongoDB/
        ├── RabbitMQ/
        ├── Grafana/
        ├── Active Directory/
        └── ...
```

---

## Seções do Site

| # | Seção | Conteúdo |
|---|---|---|
| 01 | **Hero** | Foto, badge de cargo, descrição, links para LinkedIn, Instagram e contato |
| 02 | **Sobre** | 6 parágrafos sobre formação e atuação profissional, 3 cards informativos |
| 03 | **Skills** | 12 tecnologias com ícone, categoria e descrição detalhada localizada |
| 04 | **Certificados** | 3 em destaque + carrossel com 8 certificações adicionais |
| 05 | **Experiência** | Timeline com 6 posições profissionais expandíveis |
| 06 | **Contato** | E-mail, LinkedIn, Instagram, localização com mapa e formulário modal |

---

## API de Contato

**Endpoint:** `POST /api/contact`

### Fluxo de processamento
1. Validação de campos (tipo, tamanho, regex)
2. Sanitização contra XSS (tags HTML, atributos de evento, protocolos perigosos)
3. Verificação do token Cloudflare Turnstile
4. Conexão ao MongoDB
5. Checagem de rate limit por IP e por e-mail (hash SHA256)
6. Envio de e-mail ao admin via Resend
7. Envio de auto-resposta ao remetente
8. Registro da submission no MongoDB

### Rate Limiting
- Máximo de **2 envios por dia** por IP
- Máximo de **2 envios por dia** por e-mail (normalizado e hasheado)
- Registros expiram automaticamente via TTL index no MongoDB

### Banco de Dados (MongoDB)

**Collection `contact_submissions`**
- Campos: nome, e-mail, telefone, assunto, mensagem, IP, data
- TTL index: documentos expiram após **90 dias**

**Collection `contact_rate_limits`**
- Campos: tipo (ip/email), chave, dia, contagem, expiração
- Índice único composto: `{type, key, day}`
- TTL index: expira no dia seguinte à meia-noite

---

## Paleta de Cores

Todas as cores são definidas via CSS custom properties em `:root` (modo claro) e `[data-theme="dark"]` (modo escuro).

### Cores Base

| Token CSS | Modo Claro | Modo Escuro | Uso |
|---|---|---|---|
| `--color-bg` | `#f0f4f8` | `#04060f` | Fundo principal |
| `--color-bg-secondary` | `#e4ecf4` | `rgba(255,255,255,0.07)` | Fundo de inputs, badges, seções alternadas |
| `--color-fg` | `#1a2636` | `#f0f4ff` | Texto principal |
| `--color-fg-muted` | `#4a6080` | `rgba(240,244,255,0.5)` | Texto secundário e legendas |
| `--color-border` | `#c0d0e0` | `rgba(255,255,255,0.09)` | Bordas padrão |
| `--color-border2` | — | `rgba(255,255,255,0.15)` | Bordas com maior destaque (dark only) |

### Cores Primárias e Accent

| Token CSS | Modo Claro | Modo Escuro | Uso |
|---|---|---|---|
| `--color-primary` | `#1a5fa8` | `#4fd1c5` | Cor principal: botões, links, destaques |
| `--color-primary-hover` | `#154e8c` | `#81e6d9` | Estado hover do primário |
| `--color-primary-fg` | `#ffffff` | `#04060f` | Texto sobre fundo primário |
| `--color-accent` | `#1a5fa8` | `#81e6d9` | Destaques e elementos de ênfase |
| `--color-violet` | — | `#7c6af7` | Uso pontual em elementos visuais (dark only) |

### Cores de Superfície (Dark mode)

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-card` | `rgba(255,255,255,0.04)` | Fundo de cards com vidro |
| `--color-glass` | `rgba(255,255,255,0.04)` | Glassmorphism nível 1 |
| `--color-glass2` | `rgba(255,255,255,0.07)` | Glassmorphism nível 2 |
| `--color-glass3` | `rgba(255,255,255,0.11)` | Glassmorphism nível 3 |

### Header

| Token CSS | Modo Claro | Modo Escuro |
|---|---|---|
| `--color-header-bg` | `rgba(240,244,248,0.88)` | `rgba(4,6,15,0.75)` |
| `--color-header-shadow` | `rgba(26,95,168,0.08)` | `rgba(0,0,0,0.6)` |

### Cores Utilitárias Fixas

| Cor | Valor | Uso |
|---|---|---|
| Sucesso | `#22c55e` | Badge de status online |
| Dark toggle bg | `#2a2a35` | Fundo do botão de tema (dark) |
| Light toggle bg | `#daeeff` | Fundo do botão de tema (light) |

---

## Performance

- **Build size total:** ~78KB JS + ~49KB CSS (gzip: ~23KB + ~9KB)
- **Zero dependências de framework front-end**
- Todas as imagens do site (logo, hero, avatar do chat) centralizadas em `src/assets/` e importadas via ES Modules — Vite gera hash automático no nome do arquivo (ex: `leandro-Bli4fEol.svg`), eliminando cache stale após deploy
- Favicon também injetado via JS com o mesmo hash, sem referência estática em HTML
- Ícones de tecnologias em `/public/icons/` carregados dinamicamente por string (sem import), com versionamento via query string (`?v=1`)
- Zero arquivos de imagem duplicados no projeto
- Imagens com `loading="eager"` (hero) e `loading="lazy"` (demais)
- CSS com variáveis nativas — sem preprocessador
- Animações com `requestAnimationFrame` e `IntersectionObserver`
- Fontes via `font-display: swap`

---

## Acessibilidade e SEO

### Acessibilidade
- HTML5 semântico (`header`, `main`, `section`, `article`, `footer`, `nav`)
- `aria-label`, `aria-expanded`, `aria-hidden`, `aria-live`, `aria-required` em todos os elementos interativos
- Navegação completa por teclado
- Contraste de cores adequado (WCAG AA)
- Textos alternativos em imagens
- Feedback de validação com `role="alert"`

### SEO
- Meta tags: `description`, `author`, `robots`
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Cards
- `sitemap.xml` e `robots.txt`
- URLs canônicas com âncoras
- `lang` do documento atualizado conforme idioma selecionado

---

## Deploy

O projeto é hospedado na **Vercel** com as seguintes configurações:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "rm -rf node_modules && npm ci",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Todas as rotas são redirecionadas para `index.html` para suporte ao roteamento SPA com History API.

---

## Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Chave pública do Cloudflare Turnstile (front-end) |
| `TURNSTILE_SECRET_KEY` | Chave secreta do Turnstile (API) |
| `RESEND_API_KEY` | Chave da API Resend para envio de e-mails |
| `MONGODB_URI` | String de conexão MongoDB |
| `CONTACT_TO_EMAIL` | E-mail de destino dos formulários |

---

## Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento (Vite)
npm run build    # Gera o build de produção em /dist
npm run preview  # Visualiza o build de produção localmente
```

---

## Melhorias Futuras

- [ ] PWA com Service Worker e suporte offline
- [ ] Modo de impressão otimizado para currículo
- [ ] Integração com analytics (privacidade-first)
- [ ] Blog ou seção de artigos técnicos
- [ ] Testes automatizados (e2e com Playwright)
