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
  background-color: rgba(21, 11, 36, 0.72);
`;

export const Safe = styled(SafeAreaView)`
  flex: 1;
`;

export const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

export const Content = styled.View`
  flex-grow: 1;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.lg}px ${spacing.lg}px ${spacing.md}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.lg}px;
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

export const CharacterStage = styled.View`
  height: 210px;
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.sm}px;
`;

export const NinjaImage = styled.Image`
  width: 170px;
  height: 210px;
`;

export const RatingPanel = styled.View`
  padding: ${spacing.md}px;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: ${colors.primary};
  background-color: ${colors.surface};
`;

export const Label = styled.Text`
  margin-bottom: ${spacing.md}px;
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.$light ? colors.onPrimary : colors.ink)};
`;

export const ErrorSlot = styled.View`
  min-height: 24px;
  justify-content: flex-end;
  margin-top: ${spacing.xs}px;
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: ${colors.danger};
`;

export const CommentHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.lg}px;
`;

export const CommentCount = styled.Text`
  margin-bottom: ${spacing.md}px;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.onPrimary};
  opacity: 0.75;
`;

export const CommentInput = styled.TextInput.attrs({
  placeholderTextColor: colors.muted,
  textAlignVertical: 'top',
})`
  min-height: 120px;
  padding: ${spacing.md}px;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${(props) => (props.$focused ? colors.primary : colors.borderStrong)};
  background-color: ${colors.surface};
  font-size: 17px;
  line-height: 24px;
  color: ${colors.ink};
`;

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;
