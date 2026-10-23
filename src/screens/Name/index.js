import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { NAME_MAX_LENGTH, validateName } from '../../utils/validators';
import { Hint, Input, Label } from './style';
import { selectionFeedback } from '../../services/haptics';

export default function NameScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [name, setName] = useState(answers.name);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  function handleChange(text) {
    setName(text);
    setError('');
  }

  function handleContinue() {
    const message = validateName(name);
    if (message) {
      setError(message);
      return;
    }
    saveAnswers({ name: name.trim() });
    selectionFeedback();
    navigation.navigate('Age');
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
      <FieldError message={error} />
    </ScreenLayout>
  );
}