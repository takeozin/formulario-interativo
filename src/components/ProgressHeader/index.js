import React from 'react';
import { View } from 'react-native';
import { BackButton, BackText, Container, Fill, StepText, Track, TopRow } from './styles';

// Sem step (ex.: tela Welcome), mostra só o Voltar, sem etapa nem barra.
export default function ProgressHeader({ step, totalSteps, onBack }) {
  const percent = step ? Math.round((step / totalSteps) * 100) : 0;

  return (
    <Container>
      <TopRow>
        {onBack ? (
          <BackButton onPress={onBack} activeOpacity={0.6} accessibilityRole="button" accessibilityLabel="Voltar">
            <BackText>Voltar</BackText>
          </BackButton>
        ) : (
          <View />
        )}
        {step ? (
          <StepText accessibilityLabel={`Etapa ${step} de ${totalSteps}`}>
            Etapa {step} de {totalSteps}
          </StepText>
        ) : null}
      </TopRow>
      {step ? (
        <Track>
          <Fill $percent={percent} />
        </Track>
      ) : null}
    </Container>
  );
}
