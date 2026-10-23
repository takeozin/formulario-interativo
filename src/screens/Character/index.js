import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PopIn from '../../components/PopIn';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { AVATAR_OPTIONS } from '../../global/constants/formOptions';

// RF01 - Seleção de personagem. Os cartões entram animados e o escolhido dá um
// "pulo" (PopIn); as imagens dos ninjas entram quando a arte ficar pronta.
// A vibração ao escolher vem do próprio OptionCard.
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
      {AVATAR_OPTIONS.map((option, index) => (
        <PopIn key={option.id} index={index} selected={answers.avatar === option.id}>
          <OptionCard
            label={option.label}
            selected={answers.avatar === option.id}
            onPress={() => handleSelect(option.id)}
          />
        </PopIn>
      ))}
      <FieldError message={error} />
    </ScreenLayout>
  );
}
