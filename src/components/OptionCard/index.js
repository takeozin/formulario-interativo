import React from 'react';
import { selectionFeedback } from '../../services/haptics';
import { Card, Description, Label, Radio, RadioDot, Texts } from './styles';

// Cartão de escolha única (funciona como um "radio button" grande).
// Com compact=true ocupa metade da largura, para montar grades de 2 colunas.
// Com feedback=false o cartão não vibra sozinho: é para telas cuja animação
// já dispara a própria vibração (ex.: o corte da tela Age), evitando vibrar duas vezes.
export default function OptionCard({ label, description, selected = false, compact = false, feedback = true, onPress }) {
  function handlePress() {
    if (feedback) {
      selectionFeedback();
    }
    onPress();
  }

  return (
    <Card
      onPress={handlePress}
      activeOpacity={0.8}
      $selected={selected}
      $compact={compact}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Radio $selected={selected}>{selected ? <RadioDot /> : null}</Radio>
      <Texts>
        <Label>{label}</Label>
        {description ? <Description>{description}</Description> : null}
      </Texts>
    </Card>
  );
}
