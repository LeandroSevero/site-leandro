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
| **Cloudflare Turnstile** | CAPTCHA anti-spam (verificação de primeira visita e formulário de contato) |
| **Vercel** | Deploy e hosting |

---

## Funcionalidades

### Tema Claro / Escuro
- Alternância entre modo claro e escuro com um clique. O novo tema "surge" num círculo que nasce no botão de tema e se expande até cobrir a tela (~500ms, View Transitions API: `document.startViewTransition` + `clip-path` animado no `::view-transition-new(root)`, sem o crossfade padrão). Sem View Transitions, um crossfade de cores de ~300ms vale só durante a troca (classe temporária `.theme-fade`, removida em seguida, sem transições globais permanentes). Com `prefers-reduced-motion` a troca é instantânea. As imagens do outro tema (logo e avatares do chat) são pré-carregadas quando o navegador fica ocioso, para trocarem junto na revelação. Sem flash, sem salto de layout e nada fica repintando depois da troca
- Preferência persistida no `localStorage`
- Troca automática de logo e avatar do chat conforme o tema (a foto do hero é a mesma nos dois temas)
- Efeito **Liquid Glass** (somente CSS) nos dois temas: superfícies translúcidas, brilho especular no topo (`inset box-shadow`) e reflexo em gradiente. Com desfoque do fundo (`backdrop-filter: blur() saturate()`): header, menu mobile, rodapé, botões (LinkedIn, Instagram, Contato, idioma, menu, tema), seletores, modal de contato e chat flutuante. Os cards de conteúdo (Quem sou eu, Tecnologias, Certificações, Experiência, Contato e o fluxo, o painel e os pilares do "Sobre o site") usam o mesmo vidro **sem** `backdrop-filter` (fundo translúcido + gradiente + brilho na borda superior), o que evita manchas de sombra na GPU ao passar o mouse. Os botões "Explorar portfólio" e "Voltar ao topo" ficam sem vidro e têm o mesmo visual: seta + rótulo em caixa alta, cor suave e animação de quique
- No tema claro, o fundo ganhou manchas suaves em gradiente radial para o vidro ter o que refratar

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
- Topo na dobra: o hero ocupa exatamente a tela visível abaixo do cabeçalho fixo (`min-height: calc(100svh - 4rem)`, com `100vh` de reserva), com o conteúdo centralizado e o "Explorar portfólio" perto da base. Sem rolar, o "01. Quem sou eu" fica fora da tela em 1440x900, 1920x1080, 768x1024 e 390x844; "Quem sou eu" começa logo abaixo da dobra (1.5rem de respiro), então qualquer rolagem já traz o "01." (com ~100px ele aparece inteiro). `svh` usa a menor altura da tela no celular, sem pular quando a barra do navegador some. No celular a foto fica com `min(20rem, 34svh)` de altura (proporção 4:5) e os vãos do topo são menores para tudo caber na tela visível. O "Explorar portfólio" continua levando até "Quem sou eu"
- Botão "Baixe o currículo do Leandro" no meio do caminho entre o card "Soldado" e o texto "05.": 81px acima (margem do botão, `5rem + 1px`) e 81px abaixo até o texto (fim de `#experiencia` zerado + `5rem - 1px` no início de "Sobre o site" + 2px da linha do "05."), iguais em 1440, 1920 e 390px com os elementos já visíveis. Antes de o card e o "05." entrarem na tela, a animação de entrada os mantém 32px mais baixos, então uma medição nesse momento dá ~48px acima e ~113px abaixo. As demais seções seguem com o padding padrão
- Deep linking por âncora (`#sobre`, `#skills`, etc.)
- Botão "voltar ao topo"
- Menu mobile com hambúrguer, fechamento ao clicar fora ou em link

### Animações e Interações
- Scroll reveal bidirecional com `IntersectionObserver` (fade, slide, scale) — elementos animam ao entrar e ao sair da viewport, e reaplicam a animação a cada passagem pelo scroll. Em "Quem sou eu" o título, o texto e os cards entram com fade e leve subida assim que tocam a tela (observador próprio, sem margem); com `prefers-reduced-motion` nenhum elemento anima a entrada, só fica no lugar
  - Entrada escalonada (posição % 6 x 60ms) aplicada inline só enquanto o elemento entra (`opacity` e `transform`, 550ms; 500ms no `reveal-scale`) e removida ao terminar. Assim o atraso não fica preso no card e não atrasa o hover (antes, o 6º card de cada grupo, como Kubernetes, destacava 300ms depois dos outros)
- Saída suave com movimento inverso coerente por tipo: `translateY` inverte direção, `translateX` inverte eixo, `scale` retrai levemente
- Ao sair pela borda inferior, o elemento volta ao estado inicial (deslocado para baixo) em vez de usar a animação de saída, que o subiria de volta para a tela e criaria um loop entra/sai (elemento "tremendo" quando parado na borda)
- Animação de typewriter no badge do hero
- Timeline animada com ponto flutuante que acompanha o scroll
- Easter egg: clique no certificado Azure DevOps ativa animação de fantasma com rastro de partículas

### Seção de Skills
- **Desktop:** grid de cards com painel lateral de descrição localizada; o card é selecionado ao passar o mouse ou pelo teclado (Tab + Enter/Espaço, com `role="button"` e `aria-pressed`)
  - Um único card destacado por vez: o destaque visual (borda, fundo, elevação, ícone, nome e sombra `::after`) vem só da classe `.active`, trocada de forma síncrona no `mouseenter` (ou Enter/Espaço); o `:hover` não destaca. O card que perde o destaque apaga na hora (sem transição na saída) e só o que ganha tem entrada de 120ms. O foco por teclado mostra apenas o contorno de foco, sem pintar a borda
  - Painel de descrição (`setDescPanel` em `main.js`): troca o texto com fade de 260ms (mesmo comportamento da produção)
  - Todos os cards destacam no mesmo tempo (~120ms): o atraso escalonado da animação de entrada vale só durante a entrada (ver o scroll reveal em Animações)
- **Mobile:** carrossel com navegação por botões, dots indicadores e auto-play (4,5s)
- Cores e ícones individuais por tecnologia (`color` em `SKILL_DATA`); no tema claro, o nome da tecnologia usa um tom mais escuro da mesma cor (`textLight`) e, no escuro, Azure/Azure DevOps/AD, Microsoft 365 e Kubernetes usam um tom mais claro (`textDark`), para atingir 4.5:1 — ícone, borda e destaque seguem com a cor da marca
- Descrições traduzidas para pt-BR e en

### Seção de Certificados
- 3 certificados em destaque: Google SecOps Foundation (Google, Out 2026), Claude with Google Cloud's Vertex AI (Anthropic, Mar 2026) e Azure DevOps - Integração Contínua e Entrega Contínua (Udemy, Dez 2023)
- Carrossel infinito e contínuo com mais 9 certificações e cursos, ordenados da mais recente para a mais antiga: Segurança da Informação, Liderança Inovadora, Fortinet Certified Associate Cybersecurity, AWS Knowledge: Cloud Essentials, Active Directory - Do Zero ao Avançado, Fortinet NSE 1 & 2, Computer Hardware Basics, Arquitetura de Redes e Noções básicas de Disciplined Agile
- Link "Ver credencial" (nova aba, `rel="noopener noreferrer"`) só nos itens com credencial pública, com `aria-label` descritivo traduzido, foco visível e área de toque de 44px
- Todos os itens mostram só a data de emissão (sem indicação de expiração, inclusive nas certificações Fortinet e nas respostas do chat)
- Ícones dos emissores em `/public/icons/<nome>/icon.svg` (logotipo simples do emissor; Google e Anthropic incluídos)
- Velocidade reduzida ao passar o mouse (hover); ao focar um link pelo teclado, o carrossel para e mantém o card visível
- As cópias usadas no loop infinito têm `aria-hidden="true"` e `inert`: leitores de tela e o Tab veem cada item uma vez só
- As respostas do chat sobre certificações listam os mesmos itens, na mesma ordem e com as mesmas datas

### Seção de Experiência
- Timeline vertical com 6 posições profissionais: Supervisor de DevOps, Analista DevOps, Analista de Infraestrutura de TI, Suporte de Helpdesk e Telecom, Analista de Telecom e Soldado (cargos com nível, em pt e en, iguais nas respostas do chat)
- Acordeão expansível por cargo com descrição detalhada: um clique (ou toque) em qualquer parte do card abre e fecha a descrição, não só no título (cursor de mão no card). O botão do título continua sendo o controle acessível por teclado (`aria-expanded`); cliques em links e seleção de texto não alternam o card
- Tags de tecnologias por posição

### Seção "Sobre o site" (05.)
- Item "Sobre o site" / "About this site" no menu (desktop e mobile) e rota `/sobre-o-site`. Título "Por trás deste site" / "Behind this site" e subtítulo "Um site pessoal operado como um produto em produção."
- **Tom proposital:** os textos dizem o que existe (entrega contínua, ambientes isolados, monitoramento contínuo, alertas automáticos, segurança em camadas), nunca como. Nenhum nome de ferramenta ou fornecedor, branch, agendamento ou endpoint aparece na seção, nos tooltips, na descrição do SVG ou no rodapé (pt e en)
- **Fluxo animado:** 5 etapas (Código > Validação > Homologação > Aprovação > Produção) como `<button>` reais sobre uma trilha SVG inline. No desktop cada etapa tem 64px, um ícone SVG simples (código, escudo, frasco, carimbo, foguete) e uma linha secundária curta (versionado, verificado, testado, aprovado, no ar); no celular ficam com 56px e 2rem entre elas, sem a linha secundária (só o "no ar" de Produção aparece quando ela conclui). O card do fluxo centraliza o conteúdo na vertical, mais o laço "Observabilidade" voltando de Produção para Código (abaixo das etapas no desktop; na vertical, à esquerda, abaixo de 768px). A trilha é recalculada a partir da posição das etapas (resize e `ResizeObserver`)
  - **Borda a borda:** a trilha de 3px é feita de segmentos que vão da borda de uma etapa à borda da seguinte, e nada da trilha ou do pulso passa por dentro dos círculos (o fundo das etapas é opaco também quando acesas). O pulso de luz (gradiente radial na cor primária, com rastro que se dissipa) percorre o segmento via `requestAnimationFrame`, para ao encostar na borda e o rastro se recolhe nela
  - **Anel de carregamento:** ao receber o pulso, a etapa mostra um anel SVG (`.flow-ring`, `pathLength` 100 e `stroke-dashoffset` controlado pelo JS) que preenche a borda em ~700ms com brilho da cor primária, começando pelo lado de entrada (esquerda no desktop, em cima no celular). Ao completar aparece o check e um novo pulso sai pela borda oposta rumo à próxima etapa
  - Em Produção o anel completa, a etapa mostra "no ar" e o pulso segue pelo laço de Observabilidade (sai pela direita de Produção no desktop, por baixo no celular, passa pelo selo e entra pela borda de Código, à esquerda no desktop e por cima no celular), com um toque de luz em Código fechando o ciclo. As etapas concluídas ficam à mostra por ~1s e o ciclo recomeça. Trechos curtos (celular) têm duração mínima de ~0,4s para o pulso ser visto. JS/CSS puro, sem bibliotecas
  - Tooltip genérico (`role="tooltip"` + `aria-describedby`) sem estado fixo, controlado por JS (classe `.is-tip`): no mouse aparece no `mouseenter` e some no `mouseleave`; no teclado aparece no `focus` e some no `blur` (Esc fecha); no toque um toque mostra e ele some ao tocar fora, ao rolar a página ou depois de ~3s. O tooltip nunca pausa o fluxo, o pulso nem a simulação: tudo segue rodando atrás do balão (as únicas pausas são seção fora da tela, aba oculta e menos movimento). Clique ou toque não deixa o botão focado nem guarda estado "ativo/selecionado". O texto do balão é centralizado em todas as etapas; em telas médias (até 1199px) o balão de Código e o de Produção encostam na borda da etapa para não sair do quadro, e no celular todos ficam alinhados à esquerda, ao lado da etapa
  - Pilares: a elevação e o ícone animado só reagem ao hover em dispositivos com mouse (`@media (hover: hover)`); no toque o card volta ao estado normal
  - `IntersectionObserver`: só anima com a seção visível; se a seção sai da tela (ou a aba fica oculta) no meio de uma simulação ou da espera em Observabilidade, tudo pausa: cada espera do terminal congela o tempo que falta, o anel e o pulso param, e ao voltar continuam de onde pararam
  - SVG com `role="img"`, `<title>` e `<desc>` traduzidos
- **Simular publicação** ("Simulate release"): execução guiada de 12 a 15s com terminal narrado. Cada etapa mostra um cabeçalho "[n/5] Etapa" (cor primária), 2 ou 3 linhas digitadas explicando o que acontece (com spinner na linha em execução) e uma linha "✓" em verde; a observabilidade fecha com "[∞] Observabilidade" e uma linha com o status real de `/api/status` e o tempo de resposta medido no navegador (ou "status indisponível no momento", sem quebrar), atualizando também o painel ao vivo. Textos genéricos, sem nomes de ferramentas, com a versão do `package.json`
  - **Início automático:** quando ~40% da seção "Por trás deste site" está na tela (ou 40% da altura da tela, se a seção for maior que ela), a simulação começa sozinha como se o botão tivesse sido clicado, depois que a rolagem para (~350ms sem rolar, o que cobre também quem abre direto em `/sobre-o-site`). O início automático acontece uma vez por carregamento da página (um clique antes disso o substitui); a partir daí a simulação segue em ciclo enquanto a seção estiver visível. Durante a simulação o fluxo contínuo fica parado (um pulso por vez). Com menos movimento não há início automático nem ciclo: o terminal já aparece preenchido e as etapas concluídas
  - **Ciclo terminando em Observabilidade:** ao fim de cada simulação o pulso sai de Produção pelo laço e para na borda do selo "Observabilidade" (o trecho do laço até o selo é calculado no layout, em `loopIn`/`loopOut`). O selo entra em "monitorando" (`.is-monitoring`: brilho respirando numa camada própria, só `transform` e `opacity`) e a última linha do terminal vira "> monitorando... aguardando eventos" (en: "> monitoring... waiting for events") com o cursor piscando. O botão fica "Simular de novo" durante a espera. Depois de ~4s o pulso sai pela outra borda do selo até a borda de Código, que dá um toque de luz, e uma nova simulação começa sozinha (terminal limpo, narração do início). Um clique em "Simular de novo" durante a espera começa a nova simulação na hora. No recomeço (automático ou por clique) tudo é zerado num único quadro: etapas apagadas e sem check, anéis vazios, barra de progresso em 0, selo sem destaque e terminal limpo (`snapReset` liga `.is-resetting`, que desliga as transições só nesse quadro; sem isso as transições de saída faziam anéis, checks e barra "desandarem" por ~300ms, parecendo que a nova execução começava pela metade). Só existe uma execução ativa por vez: ao começar outra, as esperas da anterior são canceladas e o id da execução faz callbacks antigos serem ignorados. No recomeço automático o toque de luz em Código é preservado Fora da tela ou com a aba oculta a espera pausa e retoma com o tempo que faltava. O foco só volta ao botão depois de uma simulação iniciada por clique (os ciclos automáticos não mexem no foco)
  - Sincronia visual: no "✓" de uma etapa o anel completa, aparece o check e um pulso sai pela borda rumo à próxima (chega em ~0,45s, no desktop ou no celular); o anel da próxima carrega enquanto o terminal narra aquela etapa (progresso estimado pela digitação, parando em 95%) e só completa no "✓" dela. No "✓" de Produção o pulso percorre o laço até a borda do selo "Observabilidade", que fica aceso durante a narração da observabilidade. Se o pulso ainda não tiver encostado (troca de layout, por exemplo), a chegada é entregue no "✓" para a narração nunca travar. No topo do terminal ficam uma barra de progresso fina (0 a 100%) e uma linha de destaque com a etapa atual e uma frase curta (ex.: "Validação: a nova versão é construída e verificada antes de seguir")
  - Final: "Publicação concluída · 5 etapas · 0 falhas", destaque rápido em Produção e uma piscada verde no status do painel. O botão vira "Simulando..." (desabilitado) e depois "Simular de novo"
  - O terminal tem altura fixa e rola sozinho para a última linha, sem rolar a página; é focável por teclado para leitura
  - Acessibilidade: o terminal não é região viva; uma região `aria-live="polite"` separada (oculta visualmente) anuncia só os cabeçalhos das etapas e o resultado final, não cada caractere. "Publicação concluída" é anunciado só na primeira execução (a automática, que não anuncia as etapas) e nas iniciadas por clique (que anunciam as etapas); os recomeços automáticos do ciclo não anunciam nada. Com menos movimento, o terminal estático termina na linha de monitoramento e o selo fica em "monitorando", sem animação. Em repouso o terminal mostra "pronto para simular uma publicação"
- **Painel ao vivo (somente dados reais):** status de `/api/status` (verde pulsando "Todos os sistemas operando", âmbar "Instabilidade detectada", cinza "Status indisponível" se a chamada falhar, sem quebrar a página), tempo de resposta medido no navegador com `performance.now()` ("respondeu em 182 ms", com contagem animada), versão e data da última atualização (data do deploy). Atualiza a cada 5 min. Sem uptime nem métricas inventadas
- **5 pilares** (cards com leve elevação e ícone animado no hover, sem logos): Entrega contínua, Ambientes isolados, Observabilidade 24/7, Segurança em camadas e Acessível e rápido
- **`prefers-reduced-motion`:** fluxo estático com todas as etapas concluídas, terminal já preenchido de uma vez (sem digitação nem spinner, barra em 100%, status real na linha da observabilidade), sem pulsos, rastro, anel de carregamento, destaque final, piscada do status, contagem, cursor piscando ou elevação
- **Acessibilidade:** contraste AA medido nos dois temas, foco visível, alvos de toque de 44px e sem rolagem lateral em 390px
- Implementação: `site-meta.js` (fluxo, simulação, painel e rodapé), estilos no bloco "Seção Sobre o site" do `style.css`, traduções em `i18n.js` (chaves `site.*`, incluindo `site.sub.*` das linhas secundárias, `nav.site` e `footer.updated`)

### Rodapé: versão e data da atualização
- Linha "vX.Y.Z · Atualizado em DD/MM/AAAA" (ex.: "v2.3.1 · Atualizado em ...") ("Updated on MM/DD/YYYY" em inglês), sem commit e sem link externo
- Versão lida do `package.json`; a data é gravada no build da plataforma de deploy (variável `VERCEL` presente), injetada pelo Vite (`define` no `vite.config.js`: `__APP_VERSION__` e `__BUILD_DATE__`). Em build local mostra "vX.Y.Z · dev"
- A cada release, a versão do `package.json` é atualizada junto com a tag (regra no `AGENTS.md`)

### Formulário de Contato (Modal)
- E-mail público único do site: `leandroolise@gmail.com` (card "E-mail" da seção Contato como link `mailto:` e rodapé). O remetente técnico dos e-mails enviados pelo servidor continua definido por `CONTACT_FROM_EMAIL`
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
- Botão flutuante (FAB) de 56px com ícone de balão de chat em linha (SVG, cor primária, sem logos) sobre vidro translúcido no estilo Liquid Glass: fundo `--glass-bg-strong` com leve tom da cor primária, `backdrop-filter` (permitido aqui por ficar sobre o conteúdo), borda de 1px com brilho no topo e sombra suave, nos dois temas. Sem badge de notificação. Hover com leve elevação/escala (só `transform`); aberto, o ícone gira e vira um "X" (balão e X são dois SVGs empilhados que trocam com `transform`/`opacity`). É um `<button>` com foco visível, `aria-expanded`, `aria-controls="chat-float"` e `aria-label` que alterna entre "Abrir chat" e "Fechar chat" (en: "Open chat" / "Close chat")
- Janela do chat no mesmo vidro do site, com o leve tom da cor primária do botão. Cabeçalho só com "Assistente do Leandro" e "Online agora" (bolinha verde de status), sem avatar. As respostas do assistente mostram o avatar (o do fone) pequeno, alinhado ao topo da mensagem; em respostas seguidas ele aparece só na primeira do grupo (classe `.is-cont` nas seguintes, que mantêm o alinhamento). Mensagens do visitante sem avatar
- Aparece após o usuário rolar além da seção hero
- **12 fluxos de conversa** pré-definidos: sobre, resumo, experiência, cargo atual, tecnologias, formação, certificações, contato
- Balão de sugestão automática após 30s de inatividade ou ao rolar >300px, no mesmo vidro do botão (translúcido, borda com brilho, sombra suave, pontinha apontando para o botão), sem ícone e com contraste AA nos dois temas
- Text-to-speech com detecção de idioma e seleção de voz do navegador
- **Som desativado por padrão** — toast sugere ativar ao abrir o chat pela primeira vez
- Integração com o modal de contato diretamente pelo chat
- Textos completamente bilíngues (pt-BR / en)
- Reset automático ao trocar de idioma

### Verificação de Primeira Visita (Cloudflare Turnstile)
- Tela de verificação exibida na primeira visita, antes do conteúdo do site
- Widget Turnstile em modo **Managed**: visitantes legítimos são validados automaticamente, sem clique; tráfego suspeito recebe o desafio interativo
- Token validado no servidor (`POST /api/verify-visit`), que grava o cookie `ls_verified` por **30 dias**; nas visitas seguintes a tela não aparece
- Script inline no `<head>` lê o cookie antes da renderização, evitando que o conteúdo pisque antes da verificação
- Conteúdo da página fica `inert` (fora do foco e do leitor de tela) enquanto a verificação está pendente
- Crawlers e geradores de prévia de link (Google, LinkedIn, WhatsApp etc.) não passam pela tela, preservando SEO e Open Graph
- Fail-open: se o Turnstile ou a API estiverem indisponíveis, ou se houver erro de configuração do widget (códigos `110xxx`/`400xxx`, ex.: hostname não cadastrado), o site é liberado para não bloquear visitantes reais
- Estados localizados (pt-BR / en): verificando, desafio, erro com botão "Tentar novamente"
- Tema do widget acompanha o tema claro/escuro do site
- Proteção na camada do navegador: o HTML continua acessível a requisições diretas. Para bloqueio no servidor, seria necessário um Vercel Routing Middleware validando o cookie

### Mapa de Localização
- Card de localização com popup de mapa integrado (Google Maps iframe)
- Carregamento lazy do iframe

### Disponibilidade (Contato)
- Abaixo do texto "Estou aberto a novas oportunidades..." fica um destaque (`.contact-availability`, caixa translúcida na cor primária com a bolinha verde do selo do topo): "Disponível para oportunidades na Europa: inicialmente remoto, com interesse em realocação." (en: "Open to opportunities in Europe: remote at first, open to relocation."). Largura automática até o limite do container: em uma linha no desktop e no tablet (1440, 1024 e 768px) e com quebra natural em telas menores (2 a 3 linhas em 390px), com a bolinha centralizada na primeira linha. Contraste AA nos dois temas; a bolinha não pulsa com menos movimento. Os cards de contato não mudaram (o card Localização mostra só "Curitiba - PR, Brasil")
- Logo abaixo do destaque, o botão "Tem uma oferta na Europa? Fale comigo no WhatsApp" (en: "Have an offer in Europe? Message me on WhatsApp"), no estilo dos botões secundários, com ícone genérico de balão de conversa (não o logotipo do WhatsApp)
- A resposta de contato do chat (pt e en) traz o mesmo texto de disponibilidade e avisa que oportunidades na Europa podem ser tratadas direto pelo WhatsApp (sem mostrar o número)

### WhatsApp (oportunidades na Europa)
- O número não aparece legível no HTML nem no JS: fica codificado em `cta.js` e o link `https://wa.me/<número>?text=...` é montado só no clique, com a mensagem pré-preenchida no idioma atual (pt: "Olá Leandro, vi seu site e tenho uma oportunidade na Europa para você."; en: "Hi Leandro, I saw your website and I have an opportunity in Europe for you."). Abre em nova aba com `noopener,noreferrer`; nada é enviado automaticamente
- Dois pontos de entrada (`[data-whatsapp]`): o botão da seção Contato e, no modal de contato, a caixa "Tenho uma oportunidade na Europa" (en: "I have an opportunity in Europe"), que ao ser marcada revela com animação suave (grid 0fr -> 1fr) o botão "Falar direto no WhatsApp" (en: "Chat on WhatsApp"). Desmarcada, o botão fica `inert` e fora do foco. O formulário continua funcionando igual, marcado ou não (a caixa não entra no envio e é desmarcada no reset)
- Foco visível, área de toque mínima de 44px, contraste AA nos dois temas e sem rolagem lateral em 390px

### Download do currículo
- O botão "Baixe o currículo do Leandro" baixa direto, sem abrir o PDF em aba: o PDF fica em `/Curriculo-Leandro-Severo.pdf`, com atributo `download="Curriculo-Leandro-Severo.pdf"` no link (também no link do chat) e `Content-Disposition: attachment; filename="Curriculo-Leandro-Severo.pdf"` no `vercel.json` (testing e produção). O caminho antigo `/Curriculo-Leandro.pdf` redireciona (307) para o novo, para links antigos continuarem funcionando. O arquivo mudou de nome porque, no caminho antigo, a Vercel seguia entregando o PDF com os cabeçalhos de uma publicação anterior (`inline`), ignorando a regra nova
- Download só ao fim da animação (`cta.js`): no clique o link tem `preventDefault`, a seta desce para dentro da bandeja e a barra de progresso preenche o botão (~800ms); quando a barra chega a 100% (`animationend`, com teto de ~880ms para caber na janela de ativação do Safari/iOS) o download é disparado com um clique programático no PRÓPRIO link (mesmo href e atributo `download`, com uma marca para não entrar em loop; sem fetch/blob nem `window.open`). Em seguida o ícone vira check com "Baixado!" (en: "Downloaded!") por ~2s e volta ao normal. Durante a animação e o "Baixado!" novos cliques são ignorados (um único download). Ctrl/Cmd/Shift/Alt + clique, clique do meio e "Salvar link como" seguem o comportamento nativo; sem JavaScript o link baixa normalmente. Enter no teclado segue o mesmo fluxo. A região `aria-live` anuncia "Preparando download" no clique e "Download iniciado" no disparo (en: "Preparing download" / "Download started"). A largura do botão não muda durante o efeito. Só `transform` e `opacity` animam: a barra usa `scaleX()`, e bandeja, seta e check são três SVGs próprios (a seta e o check animam como elementos HTML, na GPU, sem repintar o botão). `will-change` vale só enquanto a classe `.is-downloading` existe, e o brilho do botão é fixo (a sombra não tem transição)
- Com `prefers-reduced-motion`: sem animação, baixa na hora e mostra "Baixado!"

---

## Estrutura do Projeto

```
/
├── index.html                   # Entrada principal — 700+ linhas
├── main.js                      # Lógica central: tema, i18n, skills, timeline, animações
├── i18n.js                      # Dicionário de traduções (pt-BR + en, 150+ chaves)
├── chat.js                      # Assistente virtual: fluxos, TTS, FAB, sugestões
├── contact-modal.js             # Modal de contato: validação, estados, Turnstile
├── visit-gate.js                # Verificação de primeira visita (Turnstile + cookie)
├── site-meta.js                 # Seção "Sobre o site" (fluxo animado, simular deploy, painel ao vivo) e versão no rodapé
├── cta.js                       # Download do currículo (efeito e anúncio) e links do WhatsApp montados no clique
├── turnstile.js                 # Carregamento compartilhado do script e tema do Turnstile
├── style.css                    # Estilos globais com CSS custom properties e camada Liquid Glass (~3500 linhas)
├── vite.config.js               # Configuração do Vite (SPA fallback)
├── vercel.json                  # Configuração de deploy (rewrites SPA, cabeçalhos, cron diário de /api/health)
├── .env.example                 # Variáveis para uso local (chaves de TESTE do Turnstile)
├── .github/workflows/health.yml # Alerta semanal: checa /api/health em produção e homologação
├── package.json                 # Dependências e scripts
├── .env                         # Variáveis de ambiente (não versionado)
│
├── api/
│   ├── contact.js               # Endpoint POST /api/contact (validação, Resend, MongoDB)
│   ├── verify-visit.js          # Endpoint POST /api/verify-visit (Turnstile da primeira visita)
│   ├── health.js                # Endpoint GET /api/health (ping no MongoDB + variáveis; keep-alive e monitoramento; exige token)
│   ├── status.js                # Endpoint GET /api/status (público: só "operational"/"degraded" + checkedAt; cache de 5 min na CDN)
│   └── lib/
│       ├── health-checks.js     # Checks compartilhados por /api/health e /api/status (ping no MongoDB + variáveis)
│       ├── mongodb.js           # Conexão e utilitários MongoDB (rate limiting, TTL)
│       └── turnstile.js         # Validação server-side do token Turnstile (siteverify)
│
├── src/
│   └── assets/
│       ├── images.js            # Importação central de logo e avatares do chat (cache busting)
│       ├── logo.svg             # Logo (versão fundo escuro)
│       ├── logoparaofundobranco.svg # Logo (versão fundo claro)
│       ├── leandro.webp         # Foto do hero (640×800 vertical, com fundo, mesma para os dois temas)
│       ├── atendimento.webp     # Avatar do chat (tema claro, 128×128)
│       └── atendimentoescuro.webp   # Avatar do chat (tema escuro, 128×128)
│
└── public/
    ├── robots.txt
    ├── og-image.jpg             # Imagem de compartilhamento (Open Graph / Twitter), 1200x630
    ├── 404.html                 # Página "não encontrada" (pt/en), servida com status 404 pela Vercel
    ├── _redirects               # Redirects para Netlify (sem efeito na Vercel; as rotas ficam no vercel.json)
    └── icons/                   # Ícones SVG das tecnologias e dos emissores de certificação (carregados dinamicamente, sem import)
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
| 04 | **Certificados** | 3 em destaque + carrossel com 9 certificações e cursos, do mais recente para o mais antigo |
| 05 | **Experiência** | Timeline com 6 posições profissionais expandíveis (clique no card inteiro) |
| 06 | **Sobre o site** | "Por trás deste site": fluxo de entrega animado com simulação de deploy, painel ao vivo (status real, tempo de resposta, versão e data) e 5 pilares (no site aparece como "05.") |
| 07 | **Contato** | Destaque de disponibilidade (Europa), e-mail, LinkedIn, Instagram, localização com mapa e formulário modal (no site aparece como "06.") |

---

## API de Verificação de Visita

**Endpoint:** `POST /api/verify-visit` — corpo: `{ "token": "<token Turnstile>" }`

1. Valida o formato do token (string, até 2048 caracteres)
2. Verifica o token no `siteverify` da Cloudflare com `TURNSTILE_SECRET_KEY` e o IP do visitante
3. Em caso de sucesso, grava o cookie `ls_verified=1` (`Max-Age` de 30 dias, `Secure`, `SameSite=Lax`)

| Status | Significado | Comportamento no front-end |
|---|---|---|
| `200` | Verificado | Libera o site |
| `400` | Token ausente ou inválido | Exibe erro e botão "Tentar novamente" |
| `405` | Método não permitido | — |
| `500` | Falha ao contatar a Cloudflare | Libera o site (fail-open) |

---

## API de Contato

**Endpoint:** `POST /api/contact`

### Fluxo de processamento
1. Validação de campos (tipo, tamanho, regex)
2. Sanitização contra XSS (tags HTML, atributos de evento, protocolos perigosos)
3. Verificação do token Cloudflare Turnstile
4. Conexão ao MongoDB (desiste em ~4s se o cluster não responder)
5. Checagem de rate limit por IP e por e-mail (hash SHA256), quando o banco está disponível
6. Envio de e-mail ao admin via Resend
7. Envio de auto-resposta ao remetente
8. Registro da submission no MongoDB, quando o banco está disponível

**Resiliência:** uma falha no MongoDB (conexão, checagem do limite ou gravação) não impede o envio. O erro é registrado no log da função (`console.error` com a etapa e o tipo do erro, sem dados do visitante), o e-mail segue pelo Resend e o visitante recebe sucesso. Nesse caso o limite diário não é aplicado e o contato não é gravado no banco, mas chega por e-mail. Se o envio pelo Resend falhar, a API responde com erro. Uma conexão que falhou não fica em cache: a próxima requisição tenta conectar de novo.

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

### Liquid Glass

Tokens definidos no bloco "Liquid Glass" no fim do `style.css`. As regras usam o prefixo `[data-theme]` para sobrescrever os estilos anteriores sem `!important`.

| Token CSS | Modo Claro | Modo Escuro | Uso |
|---|---|---|---|
| `--glass-blur` | `blur(16px) saturate(170%)` | `blur(18px) saturate(160%)` | `backdrop-filter` das barras, botões, seletores, modal e chat (os cards de conteúdo não usam desfoque) |
| `--glass-bg` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.055)` | Fundo de cards, botões secundários e controles |
| `--glass-bg-hover` | `rgba(255,255,255,0.7)` | `rgba(255,255,255,0.085)` | Fundo no hover |
| `--glass-bg-strong` | `rgba(255,255,255,0.82)` | `rgba(8,12,26,0.74)` | Modal de contato e painel do chat (mais opaco para leitura) |
| `--glass-bg-bar` | `rgba(240,244,248,0.62)` | `rgba(4,6,15,0.55)` | Header, menu mobile e rodapé |
| `--glass-border` | `rgba(255,255,255,0.75)` | `rgba(255,255,255,0.13)` | Borda clara do vidro |
| `--glass-border-hover` | primária a 45% | `rgba(79,209,197,0.4)` | Borda no hover |
| `--glass-border-control` | `rgba(26,95,168,0.18)` | `rgba(255,255,255,0.13)` | Borda de botões pequenos e campos do formulário (no claro, a borda branca sumiria sobre o fundo) |
| `--glass-sheen` | gradiente branco 55% → 0 | gradiente branco 9% → 0 | Reflexo diagonal (`background-image`) |
| `--glass-highlight` | `inset` branco 90% | `inset` branco 12% | Brilho especular na borda superior |
| `--glass-shadow` / `--glass-shadow-hover` | sombra azulada suave | sombra preta + brilho teal | Profundidade em repouso (o box-shadow dos cards não muda no hover) / `--glass-shadow-hover` ficou sem uso nos cards |
| `--glass-shadow-hover-tight` | `0 6px 16px -6px` azulada | `0 6px 16px -6px` preta + brilho teal | Sombra de hover dos cards (Sobre, certificações, Experiência, contato e pilares), num `::after` que só muda de `opacity`: cabe no espaço entre cards (12-32px). Nas Tecnologias (8px entre cards) a sombra do `::after` é menor (~5px nas laterais) e também aparece no card selecionado |
| `--glass-solid` | `#f7fafd` | `#0b1020` | Fundo sólido usado nos fallbacks |
| `--glass-bg-tinted` | `rgba(255,255,255,0.55)` | `rgba(4,6,15,0.45)` | Fundo dos cards de certificação em destaque (no escuro, mais denso para o texto suave passar de 4.5:1) |

**Hover dos cards sem artefatos de GPU:** antes, a sombra de hover era animada no `box-shadow` (com `transition: all`) e os cards vizinhos tinham `backdrop-filter`, que reamostrava a sombra e o movimento do card a cada quadro e deixava manchas em outros cards (Experiência, "Quem sou eu") e uma "coluna" de sombra nas Tecnologias. Agora os cards de conteúdo não têm `backdrop-filter`, a transição é só de `border-color`, `background-color` e `transform`, e a sombra de hover fica num `::after` (`position: absolute; inset: -1px; border-radius: inherit; pointer-events: none`) com transição só de `opacity`. Com `prefers-reduced-motion`, o `::after` aparece sem transição.

Os botões com cor primária (LinkedIn, baixar currículo, botão do chat) mantêm a cor sólida e recebem um gradiente de brilho com `inset box-shadow`, sem perder contraste do texto.

### Header

| Token CSS | Modo Claro | Modo Escuro |
|---|---|---|
| `--color-header-bg` | `rgba(240,244,248,0.88)` | `rgba(4,6,15,0.75)` |
| `--color-header-shadow` | `rgba(26,95,168,0.08)` | `rgba(0,0,0,0.6)` |

Com o Liquid Glass, o fundo do header usa `--glass-bg-bar`; `--color-header-bg` continua como fallback em navegadores sem `backdrop-filter`.

### Cores Utilitárias Fixas

| Cor | Valor | Uso |
|---|---|---|
| Sucesso | `#22c55e` | Badge de status online |
| Dark toggle bg | `rgba(30,27,46,0.65)` | Fundo translúcido do botão de tema (dark) |
| Light toggle bg | `rgba(186,220,248,0.75)` | Fundo translúcido do botão de tema (light) |

---

## Performance

- **Build size total:** ~88KB JS + ~61KB CSS (gzip: ~30KB + ~11KB)
- **Zero dependências de framework front-end**
- Foto do hero e avatares do chat em **WebP**, no dobro do maior tamanho exibido (retina): hero 640×800 (proporção 4:5) com fundo, de corpo inteiro com a nuvem do Google Cloud ao fundo (~43KB, antes 577KB em SVG com PNG embutido; exibida em 20×25rem no desktop e até 16×20rem no mobile, limitada a 34% da altura da tela), e avatares 128×128 com transparência (~3–5KB, antes até 356KB)
- Foto do hero referenciada direto no HTML com `fetchpriority="high"`, para começar a baixar antes do JavaScript (melhor LCP)
- Biblioteca **Lottie** (~298KB) carregada sob demanda ao abrir o modal de contato, e não mais em toda visita
- Todas as imagens do site (logo, hero, avatar do chat) centralizadas em `src/assets/` — Vite gera hash automático no nome do arquivo (ex: `leandro-C8rK_Nfc.webp`), eliminando cache stale após deploy
- Favicon também injetado via JS com o mesmo hash, sem referência estática em HTML
- Ícones de tecnologias em `/public/icons/` carregados dinamicamente por string (sem import), com versionamento via query string (`?v=1`)
- Zero arquivos de imagem duplicados no projeto
- Imagens com `loading="eager"` (hero) e `loading="lazy"` (demais)
- CSS com variáveis nativas — sem preprocessador
- Animações com `requestAnimationFrame` e `IntersectionObserver`
- **Animações contínuas pausadas quando não aparecem:** cada bloco da página (`main > section`, "Voltar ao topo" e rodapé) é observado por um `IntersectionObserver` (`initMotionPause` em `main.js`); fora da tela ele recebe `.is-offscreen` e todas as animações CSS dentro dele (pulsos, quiques, nuvens do topo, fluxo) ficam com `animation-play-state: paused`. Com a aba oculta (`visibilitychange`), `html.is-page-hidden` pausa tudo
- **Loops de `requestAnimationFrame` só quando necessários:** o carrossel de certificações, que antes rodava o tempo todo (inclusive fora da tela), só anima com ele na tela e a aba visível; o fluxo do "Por trás deste site" para fora da tela e com a aba oculta (a simulação segura e continua ao voltar); o ponto da Trajetória só roda enquanto se move. O carrossel de Tecnologias do celular, que troca de slide a cada 4,5s, também só troca com ele na tela, a aba visível e sem o mouse em cima (antes seguia trocando fora da tela e repintava a página a cada troca)
- **Pulsos só com `transform` e `opacity`:** a bolinha verde do selo do topo e do destaque de disponibilidade, os pontos do painel ao vivo, o ponto da Trajetória e o brilho do easter egg animavam `box-shadow` (repintura a cada quadro). Agora o anel ou brilho fica numa camada própria (pseudo-elemento) e só escala/esmaece, com o mesmo visual
- Medição (Chrome com GPU, 1440px, clique no botão do currículo e rolagem logo em seguida, build de produção): os números de antes x depois estão em `.tmp/perf-curriculo/` (traces que abrem no painel Performance do DevTools)
- Fontes via `font-display: swap`

---

## Acessibilidade e SEO

### Acessibilidade
- HTML5 semântico (`header`, `main`, `section`, `article`, `footer`, `nav`)
- `aria-label`, `aria-expanded`, `aria-hidden`, `aria-live`, `aria-required` em todos os elementos interativos
- Navegação completa por teclado, com foco visível (`:focus-visible`) em links, botões e campos nos dois temas: contorno de 2px na cor primária
- Área de toque mínima de 44×44px nos botões pequenos (idioma, tema, menu e setas do carrossel) via pseudo-elemento invisível, sem alterar o tamanho visual
- Sem rolagem horizontal no celular: `main { overflow-x: clip }` corta o deslocamento inicial da animação de entrada do card "Sobre" (`translateX(32px)`), que deixava a página 9px mais larga até o card aparecer; a animação visível não muda
- `prefers-reduced-motion: reduce` desliga o quique do "Explorar portfólio" e do "Voltar ao topo" e remove o reflexo diagonal do vidro
- Contraste dos textos sobre vidro medido nos dois temas (mínimo 4.5:1); no escuro, os cards de certificação em destaque e o cabeçalho/opções do chat usam fundo um pouco mais denso para atingir o mínimo
- Ajustes de cor de texto para 4.5:1: verde do chat no tema claro `#107837` (status "Online" e botão "Quero entrar em contato"), placeholder do formulário sem a opacidade extra de 60%, rótulos "Explorar portfólio" e "Voltar ao topo" sem a opacidade de 75% e nome da tecnologia em tom ajustado da cor da marca (mais escuro no claro; mais claro no escuro para Azure, Microsoft 365 e Kubernetes)
- Contraste de cores adequado (WCAG AA)
- Liquid Glass com fallbacks: `prefers-reduced-transparency: reduce` e `prefers-contrast: more` trocam o vidro por fundos sólidos (o segundo também reforça as bordas), e navegadores sem `backdrop-filter` (`@supports`) usam fundos opacos
- Textos alternativos em imagens
- Feedback de validação com `role="alert"`

### SEO
- Meta tags: `description`, `author`, `robots` (`index, follow` em produção)
- `<link rel="canonical" href="https://leandrosevero.com.br/">`
- Open Graph completo: `og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`, `og:locale` e `og:image` (`https://leandrosevero.com.br/og-image.jpg`, 1200x630, com `og:image:type`, `width`, `height` e `alt`)
- Twitter/X Card `summary_large_image` (`twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`)
- Imagem de compartilhamento `public/og-image.jpg` (1200x630, JPG ~76 KB, tema escuro): foto, "Leandro Severo", "Supervisor de DevOps" e "leandrosevero.com.br"
- Dados estruturados JSON-LD `Person` no `<head>`: `name`, `url`, `image`, `jobTitle`, `worksFor` (Employer Tudo do RH), `address` (Curitiba, PR, BR), `alumniOf` (UNICURITIBA e PUCPR), `knowsAbout` e `sameAs` (LinkedIn e Instagram). Sem e-mail e sem telefone
- Todo o conteúdo e as meta tags estão no HTML servido (funciona sem JavaScript); o portão do Turnstile é liberado automaticamente para robôs (`bot`, `crawler`, `spider`, `facebookexternalhit`...)
- `sitemap.xml` gerado a cada build por um plugin no `vite.config.js`, com `<lastmod>` = data do build (fuso de Brasília); `robots.txt` aponta para ele
- Página 404 real: `public/404.html` (pt e en, tema e idioma do site, botão "Voltar ao início"), servida com status HTTP 404 para endereços inexistentes; só as seções `/sobre`, `/skills`, `/certificados`, `/experiencia`, `/sobre-o-site` e `/contato` são reescritas para a página inicial
- Homologação fora dos buscadores: `testing.leandrosevero.com.br` responde com `X-Robots-Tag: noindex, nofollow` (regra por host no `vercel.json`); produção segue indexável
- `lang` do documento atualizado conforme idioma selecionado

---

## Deploy

O projeto é hospedado na **Vercel** com as seguintes configurações:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "rm -rf node_modules && npm ci",
  "redirects": [{ "source": "/Curriculo-Leandro.pdf", "destination": "/Curriculo-Leandro-Severo.pdf", "permanent": false }],
  "rewrites": [
    { "source": "/:secao(sobre|skills|certificados|experiencia|sobre-o-site|contato)", "destination": "/" },
    { "source": "/:secao(sobre|skills|certificados|experiencia|sobre-o-site|contato)/", "destination": "/" }
  ],
  "headers": [
    { "source": "/Curriculo-Leandro-Severo.pdf",
      "headers": [{ "key": "Content-Disposition", "value": "attachment; filename=\"Curriculo-Leandro-Severo.pdf\"" }] },
    { "source": "/(.*)", "has": [{ "type": "host", "value": "testing.leandrosevero.com.br" }],
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }] }
  ],
  "crons": [{ "path": "/api/health", "schedule": "0 9 * * *" }]
}
```

Só os caminhos das seções (usados pela History API ao navegar pelo menu) são reescritos para `index.html`. Arquivos estáticos, `/api/*`, `/Curriculo-Leandro-Severo.pdf`, `/robots.txt`, `/sitemap.xml` e os assets são servidos normalmente, e qualquer outro endereço recebe `public/404.html` com status **404**. Em homologação, todas as respostas levam `X-Robots-Tag: noindex, nofollow`. O currículo (`/Curriculo-Leandro-Severo.pdf`; o caminho antigo `/Curriculo-Leandro.pdf` redireciona para ele) é servido com `Content-Disposition: attachment`, em testing e em produção, para baixar em vez de abrir no navegador.

### Ambientes

| Branch | Ambiente | URL |
|---|---|---|
| `develop` | Testes (homologação) | [testing.leandrosevero.com.br](https://testing.leandrosevero.com.br) |
| `main` | Produção | [leandrosevero.com.br](https://leandrosevero.com.br) |

**Fluxo de publicação:** alterações são feitas e enviadas para `develop` (deploy automático no ambiente de testes). Após validação, abre-se um Pull Request de `develop` para `main`; o merge dispara o deploy de produção. Push, merge ou rebase na `main` só acontecem com autorização explícita do responsável (regra registrada no `AGENTS.md`).

A meta tag `<meta name="deploy-check">` no `<head>` do `index.html` contém a data da última verificação do fluxo de deploy e pode ser conferida no código-fonte de cada ambiente.

### Monitoramento e keep-alive do banco

**Por que existe:** o cluster gratuito (M0) do MongoDB Atlas é pausado automaticamente após um período sem conexões. Com o cluster pausado, o formulário de contato perde o limite diário e o registro dos envios (o e-mail continua saindo, ver Resiliência na API de Contato). O keep-alive abre uma conexão por dia para manter o cluster ativo, e o alerta semanal avisa se algum ambiente quebrar.

| Parte | Onde | O que faz |
|---|---|---|
| `/api/health` | `api/health.js` | Faz `ping` no MongoDB com uma conexão real (timeout de 4s) e confere se as variáveis do Turnstile, do Resend e de contato existem (sem mostrar valores e sem enviar e-mail). Responde `200 {"status":"ok","checks":{...}}` ou `503 {"status":"error","failed":[...]}`. Exige `Authorization: Bearer <HEALTHCHECK_TOKEN>` ou `Bearer <CRON_SECRET>`; sem token válido, `401` sem detalhes. Sempre `Cache-Control: no-store` |
| `/api/status` | `api/status.js` | Versão **pública** (sem token) dos mesmos checks (`api/lib/health-checks.js`), usada pelo painel ao vivo da seção "Sobre o site" (o site mostra só o status; nada desta tabela aparece no site). Responde só `{"status":"operational"\|"degraded","checkedAt":"<ISO>"}`, sem nomes de variáveis, tempos internos ou mensagens de erro. `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`: a CDN da Vercel guarda a resposta por 5 min, então o banco não é consultado a cada visita |
| Cron diário da Vercel | `vercel.json` (`crons`) | Chama `/api/health` todo dia às 09:00 UTC (06:00 em Brasília). É o keep-alive: mantém o cluster ativo mesmo se o repositório ficar meses sem commits. A Vercel só executa crons em **produção** (lidos do `vercel.json` da `main`); basta, porque produção e homologação usam o mesmo cluster |
| Alerta semanal do GitHub | `.github/workflows/health.yml` | Toda segunda-feira às 12:00 UTC (09:00 em Brasília) e sob demanda (`workflow_dispatch`), chama `/api/health` em produção e em homologação com o secret `HEALTHCHECK_TOKEN`. Falha se algum ambiente não responder `200` com `"status":"ok"` (o redirecionamento SPA devolveria `200` com HTML), e o GitHub avisa o dono do repositório por e-mail. `schedule` e `workflow_dispatch` só funcionam com o arquivo na `main`; um `push` na `develop` que altere o workflow ou `api/health.js` também o executa, para validar antes de produção |

Exemplo de chamada manual (o token fica numa variável, nunca no histórico de comandos):

```bash
curl -s -H "Authorization: Bearer $HEALTHCHECK_TOKEN" https://testing.leandrosevero.com.br/api/health
```

---

## Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Chave do site do Cloudflare Turnstile (front-end, lida em `turnstile.js`; usada na verificação de primeira visita e no formulário). Embutida no build: alterações exigem novo deploy |
| `TURNSTILE_SECRET_KEY` | Chave secreta do Turnstile (servidor, lida em `api/lib/turnstile.js`; usada por `/api/verify-visit` e `/api/contact`) |
| `RESEND_API_KEY` | Chave da API Resend para envio de e-mails |
| `mongodb_MONGODB_URI` | String de conexão MongoDB (lida em `api/lib/mongodb.js`). Nome com prefixo `mongodb_` em minúsculas, criado pela integração MongoDB Atlas da Vercel; precisa existir também no Preview da `develop` para o formulário funcionar em homologação |
| `CONTACT_TO_EMAIL` | E-mail de destino dos formulários |
| `CONTACT_FROM_EMAIL` | Remetente dos e-mails enviados pelo formulário |
| `HEALTHCHECK_TOKEN` | Token aceito por `/api/health` (cabeçalho `Authorization: Bearer ...`), usado pelo GitHub Action de monitoramento. Mesmo valor em Production, no Preview da `develop` e no secret `HEALTHCHECK_TOKEN` do repositório no GitHub |
| `CRON_SECRET` | Token que a Vercel envia automaticamente nos crons (`Authorization: Bearer ...`); aceito por `/api/health`. Necessário só em Production, onde os crons rodam |

### Chaves do Turnstile por ambiente

| Ambiente | Onde configurar | `VITE_TURNSTILE_SITE_KEY` | `TURNSTILE_SECRET_KEY` |
|---|---|---|---|
| Produção (`main`) | Vercel → Production | chave real | chave real |
| Homologação (`develop`) | Vercel → Preview, branch `develop` | `1x00000000000000000000AA` (teste) | `1x0000000000000000000000000000000AA` (teste) |
| Local | `.env.local` (copiar de `.env.example`) | `1x00000000000000000000AA` (teste) | `1x0000000000000000000000000000000AA` (teste) |

As chaves de teste oficiais da Cloudflare sempre passam e funcionam em qualquer domínio; testes automatizados usam somente elas. Para forçar o desafio interativo localmente, use a site key `3x00000000000000000000FF`.

Os hostnames `leandrosevero.com.br` e `www.leandrosevero.com.br` precisam estar cadastrados no widget real do Turnstile no painel da Cloudflare.

**Fluxo de verificação:** o front obtém um token do widget (`turnstile.render` com a site key) e o envia para `/api/verify-visit` (primeira visita, grava o cookie `ls_verified` por 30 dias) ou `/api/contact` (formulário). O servidor valida o token em `https://challenges.cloudflare.com/turnstile/v0/siteverify` com a secret key e o IP do visitante; sem a secret configurada, a verificação falha.

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
