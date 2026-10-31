import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../global/styles/colors';
import { MAX_CONTENT_WIDTH, MIN_TOUCH_SIZE, radius, spacing } from '../../global/styles/metrics';

// Mesmo fundo do dojo da Splash e da Welcome.
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

// Escurece o dojo para os cards e os botões terem contraste.
export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(21, 11, 36, 0.55);
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

// Centraliza as duas colunas na altura que sobra entre o Voltar e o botão de baixo.
export const Stage = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${spacing.md}px;
  margin: ${spacing.lg}px 0;
`;

// Coluna de cada card: dimensiona via flex antes do PopIn aplicar seu width: 100%.
export const Column = styled.View`
  flex: 1;
`;

// Duas colunas lado a lado: cada card ocupa a coluna inteira (a largura vem
// da Column; flex: 1 aqui zeraria a altura antes do aspect-ratio ser calculado).
export const Card = styled.TouchableOpacity`
  width: 100%;
  aspect-ratio: 0.55;
  overflow: hidden;
  border-radius: ${radius.lg}px;
  border-width: 2px;
  border-color: ${(props) => (props.$selected ? colors.accent : 'transparent')};
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
