# CLAUDE.md

## Memória persistente (OBRIGATÓRIO)

Este repositório é a memória persistente do usuário. As sessões do Claude são
efêmeras, então **tudo que o usuário informar deve ser salvo aqui e enviado (push)**.

### No início de toda sessão
1. Leia `memory/INDEX.md` e os arquivos listados nele antes de responder.
2. Use essas informações como contexto (preferências, fatos, decisões, projetos).

### Sempre que o usuário informar algo relevante
- Fatos pessoais, preferências, decisões, contatos, tarefas, ideias, informações de negócio etc.
- Salve no arquivo de tema adequado em `memory/` (crie um novo se nenhum servir
  e registre-o em `memory/INDEX.md`).
- Formato de cada entrada: `- [AAAA-MM-DD] conteúdo`.
- Atualize/corrija entradas antigas em vez de duplicar; se algo mudou, marque a
  entrada antiga como substituída.
- Faça commit e push logo em seguida (`git push -u origin <branch-atual>`).
- **Nunca** salve senhas, chaves de API, números de cartão ou outros segredos —
  avise o usuário e salve apenas uma referência (ex.: "chave guardada na Vercel").
- O usuário pode pedir "esqueça X": remova a entrada e faça commit.

### Idioma
O usuário escreve em português (BR). Responda em português.
