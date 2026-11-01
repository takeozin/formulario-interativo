import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Background = styled.View`
  flex: 1;
  background-color: ${colors.gradientStart};
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

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(21, 11, 36, 0.68);
`;

export const Safe = styled(SafeAreaView)`
  flex: 1;
`;

export const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

export const Content = styled.View`
  flex-grow: 1;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.lg}px ${spacing.lg}px 0;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.xl}px;
`;

export const BackButton = styled.TouchableOpacity`
  min-height: ${MIN_TOUCH_SIZE}px;
  min-width: ${MIN_TOUCH_SIZE}px;
  padding: 0 ${spacing.md}px;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${colors.primary};
  background-color: ${colors.surface};
`;

export const BackText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const Progress = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: ${colors.onPrimary};
  text-shadow-color: rgba(0, 0, 0, 0.55);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 4px;
`;

export const Title = styled.Text`
  max-width: 520px;
  font-size: 30px;
  line-height: 36px;
  font-weight: 800;
  color: ${colors.onPrimary};
  text-shadow-color: rgba(0, 0, 0, 0.65);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 7px;
`;

export const Subtitle = styled.Text`
  max-width: 520px;
  margin-top: ${spacing.sm}px;
  font-size: 16px;
  line-height: 23px;
  color: ${colors.onPrimary};
  opacity: 0.85;
  text-shadow-color: rgba(0, 0, 0, 0.65);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 5px;
`;

export const Stage = styled.View`
  gap: ${spacing.md}px;
  margin-top: ${spacing.xl}px;
`;

export const Card = styled.TouchableOpacity`
  height: 164px;
  flex-direction: row;
  overflow: hidden;
  border-radius: ${radius.lg}px;
  border-width: ${(props) => (props.$selected ? 3 : 2)}px;
  border-color: ${(props) => (props.$selected ? colors.accent : 'rgba(255, 255, 255, 0.32)')};
  background-color: rgba(21, 11, 36, 0.9);
`;

export const CardImageFrame = styled.View`
  width: 42%;
  max-width: 220px;
  overflow: hidden;
  background-color: ${colors.ink};
`;

export const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const CardText = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${spacing.md}px ${spacing.xl}px ${spacing.md}px ${spacing.md}px;
`;

export const CardTitle = styled.Text`
  font-size: 20px;
  line-height: 25px;
  font-weight: 800;
  color: ${colors.onPrimary};
`;

export const Description = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.onPrimary};
  opacity: 0.78;
`;

export const ChoiceRing = styled.View`
  position: absolute;
  top: ${spacing.sm}px;
  right: ${spacing.sm}px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.accent : 'rgba(255, 255, 255, 0.6)')};
  background-color: rgba(21, 11, 36, 0.72);
`;

export const ChoiceDot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${colors.accent};
`;

export const ErrorSlot = styled.View`
  min-height: 28px;
  justify-content: center;
  margin-top: ${spacing.sm}px;
`;

export const ErrorText = styled.Text`
  font-size: 16px;
  line-height: 22px;
  font-weight: 800;
  color: ${colors.accent};
  text-shadow-color: rgba(0, 0, 0, 0.7);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 4px;
`;

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;
