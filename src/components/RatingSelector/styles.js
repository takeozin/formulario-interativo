import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ScoreButton = styled.TouchableOpacity`
  flex: 1;
  min-height: ${MIN_TOUCH_SIZE + 8}px;
  margin: 0 ${spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.primary : colors.borderStrong)};
  background-color: ${(props) => (props.$selected ? colors.primary : colors.surface)};
`;

export const ScoreText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => (props.$selected ? colors.onPrimary : colors.ink)};
`;

export const Legend = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: ${spacing.sm}px ${spacing.xs}px 0;
`;

export const LegendText = styled.Text`
  font-size: 14px;
  color: ${colors.muted};
`;
