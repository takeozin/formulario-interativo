# Roadmap: Formulário Interativo (Arena Itinerante)

> **Status (23/10/2026): fase 2 concluída; fase 3 começou com as animações e a vibração.** O app roda no celular pelo Expo Go (SDK 58), grava as respostas no próprio aparelho, sem internet, envia as respostas completas ao Supabase quando há conexão e já conta com o texto de autorização, os links oficiais e a paleta de cores da Beast Maragames (PR #5). As telas Character, Name e Age ganharam uma versão provisória das animações, com formas simples no lugar da arte, e a vibração do corte e da pincelada (PR #7). O PR #4 (vibração ao avançar de tela) foi fechado em favor do #7.

Equipe **Soulstar** (Programação Mobile, Engenharia de Software, UNDB): Lucas Takeo, Rui Elias, Marcelo Emanuel, Marcos André, Matheus Gomes e Lindoar Guagliardo.
Cliente: Arena Itinerante, Beast Maragames. Repositório: `takeozin/formulario-interativo`.

## 📊 Baseline (16/10/2026)
- 7 telas em sequência: Welcome → Character → Name → Age → Intent → Feedback → Done
- Gravação em SQLite a cada etapa (`status` `in_progress` / `completed`); resposta abandonada no meio não se perde
- Coluna `synced` e funções `listPendingSync` / `markAsSynced` prontas em `src/services/responseRepository.js`, sem envio implementado
- Cores centralizadas em `src/global/styles/colors.js` (nenhuma tela usa cor solta), com valores provisórios
- `src/services/haptics.js` só tem `selectionFeedback` (vibração leve ao escolher opção)
- Rascunhos em `src/global/constants/config.js`: `CONSENT_VERSION = 'rascunho-1'` e `EDUCATIONAL_URL` apontando para `example.com`
- Sem versão web (o SQLite do Expo não está configurado para navegador)
- Protótipo navegável no Figma enviado ao professor em 09/10/2026

## 🚫 Fase 2: dados na nuvem e conteúdo oficial (fazer agora)

Objetivo: o app pode ser usado num evento de verdade e as respostas chegam ao cliente.

### 1. Conteúdo oficial (definido pela equipe) · importância alta · dificuldade baixa
Textos, faixas de idade e link definidos pela equipe Soulstar.
- [x] Texto de autorização definitivo na tela inicial (versão 1.0, com retenção de até 12 meses e canal para solicitar exclusão no estande ou pelo e-mail contato@maragames.app)
- [x] Faixas de idade: mantidas as 6 faixas em `src/global/constants/formOptions.js` (o corte em 18 anos atende à regra de autorização e "Até 11 anos" coincide com criança na LGPD)
- [x] Link real da plataforma educacional (`EDUCATIONAL_URL = 'https://maragames.app/'`, plataforma de cursos de criação de jogos da Beast Maragames)
- [x] `CONSENT_VERSION` atualizado para `'1.0'` (gravado junto com cada resposta)

### 2. Envio das respostas ao Supabase · importância alta · dificuldade média
Hoje as respostas ficam presas no aparelho.
- [x] Criar a tabela `responses` espelhando a do SQLite (`supabase/migrations/20261017084545_create_responses.sql`, aplicada em 17/10/2026)
- [x] RLS: o app só pode **inserir**; leitura apenas para o cliente/admin (testado com a chave anon; advisor de segurança sem alertas)
- [x] Definir de quem é o projeto Supabase: projeto da equipe Soulstar (`ikyoqrpvqtodingkjdwq`)
- [x] Serviço de sincronização em `src/services/` usando `listPendingSync` e `markAsSynced` (`src/services/syncService.js`)
- [x] Enviar só respostas `completed`: `listPendingSync` agora filtra `status = 'completed'`, então resposta em andamento ou descartada no aparelho (menor sem autorização) nunca chega ao Supabase
- [x] Restringir a policy de INSERT a `status = 'completed'` (nova migration), para o banco também barrar o envio de respostas incompletas (`supabase/migrations/20261020052648_restrict_insert_to_completed.sql`, aplicada em 20/10/2026; testado com a chave anon: `in_progress` recusado com 401, `completed` aceito, duplicado devolve `23505`; advisor de segurança sem alertas)
- [x] Marcar `synced = 1` apenas depois da confirmação do servidor
- [x] Reenviar automaticamente quando a internet voltar (evento presencial pode não ter rede): ao abrir o app, ao concluir o formulário e na volta da internet (NetInfo `isInternetReachable`, `src/hooks/useResponseSync.js`)
- [x] Evitar duplicata no reenvio: usar `insert` simples, sem `.select()`, e tratar o erro **409** (código `23505`) como "já enviado". O upsert com `ignoreDuplicates` **não funciona** só com permissão de INSERT: o `ON CONFLICT (id)` exige SELECT e volta 401
- [x] Chaves em `.env` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) e `.env.example` no repositório (`.env` no `.gitignore`)
- [x] Testar: responder offline, voltar a ficar online, conferir as linhas no Supabase (testado no Expo Go em 22/10/2026: fluxo completo, bloqueio de menor sem autorização, envio em modo avião, reenvio ao reabrir o app e resposta abandonada que não é enviada)
- [x] Remover o console.log da tela Done que listava no terminal as respostas salvas no aparelho (mostrava nomes de visitantes)

### 3. Paleta de cores · importância média · dificuldade baixa
- [x] Definir a paleta de cores (definida pela equipe Soulstar, com base na identidade visual da Beast Maragames: roxo `#7429C3` e vermelho `#B50928`)
- [x] Trocar os valores em `src/global/styles/colors.js` (PR #5)
- [x] Conferir contraste do texto nas telas (o público inclui crianças e o uso é em totem/tablet): todos os pares passam no WCAG AA (texto 17,3:1, texto secundário 6,0:1, botão 7,4:1, botão desabilitado 5,0:1, bordas 3,8:1)

### Atualização para o Expo SDK 58 · importância alta · dificuldade baixa
O Expo Go do celular atualizou para a SDK 58 e deixou de abrir o projeto, que estava na SDK 57. Branch `chore/sdk-58`, PR #6.
- [x] `expo` ~57.0.24 → ~58.0.17, `react-native` 0.86.3 → 0.88.0, `react` 19.2.3 → 19.3.0 e módulos nativos nas versões da SDK 58 (`npx expo install --fix`); nenhum código do app precisou mudar
- [x] Config plugins de `expo-sqlite` e `expo-status-bar` registrados no `app.json`
- [x] `expo-doctor` sem alertas (20/20) e bundle Android compilando (`expo export --platform android`)
- [x] Testar no celular (Expo Go SDK 58, 23/10/2026): fluxo completo enviado ao Supabase e resposta feita em modo avião enviada ao reabrir o app com internet
- [ ] Depois do merge, cada integrante roda `npm install` e atualiza o Expo Go

## 🎮 Fase 3: gamificação (fazer depois)

Objetivo: o formulário vira uma experiência de jogo com o ninja. Fica separado porque é o item mais trabalhoso e depende de arte que talvez ainda não exista; assim ele não atrasa a entrega da fase 2.

### 4. Telas animadas com o ninja · importância alta · dificuldade alta
A validação e a gravação já existem; muda só a camada visual de Character, Name e Age.

> **Referência visual:** a fera mascote da Beast Maragames usa roxo e vermelho (maragames.app). Pode servir de base para as cores do ninja e das animações, mas a decisão fica para quando a arte for produzida.
- [ ] Produzir a arte do ninja (equipe Soulstar) e definir o formato (sprites ou Lottie)
- [x] Escolher a biblioteca de animação: `Animated` do próprio React Native, com driver nativo e sem dependência nova (PR #7). Rever se a arte vier em Lottie
- [x] Versão provisória das animações com formas simples (PR #7): cartões de Character entram em sequência e "pulam" (`PopIn`), pincelada em Name (`BrushStroke`) e corte em Age (`CutCard`)
- [ ] Character animado com a arte do ninja
- [ ] Name animado com a arte do pincel e do pergaminho
- [ ] Age animado com a arte da lâmina
- [ ] Testar desempenho em aparelho mais fraco (o totem/tablet do evento)

### 5. Vibração do corte e da pincelada · importância baixa · dificuldade baixa
Só faz sentido com as animações prontas.
- [x] Novas funções em `src/services/haptics.js` (RF06 do DRDA): `cutFeedback` (impacto seco) e `brushFeedback` (impacto suave)
- [x] Ligar a vibração aos momentos certos da animação: `src/hooks/useImpactAnimation.js` dispara a vibração no instante do contato, e cada escolha vibra uma vez só (feito sobre as formas provisórias)
- [ ] Conferir o momento da vibração quando a arte entrar no lugar das formas

## ❓ Decisões pendentes
- [x] Já existe um projeto Supabase para o app ou será criado do zero? (existe: `ikyoqrpvqtodingkjdwq`)
## 🔄 Sequência de Próximos Passos

1. **Testar no celular** (Expo Go SDK 58) a paleta nova e as animações e vibração das telas Character, Name e Age, e cada integrante roda `npm install` e atualiza o Expo Go.
2. **Limpar os dados de teste** da tabela `responses` no Supabase antes de apresentar o app (inclui as respostas com `consent_version = 'rascunho-1'`).
3. **Arte** (item 4): produzir a arte do ninja, do pincel, do pergaminho e da lâmina e trocar as formas provisórias de Character, Name e Age, conferindo o momento da vibração.
4. **Testar desempenho** no totem/tablet do evento ou num aparelho mais fraco.


## ✅ Concluído (fase 1)
* **Fluxo do formulário:** 7 telas com React Navigation 7 (native-stack) e barra de progresso.
* **Validação:** campos obrigatórios em cada etapa (`src/utils/validators.js`), nome com até 40 letras.
* **Autorização por idade:** bloqueio de menor de idade sem autorização do responsável.
* **Persistência local:** SQLite com `FormContext` → `responseRepository` → `database`; as telas nunca escrevem SQL.
* **Avaliação:** nota de 1 a 5 e comentário opcional.
* **Componentes reutilizáveis:** ScreenLayout, ProgressHeader, PrimaryButton, OptionCard, RatingSelector, FieldError.
* **Protótipo no Figma:** enviado ao professor em 09/10/2026.
* **Relatório de evolução:** `Relatorio de Evolucao - Formulario Interativo.pdf`.
