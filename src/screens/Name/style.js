import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { radius, spacing } from '../../global/styles/metrics';

export {
  Background,
  BackgroundImage,
  Safe,
  Scroll,
  Content,
  Header,
  BackButton,
  BackText,
  Progress,
  Title,
  Subtitle,
  Footer,
} from '../Feedback/style';

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(21, 11, 36, 0.78);
`;

export const Stage = styled.View`
  margin-top: ${spacing.lg}px;
`;

export const NinjaFrame = styled.View`
  position: relative;
  width: 100%;
  height: 268px;
  overflow: hidden;
  align-self: center;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.42);
  background-color: rgba(21, 11, 36, 0.88);
`;

export const NinjaImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const NameTag = styled.View`
  position: absolute;
  top: ${spacing.md}px;
  left: ${spacing.md}px;
  right: ${spacing.md}px;
  z-index: 2;
  padding: ${spacing.xs}px ${spacing.sm}px ${spacing.sm}px;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => (props.$hasError ? colors.danger : colors.accent)};
  background-color: rgba(255, 255, 255, 0.96);
`;

export const TagHint = styled.Text`
  margin-bottom: 2px;
  font-size: 11px;
  line-height: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  color: ${colors.primary};
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.muted,
})`
  min-height: 48px;
  padding: 0 ${spacing.xs}px;
  border-width: 0;
  background-color: transparent;
  font-size: 22px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const Hint = styled.Text`
  margin-top: ${spacing.md}px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${colors.onPrimary};
  opacity: 0.8;
  text-shadow-color: rgba(0, 0, 0, 0.65);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 4px;
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
  text-align: center;
  color: ${colors.accent};
  text-shadow-color: rgba(0, 0, 0, 0.7);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 4px;
`;
