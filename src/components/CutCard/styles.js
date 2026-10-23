import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

// Ocupa a metade da largura da grade; o OptionCard de dentro ocupa 100% dele.
export const Wrapper = styled(Animated.View)`
  width: 48%;
`;

// Recorta a lâmina na área do cartão (desconta a margem inferior do OptionCard).
export const Clip = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${spacing.md}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${radius.lg}px;
`;

export const Blade = styled(Animated.View)`
  width: 70%;
  height: 6px;
  border-radius: 3px;
  background-color: ${colors.primary};
`;
