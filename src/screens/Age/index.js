import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import SlashEffect from '../../components/SlashEffect';
import { useForm } from '../../contexts/FormContext';
import { AGE_RANGES } from '../../global/constants/formOptions';
import { BlockedCard, BlockedText, Grid } from './style';

export default function AgeScreen({ navigation }) {
  const { answers, saveAnswers, discardSession } = useForm();
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [slash, setSlash] = useState({ x: 0, y: 0, n: 0 });
  const gridRef = useRef(null);

  function handleTouchStart(e) {
    const { pageX, pageY } = e.nativeEvent;
    gridRef.current?.measureInWindow((x, y) => {
      setSlash((s) => ({ x: pageX - x, y: pageY - y, n: s.n + 1 }));
    });
  }

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
      <View ref={gridRef} onTouchStart={handleTouchStart}>
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
        <SlashEffect trigger={slash} />
      </View>
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