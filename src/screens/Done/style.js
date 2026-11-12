import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, radius, spacing } from '../../global/styles/metrics';

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
  padding: ${spacing.xl}px ${spacing.lg}px ${spacing.md}px;
`;

export const Title = styled.Text`
  font-size: 32px;
  line-height: 38px;
  font-weight: 800;
  text-align: center;
  color: ${colors.onPrimary};
  text-shadow-color: rgba(0, 0, 0, 0.65);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 7px;
`;

export const Subtitle = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: ${colors.onPrimary};
  opacity: 0.86;
  text-shadow-color: rgba(0, 0, 0, 0.65);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 5px;
`;

export const Hero = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${spacing.xl}px;
  margin-bottom: ${spacing.lg}px;
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: ${colors.primary};
  background-color: ${colors.surface};
`;

export const HeroImage = styled.Image`
  width: 112px;
  height: 132px;
`;

export const HeroCopy = styled.View`
  flex: 1;
  margin-left: ${spacing.md}px;
`;

export const HeroText = styled.Text`
  margin-top: ${spacing.xs}px;
  font-size: 17px;
  line-height: 24px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const InviteCard = styled.View`
  margin-bottom: ${spacing.md}px;
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

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;
