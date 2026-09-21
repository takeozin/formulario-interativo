import React from 'react';
import { View } from 'react-native';
import { BackButton, BackText, Container, Fill, StepText, Track, TopRow } from './styles';

export default function ProgressHeader({ step, totalSteps, onBack }) {
  const percent = Math.round((step / totalSteps) * 100);

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
        <StepText accessibilityLabel={`Etapa ${step} de ${totalSteps}`}>
          Etapa {step} de {totalSteps}
        </StepText>
      </TopRow>
      <Track>
        <Fill $percent={percent} />
      </Track>
    </Container>
  );
}
