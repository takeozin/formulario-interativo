export const NAME_MAX_LENGTH = 40;

// Devolve a mensagem de erro, ou null quando o valor é válido.
export function validateName(value) {
  const name = (value || '').trim();

  if (!name) {
    return 'Digite seu nome ou apelido.';
  }
  if (name.length < 2) {
    return 'Use pelo menos 2 letras.';
  }
  return null;
}
