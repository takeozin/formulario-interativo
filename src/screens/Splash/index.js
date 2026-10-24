import React from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import {
  Background,
  BackgroundImage,
  BottomOverlay,
  ButtonWrapper,
  Overlay,
  Safe,
  Subtitle,
  Title,
  TitleWrapper,
} from './styles';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.png');

export default function SplashScreen({ navigation }) {
  return (
    <Background>
      <BackgroundImage source={BACKGROUND_IMAGE} resizeMode="cover" />
      <Overlay />
      <BottomOverlay />
      <Safe>
        <TitleWrapper>
          <Title accessibilityRole="header">Arena Itinerante</Title>
          <Subtitle>Sua jornada ninja está prestes a começar</Subtitle>
        </TitleWrapper>
        <ButtonWrapper>
          <PrimaryButton title="iniciar aventura..." onPress={() => navigation.navigate('Welcome')} />
        </ButtonWrapper>
      </Safe>
    </Background>
  );
}
