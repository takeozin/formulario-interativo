import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export const InviteCard = styled.View`
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 1px;
  border-color: ${colors.border};
  background-color: ${colors.surface};
`;

export const InviteTitle = styled.Text`
  margin-bottom: ${spacing.xs}px;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const InviteText = styled.Text`
  margin-bottom: ${spacing.md}px;
  font-size: 15px;
  line-height: 22px;
  color: ${colors.muted};
`;
