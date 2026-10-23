import React, { useEffect, useRef, useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import BrushStroke from '../../components/BrushStroke';
import { useForm } from '../../contexts/FormContext';
import { useImpactAnimation } from '../../hooks/useImpactAnimation';
import { brushFeedback } from '../../services/haptics';
import { NAME_MAX_LENGTH, validateName } from '../../utils/validators';
import { Hint, Input, Label } from './style';

// RF02 - Coleta de nome. Ao continuar com um nome válido, a pincelada atravessa
// o campo e a vibração dispara no instante do toque (brushFeedback). Por enquanto
// o pincel e a pincelada são formas simples, até a arte ficar pronta. Só a
// animação adia a navegação: a vibração nunca é esperada, e o botão Continuar
// em si não vibra.
export default function NameScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [name, setName] = useState(answers.name);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const { approach, follow, play, reset } = useImpactAnimation({ approachMs: 140, followMs: 300 });
  const painting = useRef(false);

  // Ao voltar para esta tela, limpa a pincelada e libera o botão de novo.
  useEffect(
    () =>
      navigation.addListener('focus', () => {
        painting.current = false;
        reset();
      }),
    [navigation, reset]
  );

  function handleChange(text) {
    setName(text);
    setError('');
  }

  function handleContinue() {
    // Toque repetido (ou Enter) durante a pincelada não repete a animação.
    if (painting.current) {
      return;
    }
    const message = validateName(name);
    if (message) {
      setError(message);
      return;
    }
    painting.current = true;
    saveAnswers({ name: name.trim() });
    play({ onImpact: brushFeedback, onDone: () => navigation.navigate('Age') });
  }

  return (
    <ScreenLayout
      step={2}
      onBack={() => navigation.goBack()}
      title="Como podemos te chamar?"
      subtitle="Pode ser só o primeiro nome ou um apelido."
      footer={<PrimaryButton title="Continuar" onPress={handleContinue} />}
    >
      <Label>Nome ou apelido</Label>
      <Input
        value={name}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={handleContinue}
        placeholder="Digite aqui"
        maxLength={NAME_MAX_LENGTH}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        accessibilityLabel="Nome ou apelido"
        $focused={focused}
        $hasError={Boolean(error)}
      />
      <Hint>Até {NAME_MAX_LENGTH} letras.</Hint>
      <BrushStroke approach={approach} follow={follow} />
      <FieldError message={error} />
    </ScreenLayout>
  );
}
