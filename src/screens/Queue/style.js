import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export const Card = styled.View`
  align-items: center;
  padding: ${spacing.xl}px ${spacing.lg}px;
  border-radius: ${radius.lg}px;
  border-width: 3px;
  border-color: ${(props) => (props.$called ? colors.accent : props.$expired ? colors.danger : colors.primary)};
  background-color: ${colors.surface};
`;

export const FooterButtons = styled.View`
  gap: ${spacing.sm}px;
`;

export const NumberLabel = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: ${colors.muted};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const Number = styled.Text`
  margin-top: ${spacing.xs}px;
  font-size: 72px;
  line-height: 82px;
  font-weight: 800;
  color: ${colors.primary};
`;

export const Name = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 24px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const WaitingBadge = styled.Text`
  margin-top: ${spacing.md}px;
  padding: ${spacing.xs}px ${spacing.md}px;
  border-radius: ${radius.md}px;
  background-color: ${colors.primarySoft};
  font-size: 13px;
  font-weight: 800;
  color: ${colors.primary};
  letter-spacing: 1px;
`;

export const Status = styled.Text`
  margin-top: ${spacing.md}px;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: ${colors.muted};
`;

export const Timer = styled.Text`
  margin-top: ${spacing.xs}px;
  font-size: 48px;
  line-height: 56px;
  font-weight: 800;
  color: ${colors.accent};
`;

export const Hint = styled.Text`
  margin-top: ${spacing.md}px;
  font-size: 14px;
  color: ${colors.muted};
`;

export const ErrorText = styled.Text`
  margin-top: ${spacing.lg}px;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.danger};
`;
