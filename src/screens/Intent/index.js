import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { INTENT_OPTIONS } from '../../global/constants/formOptions';

// RF05 - Classificação de intenção (filtro de conversão da Beast MaraGames).
export default function IntentScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [error, setError] = useState('');

  function handleSelect(id) {
    setError('');
    saveAnswers({ intent: id });
  }

  function handleContinue() {
    if (!answers.intent) {
      setError('Escolha uma opção para continuar.');
      return;
    }
    navigation.navigate('Feedback');
  }

  return (
    <ScreenLayout
      step={4}
      onBack={() => navigation.goBack()}
      title="O que você quer dos games?"
      subtitle="Escolha a opção que mais combina com você."
      footer={<PrimaryButton title="Continuar" onPress={handleContinue} />}
    >
      {INTENT_OPTIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          description={option.description}
          selected={answers.intent === option.id}
          onPress={() => handleSelect(option.id)}
        />
      ))}
      <FieldError message={error} />
    </ScreenLayout>
  );
}
