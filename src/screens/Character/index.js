import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import NinjaAnimation from '../../components/NinjaAnimation';
import { useForm } from '../../contexts/FormContext';
import { AVATAR_OPTIONS } from '../../global/constants/formOptions';

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
        <React.Fragment key={option.id}>
          <NinjaAnimation
            gender={option.label.toLowerCase().includes('fem') ? 'feminino' : 'masculino'}
            size={120}
            idle={answers.avatar === option.id}
          />
          <OptionCard
            label={option.label}
            selected={answers.avatar === option.id}
            onPress={() => handleSelect(option.id)}
          />
        </React.Fragment>
      ))}
      <FieldError message={error} />
    </ScreenLayout>
  );
}