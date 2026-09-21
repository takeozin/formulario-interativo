import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { AVATAR_OPTIONS } from '../../global/constants/formOptions';

// RF01 - Seleção de personagem. Nesta fase é só uma escolha simples;
// as imagens e animações dos ninjas entram na fase 2.
export default function CharacterScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [error, setError] = useState('');

  function handleSelect(id) {
    setError('');
    saveAnswers({ avatar: id });
  }

  function handleContinue() {
    if (!answers.avatar) {
      setError('Escolha um ninja para continuar.');
      return;
    }
    navigation.navigate('Name');
  }

  return (
    <ScreenLayout
      step={1}
      onBack={() => navigation.goBack()}
      title="Escolha seu ninja"
      subtitle="Ele vai acompanhar você nas próximas perguntas."
      footer={<PrimaryButton title="Continuar" onPress={handleContinue} />}
    >
      {AVATAR_OPTIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          selected={answers.avatar === option.id}
          onPress={() => handleSelect(option.id)}
        />
      ))}
      <FieldError message={error} />
    </ScreenLayout>
  );
}
