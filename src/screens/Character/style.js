import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

export const Background = styled(LinearGradient)`
  flex: 1;
`;

export const Safe = styled(SafeAreaView)`
  flex: 1;
`;

// Tela única, sem scroll: o card fica no espaço que sobra entre o Voltar e o
// botão de baixo.
export const Content = styled.View`
  flex: 1;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  padding: ${spacing.lg}px;
`;

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  min-height: ${MIN_TOUCH_SIZE}px;
  min-width: ${MIN_TOUCH_SIZE}px;
  padding: 0 ${spacing.md}px;
  justify-content: center;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${colors.primary};
  background-color: ${colors.surface};
`;

export const BackText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.ink};
`;

// Centraliza o card na altura que sobra entre o Voltar e o botão de baixo.
export const Stage = styled.View`
  flex: 1;
  justify-content: center;
  margin: ${spacing.lg}px 0;
`;

// As imagens são paisagem: o card segue esse formato para não cortar o ninja.
export const Card = styled.TouchableOpacity`
  width: 100%;
  aspect-ratio: 1.37;
  overflow: hidden;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.gradientEnd : 'transparent')};
`;

// A imagem preenche o card (cover) e repete o arredondado de cima, descontada
// a borda de 2px, para o canto não ficar pontudo no Android.
export const CardImage = styled.Image`
  flex: 1;
  width: 100%;
  border-top-left-radius: ${radius.lg - 2}px;
  border-top-right-radius: ${radius.lg - 2}px;
`;

export const LabelBar = styled.View`
  padding: ${spacing.sm}px;
  border-bottom-left-radius: ${radius.lg - 2}px;
  border-bottom-right-radius: ${radius.lg - 2}px;
  background-color: rgba(21, 11, 36, 0.85);
`;

export const Label = styled.Text`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: ${colors.onPrimary};
`;

// Seta discreta por cima da imagem que troca o personagem. $side diz o lado.
export const ArrowButton = styled.TouchableOpacity`
  position: absolute;
  top: 50%;
  margin-top: -${MIN_TOUCH_SIZE / 2}px;
  ${(props) => props.$side}: ${spacing.sm}px;
  width: ${MIN_TOUCH_SIZE}px;
  height: ${MIN_TOUCH_SIZE}px;
  border-radius: ${MIN_TOUCH_SIZE / 2}px;
  align-items: center;
  justify-content: center;
  background-color: rgba(21, 11, 36, 0.55);
`;

export const ArrowText = styled.Text`
  font-size: 28px;
  font-weight: 700;
  line-height: 30px;
  color: ${colors.onPrimary};
`;
