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
