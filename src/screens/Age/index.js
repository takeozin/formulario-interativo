import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { AGE_RANGES } from '../../global/constants/formOptions';
import { BlockedCard, BlockedText, Grid } from './style';

// RF03 - Coleta de idade. Nesta fase as faixas são botões comuns;
// a mecânica de corte (estilo Fruit Ninja) entra na fase 2.
export default function AgeScreen({ navigation }) {
  const { answers, saveAnswers, discardSession } = useForm();
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);

  function handleSelect(id) {
    setError('');
    setBlocked(false);
    saveAnswers({ ageRange: id });
  }

  function handleContinue() {
    const range = AGE_RANGES.find((item) => item.id === answers.ageRange);

    if (!range) {
      setError('Escolha uma faixa de idade para continuar.');
      return;
    }
    // LGPD: menor de 18 anos só participa com autorização de um responsável.
    if (range.minor && answers.consentType !== 'guardian') {
      setBlocked(true);
      return;
    }
    navigation.navigate('Intent');
  }

  async function handleRestart() {
    await discardSession();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  const footer = blocked ? (
    <PrimaryButton title="Recomeçar com um responsável" onPress={handleRestart} />
  ) : (
    <PrimaryButton title="Continuar" onPress={handleContinue} />
  );

  return (
    <ScreenLayout
      step={3}
      onBack={() => navigation.goBack()}
      title="Qual é a sua faixa de idade?"
      subtitle="Toque na opção que combina com você."
      footer={footer}
    >
      <Grid>
        {AGE_RANGES.map((range) => (
          <OptionCard
            key={range.id}
            compact
            label={range.label}
            selected={answers.ageRange === range.id}
            onPress={() => handleSelect(range.id)}
          />
        ))}
      </Grid>
      <FieldError message={error} />
      {blocked ? (
        <BlockedCard accessibilityRole="alert">
          <BlockedText>
            Na tela inicial você indicou ter 18 anos ou mais, mas escolheu uma faixa de idade menor. Para participar
            com menos de 18 anos, um responsável precisa autorizar. Vamos recomeçar e apagar as respostas desta
            tentativa.
          </BlockedText>
        </BlockedCard>
      ) : null}
    </ScreenLayout>
  );
}
