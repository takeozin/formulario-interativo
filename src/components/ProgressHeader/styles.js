import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, MIN_TOUCH_SIZE, spacing } from '../../global/styles/metrics';

export const Container = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.sm}px ${spacing.lg}px 0;
`;

export const TopRow = styled.View`
  min-height: ${MIN_TOUCH_SIZE}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity`
  min-height: ${MIN_TOUCH_SIZE}px;
  min-width: ${MIN_TOUCH_SIZE}px;
  justify-content: center;
`;

export const BackText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const StepText = styled.Text`
  font-size: 14px;
  color: ${colors.muted};
`;

export const Track = styled.View`
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${colors.border};
`;

export const Fill = styled.View`
  height: 100%;
  width: ${(props) => props.$percent}%;
  border-radius: 4px;
  background-color: ${colors.primary};
`;
