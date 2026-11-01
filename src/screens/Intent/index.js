import React, { useState } from 'react';
import PopIn from '../../components/PopIn';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { INTENT_OPTIONS } from '../../global/constants/formOptions';
import { selectionFeedback } from '../../services/haptics';
import {
  BackButton,
  BackText,
  Background,
  BackgroundImage,
  Card,
  CardImage,
  CardImageFrame,
  CardText,
  CardTitle,
  ChoiceDot,
  ChoiceRing,
  Content,
  Description,
  ErrorSlot,
  ErrorText,
  Footer,
  Header,
  Overlay,
  Progress,
  Safe,
  Scroll,
  Stage,
  Subtitle,
  Title,
} from './style';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.jpg');

const INTENT_ART = {
  casual_player: {
    image: require('../../../assets/intent/ninja-jogador.png'),
    title: 'Quero jogar',
  },
  wants_to_learn: {
    image: require('../../../assets/intent/ninja-desenvolvedor.png'),
    title: 'Quero criar jogos',
  },
};

// RF05 - Classificação de intenção (filtro de conversão da Beast Maragames).
// A identidade visual muda, mas os ids gravados no banco continuam os mesmos.
export default function IntentScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [error, setError] = useState('');

  function handleSelect(id) {
    setError('');
    selectionFeedback();
    saveAnswers({ intent: id });
  }

  function handleContinue() {
    if (!answers.intent) {
      setError('Escolha um caminho para continuar.');
      return;
    }
    navigation.navigate('Feedback');
  }

  return (
    <Background>
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
              <Progress accessibilityLabel="Etapa 4 de 5">4 de 5</Progress>
            </Header>

            <Title accessibilityRole="header">O que você quer dos games?</Title>
            <Subtitle>Escolha o caminho que mais combina com a sua jornada.</Subtitle>

            <Stage accessibilityRole="radiogroup">
              {INTENT_OPTIONS.map((option, index) => {
                const art = INTENT_ART[option.id];
                const selected = answers.intent === option.id;

                return (
                  <PopIn key={option.id} index={index} selected={selected}>
                    <Card
                      onPress={() => handleSelect(option.id)}
                      activeOpacity={0.86}
                      $selected={selected}
                      accessibilityRole="radio"
                      accessibilityLabel={`${art.title}. ${option.description}`}
                      accessibilityState={{ selected }}
                    >
                      <CardImageFrame>
                        <CardImage source={art.image} resizeMode="cover" accessibilityIgnoresInvertColors />
                      </CardImageFrame>
                      <CardText>
                        <CardTitle>{art.title}</CardTitle>
                        <Description>{option.description}</Description>
                      </CardText>
                      <ChoiceRing $selected={selected}>{selected ? <ChoiceDot /> : null}</ChoiceRing>
                    </Card>
                  </PopIn>
                );
              })}
            </Stage>

            <ErrorSlot>
              {error ? (
                <ErrorText accessibilityRole="alert" accessibilityLiveRegion="polite">
                  {error}
                </ErrorText>
              ) : null}
            </ErrorSlot>
          </Content>
        </Scroll>

        <Footer>
          <PrimaryButton title="Continuar" onPress={handleContinue} />
        </Footer>
      </Safe>
    </Background>
  );
}
