import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const BlockedCard = styled.View`
  margin-top: ${spacing.md}px;
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  background-color: ${colors.dangerSoft};
`;

export const BlockedText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${colors.danger};
`;
