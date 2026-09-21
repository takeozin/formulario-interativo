import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Button = styled.TouchableOpacity`
  min-height: ${MIN_TOUCH_SIZE + 8}px;
  padding: 0 ${spacing.lg}px;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => (props.$variant === 'secondary' ? colors.primary : 'transparent')};
  background-color: ${(props) => {
    if (props.$variant === 'secondary') {
      return 'transparent';
    }
    return props.$disabled ? colors.disabled : colors.primary;
  }};
`;

export const Label = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => (props.$variant === 'secondary' ? colors.primary : colors.onPrimary)};
`;
