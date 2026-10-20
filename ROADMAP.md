# Roadmap: Formulário Interativo (Arena Itinerante)

> **Status (20/10/2026): fase 1 concluída; envio ao Supabase implementado e aguardando teste.** O app roda no celular pelo Expo Go, grava as respostas no próprio aparelho, sem internet, e envia as respostas completas ao Supabase quando há conexão (branch `feat/sync-supabase`, ainda sem teste no celular). Ainda **não está pronto para uso em evento**: falta testar o envio no celular e fechar com a Beast MaraGames os textos que hoje são rascunho.

Equipe **Soulstar** (Programação Mobile, Engenharia de Software, UNDB): Lucas Takeo, Rui Elias, Marcelo Emanuel, Marcos André, Matheus Gomes e Lindoar Guagliardo.
Cliente: Arena Itinerante, Beast MaraGames. Repositório: `takeozin/formulario-interativo`.

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

### 1. Conteúdo oficial com a Beast MaraGames · importância alta · dificuldade baixa
O app coleta dados de menores; sem o texto aprovado ele não pode ir a evento. Depende de resposta do cliente, por isso é o primeiro pedido a sair.
- [ ] Pedir ao cliente o texto de autorização definitivo
- [ ] Confirmar as seis faixas de idade (`src/global/constants/formOptions.js`)
- [ ] Receber o link real da plataforma educacional (`EDUCATIONAL_URL`)
- [ ] Atualizar `CONSENT_VERSION` quando o texto mudar (a versão é gravada junto com cada resposta)

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
- [ ] Testar: responder offline, voltar a ficar online, conferir as linhas no Supabase (envio implementado na branch feat/sync-supabase, aguardando teste no celular (Expo Go) antes do merge na main)

### 3. Cores do Style Guide · importância média · dificuldade baixa
- [ ] Pedir o Style Guide à Beast MaraGames (pode ir junto com o pedido do item 1)
- [ ] Trocar os valores em `src/global/styles/colors.js`
- [ ] Conferir contraste do texto nas telas (o público inclui crianças e o uso é em totem/tablet)

## 🎮 Fase 3: gamificação (fazer depois)

Objetivo: o formulário vira uma experiência de jogo com o ninja. Fica separado porque é o item mais trabalhoso e depende de arte que talvez ainda não exista; assim ele não atrasa a entrega da fase 2.

### 4. Telas animadas com o ninja · importância alta · dificuldade alta
A validação e a gravação já existem; muda só a camada visual de Character, Name e Age.
- [ ] Definir quem produz a arte do ninja (cliente ou Soulstar) e o formato (sprites ou Lottie)
- [ ] Escolher a biblioteca de animação (ex.: `react-native-reanimated`, `lottie-react-native`) compatível com o Expo SDK 57
- [ ] Character animado
- [ ] Name animado
- [ ] Age animado
- [ ] Testar desempenho em aparelho mais fraco (o totem/tablet do evento)

### 5. Vibração do corte e da pincelada · importância baixa · dificuldade baixa
Só faz sentido com as animações prontas.
- [ ] Novas funções em `src/services/haptics.js` (RF06 do DRDA)
- [ ] Ligar a vibração aos momentos certos da animação

## ❓ Decisões pendentes
- [x] Já existe um projeto Supabase para o app ou será criado do zero? (existe: `ikyoqrpvqtodingkjdwq`)
## 🔄 Sequência de Próximos Passos

1. **Mandar ao cliente um único pedido** com o texto de autorização, as faixas de idade, o link educacional, o Style Guide e a pergunta sobre a arte do ninja.
2. **Supabase** (item 2) enquanto o cliente responde.
3. **Aplicar o conteúdo e as cores** recebidos (itens 1 e 3) e testar o fluxo completo no celular.
4. **Fechar a fase 2** com teste em condição de evento (sem internet → com internet) e remover o console.log da tela Done que lista as respostas do aparelho (mostra nomes de visitantes no terminal).
5. **Começar a fase 3** pelas animações (item 4) e depois a vibração (item 5).

## ✅ Concluído (fase 1)
* **Fluxo do formulário:** 7 telas com React Navigation 7 (native-stack) e barra de progresso.
* **Validação:** campos obrigatórios em cada etapa (`src/utils/validators.js`), nome com até 40 letras.
* **Autorização por idade:** bloqueio de menor de idade sem autorização do responsável.
* **Persistência local:** SQLite com `FormContext` → `responseRepository` → `database`; as telas nunca escrevem SQL.
* **Avaliação:** nota de 1 a 5 e comentário opcional.
* **Componentes reutilizáveis:** ScreenLayout, ProgressHeader, PrimaryButton, OptionCard, RatingSelector, FieldError.
* **Protótipo no Figma:** enviado ao professor em 09/10/2026.
* **Relatório de evolução:** `Relatorio de Evolucao - Formulario Interativo.pdf`.
