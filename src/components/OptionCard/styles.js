import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Card = styled.TouchableOpacity`
  width: ${(props) => (props.$compact ? '48%' : '100%')};
  min-height: ${MIN_TOUCH_SIZE + 16}px;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.md}px;
  margin-bottom: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.primary : colors.borderStrong)};
  background-color: ${(props) => (props.$selected ? colors.primarySoft : colors.surface)};
`;

export const Radio = styled.View`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.md}px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.primary : colors.borderStrong)};
`;

export const RadioDot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${colors.primary};
`;

export const Texts = styled.View`
  flex: 1;
`;

export const Label = styled.Text`
  font-size: 17px;
  line-height: 24px;
  font-weight: 600;
  color: ${colors.ink};
`;

export const Description = styled.Text`
  margin-top: 2px;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.muted};
`;
