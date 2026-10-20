# Formulário Interativo

Projeto criado pelo grupo Soulstar - formulário interativo gamificado.

## Sobre

Trabalho da disciplina de Programação Mobile do curso de Engenharia de Software da UNDB, criado pelo grupo Soulstar para a Arena Itinerante da Beast MaraGames. O objetivo é coletar, em eventos presenciais, o perfil do público: personagem escolhido, nome ou apelido, faixa de idade, intenção de participação e feedback sobre a experiência.

## Funcionalidades da fase 1

- 7 telas em sequência: Welcome (com autorização), Character, Name, Age, Intent, Feedback e Done
- Validação de campos obrigatórios em cada etapa
- Gravação local em SQLite a cada etapa respondida
- Bloqueio de menor de idade sem autorização de responsável
- Avaliação por nota de 1 a 5 na tela de Feedback

## Tecnologias

- React Native
- Expo SDK 57
- React Navigation (native + native-stack)
- styled-components
- expo-sqlite
- expo-haptics
- expo-crypto
- Supabase (`@supabase/supabase-js`)
- NetInfo (`@react-native-community/netinfo`)

## Como rodar

Requisitos: Node.js instalado, app Expo Go compatível com o SDK 57, e computador e celular na mesma rede Wi-Fi.

```bash
npm install
npx expo start
```

Se o celular não conectar, use `npx expo start --tunnel`.

### Configurar o Supabase (.env)

O envio das respostas usa as variáveis do arquivo `.env`, que **não** vai para o GitHub. Para criar o seu:

1. Copie o modelo: `cp .env.example .env` (no PowerShell: `Copy-Item .env.example .env`).
2. Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com a URL e a chave **publishable/anon** do projeto (Painel do Supabase > Project Settings > API). Nunca use a `service_role` no app.
3. Reinicie o `npx expo start` para o Expo carregar as variáveis.

Sem o `.env` o app funciona normalmente, mas as respostas ficam só no aparelho.

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
