import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export { Background, BackgroundImage, Overlay, Safe, Scroll, Content, Header, BackButton, BackText, Progress, Title, Subtitle, Footer } from '../Feedback/style';

export const Hero = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${spacing.lg}px;
  margin-bottom: ${spacing.md}px;
`;

export const NinjaFrame = styled.View`
  width: 112px;
  height: 112px;
  overflow: hidden;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.45);
  background-color: ${colors.gradientStart};
`;

export const NinjaImage = styled.Image`
  width: 100%;
  height: 100%;
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
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
  color: ${colors.onPrimary};
`;

export const Card = styled.View`
  align-items: center;
  padding: ${spacing.lg}px ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 3px;
  border-color: ${(props) => (props.$called ? colors.accent : props.$expired ? colors.danger : colors.primary)};
  background-color: ${colors.surface};
`;

export const FooterButtons = styled.View`
  gap: ${spacing.sm}px;
`;

export const NumberLabel = styled.Text`
  font-size: 13px;
  line-height: 18px;
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
  margin-top: ${spacing.xs}px;
  font-size: 22px;
  line-height: 29px;
  font-weight: 800;
  text-align: center;
  color: ${colors.ink};
`;

export const WaitingBadge = styled.Text`
  margin-top: ${spacing.md}px;
  padding: ${spacing.xs}px ${spacing.md}px;
  border-radius: ${radius.md}px;
  background-color: ${colors.primarySoft};
  font-size: 13px;
  line-height: 19px;
  font-weight: 800;
  color: ${colors.primary};
  letter-spacing: 1px;
`;

export const Status = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: ${colors.muted};
`;

export const Timer = styled.Text`
  margin-top: ${spacing.xs}px;
  font-size: 46px;
  line-height: 56px;
  font-weight: 800;
  color: ${colors.danger};
`;

export const Tips = styled.View`
  margin-top: ${spacing.md}px;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  background-color: rgba(21, 11, 36, 0.9);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.28);
`;

export const TipsTitle = styled.Text`
  font-size: 15px;
  line-height: 21px;
  font-weight: 800;
  color: ${colors.onPrimary};
`;

export const Hint = styled.Text`
  margin-top: ${spacing.sm}px;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.onPrimary};
`;

export const ErrorText = styled.Text`
  margin-top: ${spacing.md}px;
  font-size: 15px;
  line-height: 22px;
  font-weight: 700;
  color: #ffe2e6;
`;
