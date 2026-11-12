import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import CutCard from '../../components/CutCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { AGE_RANGES } from '../../global/constants/formOptions';
import {
  BackButton,
  BackText,
  Background,
  BackgroundImage,
  BlockedCard,
  BlockedText,
  Content,
  ErrorSlot,
  ErrorText,
  Footer,
  Grid,
  Header,
  Hero,
  HeroCopy,
  HeroImage,
  HeroLabel,
  HeroText,
  Overlay,
  Progress,
  Safe,
  Scroll,
  Subtitle,
  Title,
} from './style';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.jpg');
const PLAYER_NINJA = require('../../../assets/intent/ninja-jogador.png');

// RF03 - Coleta de idade. Cada faixa é cortada por uma lâmina ao ser escolhida
// (CutCard, estilo Fruit Ninja), e a vibração do corte dispara no instante do
// corte. O CutCard já cuida da vibração da escolha, então esta tela não vibra de novo.
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

  return (
    <Background>
      <StatusBar style="light" />
      <BackgroundImage source={BACKGROUND_IMAGE} resizeMode="cover" />
      <Overlay />
      <Safe>
        <Scroll>
          <Content>
            <Header>
              <BackButton
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <BackText>Voltar</BackText>
              </BackButton>
              <Progress accessibilityLabel="Etapa 3 de 5">3 de 5</Progress>
            </Header>

            <Title accessibilityRole="header">Qual é a sua faixa de idade?</Title>
            <Subtitle>Escolha uma opção para continuar sua jornada ninja.</Subtitle>

            <Hero>
              <HeroImage
                source={PLAYER_NINJA}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
                accessible
                accessibilityLabel="Ninja jogador pronto para treinar"
              />
              <HeroCopy>
                <HeroLabel>Treino ninja</HeroLabel>
                <HeroText>Escolha seu nível para liberar o próximo desafio.</HeroText>
              </HeroCopy>
            </Hero>

            <Grid accessibilityRole="radiogroup">
              {AGE_RANGES.map((range) => (
                <CutCard
                  key={range.id}
                  label={range.label}
                  selected={answers.ageRange === range.id}
                  dark
                  onPress={() => handleSelect(range.id)}
                />
              ))}
            </Grid>

            <ErrorSlot>
              {error ? (
                <ErrorText accessibilityRole="alert" accessibilityLiveRegion="polite">
                  {error}
                </ErrorText>
              ) : null}
            </ErrorSlot>

            {blocked ? (
              <BlockedCard accessibilityRole="alert">
                <BlockedText>
                  Na tela inicial você indicou ter 18 anos ou mais, mas escolheu uma faixa de idade menor. Para
                  participar com menos de 18 anos, um responsável precisa autorizar. Vamos recomeçar e apagar as
                  respostas desta tentativa.
                </BlockedText>
              </BlockedCard>
            ) : null}
          </Content>
        </Scroll>

        <Footer>
          <PrimaryButton
            title={blocked ? 'Recomeçar com um responsável' : 'Continuar'}
            onPress={blocked ? handleRestart : handleContinue}
          />
        </Footer>
      </Safe>
    </Background>
  );
}
