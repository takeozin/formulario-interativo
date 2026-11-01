import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import PopIn from '../../components/PopIn';
import PrimaryButton from '../../components/PrimaryButton';
import RatingSelector from '../../components/RatingSelector';
import { useForm } from '../../contexts/FormContext';
import {
  BackButton,
  BackText,
  Background,
  BackgroundImage,
  CharacterStage,
  CommentCount,
  CommentHeader,
  CommentInput,
  Content,
  ErrorSlot,
  ErrorText,
  Footer,
  Header,
  Label,
  NinjaImage,
  Overlay,
  Progress,
  RatingPanel,
  Safe,
  Scroll,
  Subtitle,
  Title,
} from './style';

const COMMENT_MAX_LENGTH = 300;
const BACKGROUND_IMAGE = require('../../../assets/intro/fundo-inicio.jpg');
const FEEDBACK_NINJA = require('../../../assets/feedback/ninja-feedback.png');

// RF04 / RNF01 - Feedback qualitativo sobre a experiência na Arena Itinerante.
export default function FeedbackScreen({ navigation }) {
  const { answers, finishSession } = useForm();
  const [rating, setRating] = useState(answers.rating);
  const [comment, setComment] = useState(answers.comment);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleRating(score) {
    setError('');
    setRating(score);
  }

  async function handleFinish() {
    if (!rating) {
      setError('Escolha uma nota de 1 a 5.');
      return;
    }
    setSaving(true);
    await finishSession({ rating, comment: comment.trim() });
    // reset: depois de concluir, o visitante não volta para as perguntas.
    navigation.reset({ index: 0, routes: [{ name: 'Done' }] });
  }

  return (
    <Background>
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
                <Progress accessibilityLabel="Etapa 5 de 5">5 de 5</Progress>
              </Header>

              <Title accessibilityRole="header">Como foi a Arena Itinerante?</Title>
              <Subtitle>Sua opinião ajuda a melhorar os próximos eventos.</Subtitle>

              <PopIn>
                <CharacterStage>
                  <NinjaImage
                    source={FEEDBACK_NINJA}
                    resizeMode="contain"
                    accessibilityIgnoresInvertColors
                    accessible
                    accessibilityLabel="Ninja com uma prancheta de avaliação e uma interrogação"
                  />
                </CharacterStage>
              </PopIn>

              <RatingPanel>
                <Label>Sua nota</Label>
                <RatingSelector value={rating} onChange={handleRating} />
                <ErrorSlot>
                  {error ? (
                    <ErrorText accessibilityRole="alert" accessibilityLiveRegion="polite">
                      {error}
                    </ErrorText>
                  ) : null}
                </ErrorSlot>
              </RatingPanel>

              <CommentHeader>
                <Label $light>Quer contar mais? (opcional)</Label>
                <CommentCount>{comment.length}/{COMMENT_MAX_LENGTH}</CommentCount>
              </CommentHeader>
              <CommentInput
                value={comment}
                onChangeText={setComment}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="O que você mais gostou? O que podemos melhorar?"
                maxLength={COMMENT_MAX_LENGTH}
                multiline
                accessibilityLabel="Comentário opcional"
                $focused={focused}
              />
            </Content>
          </Scroll>

          <Footer>
            <PrimaryButton title="Concluir" onPress={handleFinish} loading={saving} />
          </Footer>
        </KeyboardAvoidingView>
      </Safe>
    </Background>
  );
}
