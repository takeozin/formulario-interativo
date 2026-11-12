import React, { useState } from 'react';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { EDUCATIONAL_URL } from '../../global/constants/config';
import { colors } from '../../global/styles/colors';
import {
  Background,
  BackgroundImage,
  Content,
  Footer,
  Hero,
  HeroCopy,
  HeroImage,
  HeroText,
  InviteCard,
  InviteText,
  InviteTitle,
  Overlay,
  Safe,
  Scroll,
  Subtitle,
  Title,
} from './style';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.jpg');
const PLAYER_NINJA = require('../../../assets/intent/ninja-jogador.png');

export default function DoneScreen({ navigation }) {
  const { answers, queue } = useForm();
  const [linkError, setLinkError] = useState('');
  const wantsToLearn = answers.intent === 'wants_to_learn' || queue?.wantsToLearn;

  async function handleOpenPlatform() {
    try {
      await Linking.openURL(EDUCATIONAL_URL);
    } catch (error) {
      setLinkError('Não foi possível abrir o link agora. Peça ajuda a alguém da equipe.');
    }
  }

  // A tela inicial limpa a sessão sozinha quando aparece.
  function handleNext() {
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
            <Title accessibilityRole="header">Missão concluída!</Title>
            <Subtitle>
              {answers.name ? `Valeu, ${answers.name}! ` : ''}Suas respostas foram registradas. Aproveite a Arena!
            </Subtitle>

            <Hero>
              <HeroImage
                source={PLAYER_NINJA}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
                accessible
                accessibilityLabel="Ninja jogador comemorando"
              />
              <HeroCopy>
                <HeroText>Mandou bem, jovem ninja.</HeroText>
                <HeroText>Obrigado por participar da jornada.</HeroText>
              </HeroCopy>
            </Hero>

            {wantsToLearn ? (
              <InviteCard>
                <InviteTitle>Quer aprender a criar jogos?</InviteTitle>
                <InviteText>
                  A Beast Maragames tem uma plataforma educacional para quem quer entrar no mercado de games.
                </InviteText>
                <PrimaryButton title="Conhecer a plataforma" onPress={handleOpenPlatform} />
                <FieldError message={linkError} />
              </InviteCard>
            ) : null}
          </Content>
        </Scroll>

        <Footer>
          <PrimaryButton
            title="Próximo participante"
            onPress={handleNext}
            variant={wantsToLearn ? 'secondary' : 'primary'}
            borderColor={wantsToLearn ? colors.gradientEnd : undefined}
            labelColor={wantsToLearn ? colors.onPrimary : undefined}
          />
        </Footer>
      </Safe>
    </Background>
  );
}
