import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Label = styled.Text`
  margin-bottom: ${spacing.sm}px;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.ink};
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.muted,
})`
  min-height: ${MIN_TOUCH_SIZE + 8}px;
  padding: 0 ${spacing.md}px;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => {
    if (props.$hasError) {
      return colors.danger;
    }
    return props.$focused ? colors.primary : colors.borderStrong;
  }};
  background-color: ${colors.surface};
  font-size: 18px;
  color: ${colors.ink};
`;

export const Hint = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 14px;
  color: ${colors.muted};
`;
