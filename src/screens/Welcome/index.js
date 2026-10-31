import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { CONSENT_OPTIONS } from '../../global/constants/formOptions';
import {
  BackButton,
  BackText,
  Background,
  BackgroundImage,
  Bubble,
  BubbleShadow,
  BubbleTailFill,
  BubbleTailOutline,
  BubbleText,
  BubbleTitle,
  BubbleWrap,
  Content,
  ErrorSlot,
  ErrorText,
  Footer,
  NextWrapper,
  Overlay,
  ReadMore,
  ReadMoreText,
  Safe,
  Scroll,
  SenseiImage,
  Speaker,
} from './style';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.png');
const SENSEI_IMAGE = require('../../../assets/sensei/sensei.png');

// Tela de boas-vindas e consentimento. O sensei explica, num balão de fala,
// para que servem os dados; "Ler mais" abre o texto completo. Avançar = o
// visitante concorda (precisa escolher o tipo de autorização); Voltar = não aceita.
export default function WelcomeScreen({ navigation }) {
  const { startSession, resetSession } = useForm();
  const [consentType, setConsentType] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const senseiIn = useRef(new Animated.Value(0)).current;
  const bubbleIn = useRef(new Animated.Value(0)).current;

  // Sempre que a tela inicial aparece, tudo recomeça do zero. No totem isso
  // garante que o próximo visitante nunca veja os dados do anterior.
  useFocusEffect(
    useCallback(() => {
      resetSession();
      setConsentType(null);
      setError('');
      setStarting(false);
      setExpanded(false);
    }, [resetSession])
  );

  // O sensei entra pela esquerda e, logo depois, o balão "salta" na tela.
  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.timing(senseiIn, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.spring(bubbleIn, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]);
    entrance.start();
    return () => entrance.stop();
  }, [senseiIn, bubbleIn]);

  function handleSelect(id) {
    setError('');
    setConsentType(id);
  }

  async function handleStart() {
    if (!consentType) {
      setError('Escolha uma resposta para continuar.');
      return;
    }
    setStarting(true);
    await startSession(consentType);
    navigation.navigate('Character');
  }

  const senseiStyle = {
    opacity: senseiIn,
    transform: [{ translateX: senseiIn.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }) }],
  };
  const bubbleStyle = {
    opacity: bubbleIn,
    transform: [{ scale: bubbleIn.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
  };

  return (
    <Background>
      <BackgroundImage source={BACKGROUND_IMAGE} resizeMode="cover" />
      <Overlay />
      <Safe>
        <Scroll>
          <Content>
            <BubbleWrap style={bubbleStyle}>
              <BubbleShadow />
              <Bubble>
                <Speaker>Sensei</Speaker>
                <BubbleTitle accessibilityRole="header">Bem-vindo à Arena Itinerante, jovem ninja!</BubbleTitle>
                <BubbleText>
                  São 5 perguntas rápidas, em cerca de 1 minuto. Vou guardar seu nome ou apelido, sua faixa de idade e
                  suas respostas. A Beast Maragames usa isso só para entender quem participa dos eventos.
                </BubbleText>
                {expanded ? (
                  <>
                    <BubbleText $spaced>Não pedimos contato nem documentos.</BubbleText>
                    <BubbleText $spaced>
                      As respostas ficam neste aparelho e são enviadas para um banco de dados protegido. Elas não são
                      vendidas nem repassadas a ninguém e ficam guardadas por até 12 meses. Para pedir que suas
                      respostas sejam apagadas, fale com a equipe no estande ou envie um e-mail para
                      contato@maragames.app.
                    </BubbleText>
                  </>
                ) : null}
                <ReadMore
                  onPress={() => setExpanded((value) => !value)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                >
                  <ReadMoreText>{expanded ? 'Ler menos' : 'Ler mais'}</ReadMoreText>
                </ReadMore>
                <BubbleTailOutline />
                <BubbleTailFill />
              </Bubble>
            </BubbleWrap>

            <SenseiImage
              source={SENSEI_IMAGE}
              resizeMode="contain"
              style={senseiStyle}
              accessibilityIgnoresInvertColors
              accessible
              accessibilityLabel="Sensei, um mestre ninja de barba branca segurando um cajado"
            />

            <ErrorSlot>
              {error ? (
                <ErrorText accessibilityRole="alert" accessibilityLiveRegion="polite">
                  {error}
                </ErrorText>
              ) : null}
            </ErrorSlot>

            {CONSENT_OPTIONS.map((option) => (
              <OptionCard
                key={option.id}
                label={option.label}
                selected={consentType === option.id}
                onPress={() => handleSelect(option.id)}
              />
            ))}
          </Content>
        </Scroll>

        <Footer>
          <BackButton
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <BackText>Voltar</BackText>
          </BackButton>
          <NextWrapper>
            <PrimaryButton title="Avançar" onPress={handleStart} loading={starting} />
          </NextWrapper>
        </Footer>
      </Safe>
    </Background>
  );
}
