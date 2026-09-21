import React from 'react';
import { selectionFeedback } from '../../services/haptics';
import { Legend, LegendText, Row, ScoreButton, ScoreText } from './styles';

const SCORES = [1, 2, 3, 4, 5];

// Nota de 1 a 5. Quando o tema ninja chegar, dá para trocar os números por ícones.
export default function RatingSelector({ value, onChange }) {
  return (
    <>
      <Row accessibilityRole="radiogroup">
        {SCORES.map((score) => {
          const selected = value === score;
          return (
            <ScoreButton
              key={score}
              onPress={() => {
                selectionFeedback();
                onChange(score);
              }}
              activeOpacity={0.8}
              $selected={selected}
              accessibilityRole="radio"
              accessibilityLabel={`Nota ${score} de 5`}
              accessibilityState={{ selected }}
            >
              <ScoreText $selected={selected}>{score}</ScoreText>
            </ScoreButton>
          );
        })}
      </Row>
      <Legend>
        <LegendText>Ruim</LegendText>
        <LegendText>Ótimo</LegendText>
      </Legend>
    </>
  );
}
