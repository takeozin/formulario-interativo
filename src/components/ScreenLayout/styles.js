import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, spacing } from '../../global/styles/metrics';

export const Safe = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

export const Keyboard = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Scroll = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: { flexGrow: 1 },
})`
  flex: 1;
`;

export const Content = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.lg}px;
`;

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;

export const Title = styled.Text`
  margin-bottom: ${spacing.sm}px;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const Subtitle = styled.Text`
  margin-bottom: ${spacing.lg}px;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.muted};
`;
