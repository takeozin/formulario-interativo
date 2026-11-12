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

export const Hero = styled.View`
  min-height: 100px;
  flex-direction: row;
  align-items: center;
  margin-top: ${spacing.lg}px;
  margin-bottom: ${spacing.md}px;
  padding: ${spacing.sm}px ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  background-color: rgba(21, 11, 36, 0.72);
`;

export const HeroImage = styled.Image`
  width: 78px;
  height: 96px;
`;

export const HeroCopy = styled.View`
  flex: 1;
  margin-left: ${spacing.md}px;
`;

export const HeroLabel = styled.Text`
  font-size: 13px;
  line-height: 18px;
  font-weight: 800;
  color: #fbb6c4;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const HeroText = styled.Text`
  margin-top: ${spacing.xs}px;
  font-size: 15px;
  line-height: 21px;
  font-weight: 700;
  color: ${colors.onPrimary};
`;

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const ErrorSlot = styled.View`
  min-height: 28px;
  justify-content: center;
  margin-top: ${spacing.xs}px;
`;

export const ErrorText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  font-weight: 800;
  color: ${colors.accent};
  text-shadow-color: rgba(0, 0, 0, 0.7);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 4px;
`;

export const BlockedCard = styled.View`
  margin-top: ${spacing.md}px;
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 1px;
  border-color: rgba(255, 226, 230, 0.45);
  background-color: rgba(181, 9, 40, 0.72);
`;

export const BlockedText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: #ffe2e6;
`;

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;
