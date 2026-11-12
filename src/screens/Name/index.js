import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import BrushStroke from '../../components/BrushStroke';
import { useForm } from '../../contexts/FormContext';
import { useImpactAnimation } from '../../hooks/useImpactAnimation';
import { brushFeedback } from '../../services/haptics';
import { NAME_MAX_LENGTH, validateName } from '../../utils/validators';
import {
  BackButton,
  BackText,
  Background,
  BackgroundImage,
  Content,
  ErrorSlot,
  ErrorText,
  Footer,
  Header,
  Hint,
  Input,
  NameTag,
  NinjaFrame,
  NinjaImage,
  Overlay,
  Progress,
  Safe,
  Scroll,
  Stage,
  Subtitle,
  TagHint,
  Title,
} from './style';

const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.jpg');
const SENSEI_IMAGE = require('../../../assets/sensei/sensei.png');

const AVATAR_IMAGES = {
  ninja_male: require('../../../assets/ninja/ninja-masculino.jpeg'),
  ninja_female: require('../../../assets/ninja/ninja-feminino.jpeg'),
};

// RF02 - Coleta de nome. Ao continuar com um nome válido, a pincelada atravessa
// o campo e a vibração dispara no instante do toque (brushFeedback). Por enquanto
// o pincel e a pincelada são formas simples, até a arte ficar pronta. Só a
// animação adia a navegação: a vibração nunca é esperada, e o botão Continuar
// em si não vibra.
export default function NameScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  const [name, setName] = useState(answers.name);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const { approach, follow, play, reset } = useImpactAnimation({ approachMs: 140, followMs: 300 });
  const painting = useRef(false);
  const avatarImage = AVATAR_IMAGES[answers.avatar] || SENSEI_IMAGE;
  const usingSensei = !AVATAR_IMAGES[answers.avatar];

  // Ao voltar para esta tela, limpa a pincelada e libera o botão de novo.
  useEffect(
    () =>
      navigation.addListener('focus', () => {
        painting.current = false;
        reset();
      }),
    [navigation, reset]
  );

  function handleChange(text) {
    setName(text);
    setError('');
  }

  function handleContinue() {
    // Toque repetido (ou Enter) durante a pincelada não repete a animação.
    if (painting.current) {
      return;
    }
    const message = validateName(name);
    if (message) {
      setError(message);
      return;
    }
    painting.current = true;
    saveAnswers({ name: name.trim() });
    play({ onImpact: brushFeedback, onDone: () => navigation.navigate('Age') });
  }

  return (
    <Background>
      <StatusBar style="light" />
      <BackgroundImage source={BACKGROUND_IMAGE} resizeMode="cover" />
      <Overlay />
      <Safe>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={8}
        >
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
                <Progress accessibilityLabel="Etapa 2 de 5">2 de 5</Progress>
              </Header>

              <Title accessibilityRole="header">Como podemos te chamar?</Title>
              <Subtitle>Digite um nome ou apelido para aparecer na sua jornada.</Subtitle>

              <Stage>
                <NinjaFrame>
                  <NinjaImage
                    source={avatarImage}
                    resizeMode={usingSensei ? 'contain' : 'cover'}
                    accessibilityIgnoresInvertColors
                    accessible
                    accessibilityLabel={usingSensei ? 'Sensei da Arena' : 'Ninja escolhido na etapa anterior'}
                  />
                  <NameTag $hasError={Boolean(error)}>
                    <TagHint>SEU NOME</TagHint>
                    <Input
                      value={name}
                      onChangeText={handleChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onSubmitEditing={handleContinue}
                      placeholder="Digite aqui"
                      maxLength={NAME_MAX_LENGTH}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="done"
                      accessibilityLabel="Nome ou apelido"
                      $focused={focused}
                      $hasError={Boolean(error)}
                    />
                  </NameTag>
                </NinjaFrame>
                <BrushStroke approach={approach} follow={follow} />
              </Stage>

              <Hint>Até {NAME_MAX_LENGTH} letras. O nome será usado para identificar você na fila.</Hint>
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
        </KeyboardAvoidingView>
      </Safe>
    </Background>
  );
}
