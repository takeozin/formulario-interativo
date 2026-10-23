import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { spacing } from '../../global/styles/metrics';

export const TIP_SIZE = 14;

// Faixa onde o pincel desce e a pincelada atravessa, logo abaixo do campo de nome.
export const Track = styled.View`
  width: 100%;
  height: 28px;
  margin-top: ${spacing.sm}px;
`;

// Recorta a pincelada: ela aparece "pintando" da esquerda para a direita.
export const Clip = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
`;

export const Stroke = styled(Animated.View)`
  width: 100%;
  height: 8px;
  background-color: ${colors.primary};
`;

export const Tip = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  width: ${TIP_SIZE}px;
  height: ${TIP_SIZE}px;
  border-radius: ${TIP_SIZE / 2}px;
  background-color: ${colors.ink};
`;
