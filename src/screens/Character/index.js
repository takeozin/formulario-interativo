import React, { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PopIn from '../../components/PopIn';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { selectionFeedback } from '../../services/haptics';
import { AVATAR_NOT_INFORMED, AVATAR_OPTIONS } from '../../global/constants/formOptions';
import { colors } from '../../global/styles/colors';
import {
  Background,
  BackButton,
  BackText,
  Card,
  CardImage,
  Column,
  Content,
  Label,
  LabelBar,
  Safe,
  Stage,
} from './style';

const IMAGES = {
  ninja_male: require('../../../assets/ninja/ninja-masculino.jpeg'),
  ninja_female: require('../../../assets/ninja/ninja-feminino.jpeg'),
};

// Tempo para o "pulo" do cartão aparecer antes de ir para a próxima tela.
const NAVIGATE_DELAY = 300;

// RF01 - Escolha do sexo, representado pelos ninjas. Dois cartões lado a lado,
// um masculino e um feminino. Tocar no cartão já grava e avança (sem botão
// Continuar); "Prefiro não dizer" grava "not_informed". Ao voltar da tela
// Name, dá para escolher de novo: a resposta é sobrescrita.
export default function CharacterScreen({ navigation }) {
  const { answers, saveAnswers } = useForm();
  // Evita que dois toques seguidos naveguem duas vezes.
  const leaving = useRef(false);
  const timer = useRef(null);

  useFocusEffect(
    useCallback(() => {
      leaving.current = false;
      return () => clearTimeout(timer.current);
    }, [])
  );

  function handleSelect(id) {
    if (leaving.current) {
      return;
    }
    leaving.current = true;
    selectionFeedback();
    saveAnswers({ avatar: id });
    timer.current = setTimeout(() => navigation.navigate('Name'), NAVIGATE_DELAY);
  }

  function handleSkip() {
    if (leaving.current) {
      return;
    }
    leaving.current = true;
    saveAnswers({ avatar: AVATAR_NOT_INFORMED });
    navigation.navigate('Name');
  }

  return (
    <Background colors={[colors.gradientStart, colors.gradientEnd]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
      <Safe>
        <Content>
          <BackButton
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <BackText>Voltar</BackText>
          </BackButton>
          <Stage>
            {AVATAR_OPTIONS.map((option, index) => {
              const selected = answers.avatar === option.id;
              return (
                <Column key={option.id}>
                  <PopIn index={index} selected={selected}>
                    <Card
                      onPress={() => handleSelect(option.id)}
                      activeOpacity={0.8}
                      $selected={selected}
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected }}
                    >
                      <CardImage source={IMAGES[option.id]} resizeMode="cover" accessibilityIgnoresInvertColors />
                      <LabelBar>
                        <Label>{option.label}</Label>
                      </LabelBar>
                    </Card>
                  </PopIn>
                </Column>
              );
            })}
          </Stage>
          <PrimaryButton title="Prefiro não dizer" borderColor={colors.gradientEnd} onPress={handleSkip} />
        </Content>
      </Safe>
    </Background>
  );
}
