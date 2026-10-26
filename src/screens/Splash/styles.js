import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { spacing } from '../../global/styles/metrics';

export const Background = styled.View`
  flex: 1;
`;

export const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

export const Safe = styled(SafeAreaView)`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(21, 11, 36, 0.15);
`;

export const BottomOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 45%;
  background-color: rgba(21, 11, 36, 0.3);
`;

export const TitleWrapper = styled.View`
  margin-top: ${spacing.xl * 2 + spacing.lg}px;
  padding: 0 ${spacing.lg}px;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  color: ${colors.onPrimary};
  text-shadow-color: rgba(0, 0, 0, 0.6);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 8px;
`;

export const Subtitle = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 16px;
  text-align: center;
  color: ${colors.onPrimary};
  opacity: 0.85;
  text-shadow-color: rgba(0, 0, 0, 0.6);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 6px;
`;

export const ButtonWrapper = styled.View`
  width: 100%;
  padding: 0 ${spacing.xl}px ${spacing.xl + spacing.lg}px;
  align-items: center;
`;
