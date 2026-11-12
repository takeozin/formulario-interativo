# Formulário Interativo

Projeto criado pelo grupo Soulstar - formulário interativo gamificado.

## Sobre

Trabalho da disciplina de Programação Mobile do curso de Engenharia de Software da UNDB, criado pelo grupo Soulstar para a Arena Itinerante da Beast MaraGames. O objetivo é coletar, em eventos presenciais, o perfil do público: personagem escolhido, nome ou apelido, faixa de idade, intenção de participação e feedback sobre a experiência.

## Funcionalidades da fase 1

- Fluxo: Welcome, Character, Name, Age, Intent, fila para quem quer jogar, Feedback e Done
- Validação de campos obrigatórios em cada etapa
- Gravação local em SQLite a cada etapa respondida
- Bloqueio de menor de idade sem autorização de responsável
- Avaliação por nota de 1 a 5 na tela de Feedback
- Fila compartilhada para quem escolhe jogar, com senha crescente, nome, chamada e janela de 5 minutos

## Tecnologias

- React Native
- Expo SDK 58
- React Navigation (native + native-stack)
- styled-components
- expo-sqlite
- expo-haptics
- expo-crypto
- Supabase (`@supabase/supabase-js`)
- NetInfo (`@react-native-community/netinfo`)
- Notificações locais (`expo-notifications`)

## Como rodar

Requisitos: Node.js instalado, app Expo Go compatível com o SDK 58, e computador e celular na mesma rede Wi-Fi.

```bash
npm install
npx expo start
```

Se o celular não conectar, use `npx expo start --tunnel`.

### Configurar o Supabase (.env)

O envio das respostas usa as variáveis do arquivo `.env`, que **não** vai para o GitHub. Para criar o seu:

1. Copie o modelo: `cp .env.example .env` (no PowerShell: `Copy-Item .env.example .env`).
2. Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com a URL e a chave **publishable/anon** do projeto (Painel do Supabase > Project Settings > API). Nunca use a `service_role` no app.
3. Para testar a fila já configurada no projeto, defina `EXPO_PUBLIC_QUEUE_ENABLED=true`.
4. Reinicie o `npx expo start` para o Expo carregar as variáveis.

Sem o `.env`, as respostas ficam só no aparelho e a fila compartilhada fica indisponível.

### Painel do atendente

Em um terminal separado, na pasta do projeto:

```powershell
python -m http.server 4179 --bind 127.0.0.1 --directory painel-atendente
```

Abra `http://127.0.0.1:4179/` no computador e entre com uma conta autorizada no Supabase. O painel local não está publicado. Não coloque senhas, tokens ou chaves secretas no código.

## Estrutura de pastas

```
src/
├── components/   componentes reutilizáveis (layout, botões, cards, seletor de nota, validação)
├── screens/      telas do formulário (Welcome, Character, Name, Age, Intent, Feedback, Done)
├── navigation/   configuração do navegador de pilha (AppNavigator)
├── contexts/     contexto global do formulário (respostas em memória + gravação local)
├── services/     banco de dados SQLite, repositório de respostas, cliente Supabase, sincronização e haptics
├── hooks/        hooks de nível alto (sincronização ao abrir o app e na volta da internet)
├── global/
│   ├── styles/       tokens de cor e métricas de espaçamento
│   └── constants/    configurações gerais e opções dos campos do formulário
└── utils/        funções de validação dos campos
supabase/
└── migrations/   migrations versionadas do banco remoto (Supabase)
```

## Banco de dados

- **Local (SQLite):** cada resposta fica na tabela `responses` do aparelho e é gravada a cada etapa, com `status` `in_progress` ou `completed`. As telas não escrevem SQL: o caminho é `FormContext` → `responseRepository` → `database`. A coluna `synced` indica se a resposta já foi enviada.
- **Remoto (Supabase/Postgres):** a tabela `responses` espelha a do aparelho, sem a coluna `synced`. A estrutura é criada pelas migrations em `supabase/migrations/`.
- **Permissões no Supabase:** com RLS ligado, o app (chave anon/publishable) só pode inserir respostas **completas** (`status = 'completed'`) que tenham a autorização registrada. A leitura é só pelo painel (service_role).
- **Sincronização:** o `syncService` envia ao Supabase as respostas completas ainda não enviadas (`synced = 0`) ao abrir o app, ao concluir um formulário e quando a internet volta. A resposta só é marcada como `synced = 1` depois da confirmação do servidor.
- **Fila de jogos:** quem escolhe `casual_player` entra em `Queue` antes de `Feedback`. A migration `supabase/migrations/20261111000000_create_game_queue.sql` cria a sequência diária, as inscrições e as funções RPC. O app consulta apenas a inscrição vinculada ao token privado do aparelho; o banco não libera leitura direta das tabelas.
- **Chamada do estande:** um administrador autenticado usa o painel para chamar a próxima pessoa, confirmar chegada e finalizar a partida. O app consulta a fila periodicamente e tenta exibir uma notificação local. O `service_role` nunca deve ser colocado no aplicativo ou no painel.
- **Limitações:** chamadas e conclusão são feitas pelo atendente; não há chamada automática. O Expo Go não garante notificações em segundo plano ou com o app fechado. O token da fila não é recuperado após reiniciar o app. A virada de data preserva inscrições ativas, mas a posição mostrada no celular ainda precisa ser revisada para considerar pessoas de dias anteriores.
- **Migrations:** as estruturas de administrador e fila foram aplicadas pelo SQL Editor ao projeto da equipe, sem registro automático no histórico de migrations. Antes de usar `supabase db push`, reconcilie o histórico; não reaplique as migrations cegamente.
