# Roadmap: Formulário Interativo (Arena Itinerante)

> **Status (16/10/2026): fase 1 concluída.** O app roda no celular pelo Expo Go e grava as respostas no próprio aparelho, sem internet. Ainda **não está pronto para uso em evento**: falta enviar os dados ao cliente e fechar com a Beast MaraGames os textos que hoje são rascunho.

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
- [ ] Definir de quem é o projeto Supabase (equipe ou cliente) e criar a tabela `responses` espelhando a do SQLite
- [ ] RLS: o app só pode **inserir**; leitura apenas para o cliente/admin
- [ ] Serviço de sincronização em `src/services/` usando `listPendingSync` e `markAsSynced`
- [ ] Enviar só respostas `completed` e marcar `synced = 1` apenas depois da confirmação do servidor
- [ ] Reenviar automaticamente quando a internet voltar (evento presencial pode não ter rede)
- [ ] Evitar duplicata no reenvio (usar o `id` gerado pelo `expo-crypto` como chave)
- [ ] Chaves em `.env` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) e `.env.example` no repositório
- [ ] Testar: responder offline, voltar a ficar online, conferir as linhas no Supabase

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
- [ ] Já existe um projeto Supabase para o app ou será criado do zero?
- [ ] A arte do ninja vem da Beast MaraGames ou é produzida pela equipe?
- [ ] O totem/tablet do evento será usado na horizontal? (se sim, trocar `"orientation"` para `"default"` no `app.json`)

## 🔄 Sequência de Próximos Passos

1. **Mandar ao cliente um único pedido** com o texto de autorização, as faixas de idade, o link educacional, o Style Guide e a pergunta sobre a arte do ninja.
2. **Supabase** (item 2) enquanto o cliente responde.
3. **Aplicar o conteúdo e as cores** recebidos (itens 1 e 3) e testar o fluxo completo no celular.
4. **Fechar a fase 2** com teste em condição de evento (sem internet → com internet).
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
