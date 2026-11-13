# Regras do Agente de IA

## Idioma de resposta

Sempre responder ao usuário em **portugues brasileiro (pt-BR)**, independentemente do idioma utilizado na pergunta ou instrucao.



## Ambientes e branches (regra obrigatória)

| Branch | Publica automaticamente em | Ambiente |
|---|---|---|
| `develop` | https://testing.leandrosevero.com.br | Homologação |
| `main` | https://leandrosevero.com.br | **PRODUÇÃO** |

* Todo trabalho é feito na `develop` (ou em branches que voltam para a `develop`).
* **Nunca** fazer push, merge ou rebase na `main` sem pedido explícito do usuário contendo a palavra **"produção"**.
* Pull Requests `develop → main` podem ser abertos quando o usuário pedir, mas **nunca** mesclados sem a autorização acima.
* Antes de pedir a promoção para produção, confirmar o deploy em https://testing.leandrosevero.com.br.
* A cada release, atualizar a versão do package.json junto com a tag (ex.: tag `v2.3.0` ↔ `"version": "2.3.0"`). O rodapé do site mostra essa versão.

### Cloudflare Turnstile

* Produção (`main`) usa as chaves reais; homologação (`develop`) e local usam as chaves de TESTE oficiais da Cloudflare (ver `.env.example`).
* Testes automatizados em testing/local usam as chaves de teste do Turnstile; nunca use as chaves reais em testes.
* Nunca escreva valores de chaves reais em código, commits, logs ou respostas.

### Monitoramento e keep-alive (não remover)

* `/api/health` (`api/health.js`) faz `ping` real no MongoDB e confere as variáveis de Turnstile, Resend e contato, sem expor valores e sem enviar e-mail. Só responde com `Authorization: Bearer <HEALTHCHECK_TOKEN>` ou `Bearer <CRON_SECRET>`.
* O cron diário em `vercel.json` é o **keep-alive** do cluster gratuito do MongoDB Atlas, que é pausado após um período sem conexões (já aconteceu e derrubou o formulário). Ele só roda em produção e precisa de `CRON_SECRET` em Production.
* `.github/workflows/health.yml` checa produção e homologação toda segunda e avisa por e-mail se algum falhar. Usa o secret `HEALTHCHECK_TOKEN` do GitHub.
* Tokens (`HEALTHCHECK_TOKEN`, `CRON_SECRET`) nunca vão para código, commits, logs ou respostas.



## Atualização obrigatória do README_SITE.md

Sempre que houver qualquer alteração no projeto, o arquivo README_SITE.md deve ser atualizado obrigatoriamente antes da conclusão da tarefa.

### Quando atualizar

* Novas funcionalidades
* Alterações de comportamento
* Mudanças na arquitetura
* Alterações em APIs
* Novas integrações
* Mudanças de build, deploy ou infraestrutura

### Como atualizar

A atualização deve:

1. Respeitar a estrutura existente do README (não alterar organização sem necessidade)

2. Inserir informações nas seções corretas:

   * Funcionalidades → novas features
   * Tecnologias → novas libs ou serviços
   * API → mudanças de endpoint ou fluxo
   * Estrutura → novos arquivos/pastas
   * Performance / SEO / Acessibilidade → melhorias técnicas

3. Manter o mesmo padrão de escrita técnica e detalhamento

4. Não duplicar informações existentes

5. Atualizar dados antigos, não apenas adicionar novos

### Checklist obrigatório antes de finalizar

* [ ] README_SITE.md atualizado corretamente
* [ ] Informação inserida na seção adequada
* [ ] Nenhuma informação desatualizada permanece

Essa etapa é obrigatória e bloqueia a finalização da tarefa se não for cumprida.
