// Opções de cada pergunta. Os ids são os valores gravados no banco.

export const CONSENT_OPTIONS = [
  {
    id: 'adult',
    label: 'Tenho 18 anos ou mais e concordo',
  },
  {
    id: 'guardian',
    label: 'Tenho menos de 18 anos e um responsável autorizou',
  },
];

export const AVATAR_OPTIONS = [
  { id: 'ninja_male', label: 'Ninja masculino' },
  { id: 'ninja_female', label: 'Ninja feminino' },
];

// TODO: confirmar as faixas com a Beast MaraGames.
// "minor: true" marca as faixas de menores de 18 anos (exigem autorização).
export const AGE_RANGES = [
  { id: 'under_12', label: 'Até 11 anos', minor: true },
  { id: '12_14', label: '12 a 14 anos', minor: true },
  { id: '15_17', label: '15 a 17 anos', minor: true },
  { id: '18_24', label: '18 a 24 anos', minor: false },
  { id: '25_34', label: '25 a 34 anos', minor: false },
  { id: '35_plus', label: '35 anos ou mais', minor: false },
];

export const INTENT_OPTIONS = [
  {
    id: 'casual_player',
    label: 'Apenas jogador',
    description: 'Quero me divertir e jogar.',
  },
  {
    id: 'wants_to_learn',
    label: 'Quero aprender a desenvolver / saber os bastidores',
    description: 'Tenho curiosidade sobre como os jogos são feitos e sobre o mercado de games.',
  },
];
