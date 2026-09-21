import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export const Label = styled.Text`
  margin: ${(props) => (props.$spaced ? spacing.xl : 0)}px 0 ${spacing.md}px;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.ink};
`;

export const CommentInput = styled.TextInput.attrs({
  placeholderTextColor: colors.muted,
  textAlignVertical: 'top',
})`
  min-height: 120px;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => (props.$focused ? colors.primary : colors.borderStrong)};
  background-color: ${colors.surface};
  font-size: 17px;
  line-height: 24px;
  color: ${colors.ink};
`;
