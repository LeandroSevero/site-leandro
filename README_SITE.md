# Portfolio Leandro Severo - DevOps

Portfolio profissional desenvolvido com foco em performance, acessibilidade e SEO.

## Correções Implementadas

### Ortografia e Português
Todas as palavras foram corrigidas com acentuação adequada:
- Análise (ao invés de Analise)
- Pós-graduação (ao invés de pos-graduação)
- Prática (ao invés de pratica)
- Tecnológicas (ao invés de tecnologicas)
- Automação (ao invés de Automacao)
- Escaláveis (ao invés de escalaveis)
- Formação (ao invés de Formacao)
- Certificações (ao invés de Certificacoes)
- Básicas (ao invés de basicas)
- Trajetória (ao invés de Trajetoria)
- Estratégias (ao invés de estrategias)
- Usuários (ao invés de usuarios)

### Conteúdo
- Corrigido "Noções básicas de DA" para "Noções básicas de Disciplined Agile"
- Ano do footer atualizado dinamicamente
- Todas as informações de certificados atualizadas com dados corretos

## Tecnologias Utilizadas

- **Vite** - Build tool moderno e rápido
- **HTML5 Semântico** - Estrutura adequada para SEO
- **CSS3** - Design responsivo com variáveis CSS
- **JavaScript Vanilla** - Sem dependências externas

## Características

### Performance
- Build otimizado com Vite
- CSS e JS minificados
- Imagens com loading adequado (eager/lazy)
- Tamanho total do build: ~46KB

### Responsividade
- Mobile first
- Breakpoints: 768px (tablet) e 1024px (desktop)
- Menu mobile funcional
- Layout adaptável

### Acessibilidade
- HTML semântico
- ARIA labels e roles
- Contraste adequado de cores
- Navegação por teclado

### SEO
- Meta tags completas
- Open Graph para redes sociais
- Twitter Cards
- Estrutura semântica (header, main, section, article, footer)
- URLs amigáveis (âncoras)

### Funcionalidades
- Tema claro/escuro (persistente no localStorage)
- Menu mobile responsivo
- Scroll suave
- Header com efeito ao scroll
- Animações sutis

## Estrutura do Projeto

```
/
├── index.html          # Página principal
├── style.css          # Estilos globais
├── main.js            # JavaScript funcional
├── public/
│   └── logo.png       # Logo do site
├── package.json       # Dependências
└── README.md          # Documentação
```

## Como Usar

### Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

## Seções do Site

1. **Hero** - Apresentação com foto e links principais
2. **Sobre** - Formação e experiência resumida
3. **Skills** - Tecnologias e ferramentas
4. **Certificados** - Certificações e cursos
5. **Experiência** - Timeline profissional
6. **Contato** - Informações de contato

## Paleta de Cores

### Modo Claro
- Background: #ffffff
- Foreground: #0f172a
- Primary: #3b82f6
- Border: #e2e8f0

### Modo Escuro
- Background: #0f172a
- Foreground: #f1f5f9
- Primary: #3b82f6
- Border: #334155

## Performance

- LCP: < 1.5s
- CLS: < 0.1
- Build size: ~46KB total
- Zero JavaScript frameworks

## Compatibilidade

- Chrome/Edge (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Mobile browsers

## Melhorias Futuras

- [ ] Adicionar animações mais elaboradas
- [ ] Implementar blog/artigos
- [ ] Adicionar modo de impressão otimizado
- [ ] Integrar analytics
- [ ] Adicionar PWA support
