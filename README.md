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

## Como rodar

Requisitos: Node.js instalado, app Expo Go compatível com o SDK 57, e computador e celular na mesma rede Wi-Fi.

```bash
npm install
npx expo start
```

Se o celular não conectar, use `npx expo start --tunnel`.

## Estrutura de pastas

```
src/
├── components/   componentes reutilizáveis (layout, botões, cards, seletor de nota, validação)
├── screens/      telas do formulário (Welcome, Character, Name, Age, Intent, Feedback, Done)
├── navigation/   configuração do navegador de pilha (AppNavigator)
├── contexts/     contexto global do formulário (respostas em memória + gravação local)
├── services/     banco de dados SQLite, repositório de respostas e utilitário de haptics
├── global/
│   ├── styles/       tokens de cor e métricas de espaçamento
│   └── constants/    configurações gerais e opções dos campos do formulário
└── utils/        funções de validação dos campos
```
