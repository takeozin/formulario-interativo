import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export const NoticeCard = styled.View`
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 1px;
  border-color: ${colors.border};
  background-color: ${colors.surface};
`;

export const NoticeTitle = styled.Text`
  margin-bottom: ${spacing.xs}px;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const NoticeText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${colors.muted};
`;

export const SectionLabel = styled.Text`
  margin: ${spacing.lg}px 0 ${spacing.md}px;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.ink};
`;
