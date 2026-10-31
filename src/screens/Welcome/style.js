import { Animated } from 'react-native';
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

// Escurece o dojo para o balão e as respostas terem contraste.
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

export const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
  keyboardShouldPersistTaps: 'handled',
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

// Balão de fala estilo cartoon: bem redondo, contorno escuro grosso (igual ao
// traço dos desenhos) e uma sombra sólida deslocada, como nos quadrinhos.
const BUBBLE_RADIUS = 32;
const BUBBLE_BORDER = 3;
const SHADOW_OFFSET = 6;

// Recebe a animação de entrada; a sombra fica atrás do balão.
export const BubbleWrap = styled(Animated.View)`
  margin-right: ${SHADOW_OFFSET}px;
`;

export const BubbleShadow = styled.View`
  position: absolute;
  top: ${SHADOW_OFFSET}px;
  left: ${SHADOW_OFFSET}px;
  right: -${SHADOW_OFFSET}px;
  bottom: -${SHADOW_OFFSET}px;
  border-radius: ${BUBBLE_RADIUS}px;
  background-color: ${colors.accent};
`;

export const Bubble = styled.View`
  padding: ${spacing.md}px ${spacing.lg}px;
  border-radius: ${BUBBLE_RADIUS}px;
  border-width: ${BUBBLE_BORDER}px;
  border-color: ${colors.ink};
  background-color: ${colors.surface};
`;

// Sensei com largura fixa: assim o rabinho do balão sempre cai em cima da
// cabeça dele, em qualquer tela. Proporção da imagem recortada: 800x915.
const SENSEI_WIDTH = 150;
const SENSEI_LEFT = 8;
// Espaço entre as orelhas (o ponto mais alto da imagem) e a sombra do balão.
const SENSEI_TOP = SHADOW_OFFSET + 6;
// Na imagem, o topo da cabeça no meio fica a ~3,5% da altura (~6px).
const HEAD_TOP = Math.round((SENSEI_WIDTH * 915) / 800 * 0.035);
// A ponta do rabinho para 5px acima da cabeça, sem encostar.
const TAIL_TIP = SENSEI_TOP + HEAD_TOP - 5;

// Rabinho de quadrinho: um triângulo escuro (contorno) com um branco menor por
// cima, que "apaga" a borda do balão. O absolute do Yoga conta a partir de
// dentro da borda, por isso os ajustes de BUBBLE_BORDER.
const TAIL_HALF = 11;
const TAIL_OVERLAP = 2; // começa um pouco acima da borda para cobri-la
const TAIL_HEIGHT = TAIL_TIP + BUBBLE_BORDER + TAIL_OVERLAP;
const FILL_HEIGHT = TAIL_HEIGHT - 5;
const FILL_HALF = (TAIL_HALF * FILL_HEIGHT) / TAIL_HEIGHT;
// Centro do rabinho alinhado com o centro do sensei.
const TAIL_CENTER = SENSEI_LEFT + SENSEI_WIDTH / 2 - BUBBLE_BORDER;

const triangle = (half, height, color) => `
  position: absolute;
  bottom: -${height - TAIL_OVERLAP}px;
  left: ${TAIL_CENTER - half}px;
  width: 0;
  height: 0;
  border-style: solid;
  border-left-width: ${half}px;
  border-right-width: ${half}px;
  border-top-width: ${height}px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: ${color};
  background-color: transparent;
`;

export const BubbleTailOutline = styled.View`
  ${triangle(TAIL_HALF, TAIL_HEIGHT, colors.ink)}
`;

export const BubbleTailFill = styled.View`
  ${triangle(FILL_HALF, FILL_HEIGHT, colors.surface)}
`;

export const Speaker = styled.Text`
  margin-bottom: ${spacing.xs}px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${colors.primary};
`;

export const BubbleTitle = styled.Text`
  margin-bottom: ${spacing.xs}px;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const BubbleText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${colors.muted};
  ${(props) => props.$spaced && `margin-top: ${spacing.sm}px;`}
`;

export const ReadMore = styled.TouchableOpacity`
  align-self: flex-start;
  min-height: ${MIN_TOUCH_SIZE}px;
  justify-content: center;
  margin-bottom: -${spacing.sm}px;
`;

export const ReadMoreText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.primary};
  text-decoration-line: underline;
`;

// Bem perto do balão e das respostas, mas sem encostar (6px de folga embaixo).
export const SenseiImage = styled(Animated.Image)`
  width: ${SENSEI_WIDTH}px;
  height: ${(SENSEI_WIDTH * 915) / 800}px;
  margin: ${SENSEI_TOP}px 0 6px ${SENSEI_LEFT}px;
`;

// Espaço sempre reservado entre o sensei e as respostas para o aviso de erro:
// ele aparece à vista, sem precisar rolar, e as opções não "pulam" quando surge.
export const ErrorSlot = styled.View`
  height: 26px;
  justify-content: center;
  margin-bottom: 6px;
`;

// Vermelho da faixa (mais vivo que o danger padrão, que some no fundo escuro).
export const ErrorText = styled.Text`
  font-size: 16px;
  line-height: 22px;
  font-weight: 800;
  color: ${colors.accent};
  text-shadow-color: rgba(0, 0, 0, 0.6);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 3px;
`;

export const Footer = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  align-self: center;
  flex-direction: row;
  gap: ${spacing.md}px;
  padding: ${spacing.md}px ${spacing.lg}px ${spacing.lg}px;
`;

export const BackButton = styled.TouchableOpacity`
  flex: 1;
  min-height: ${MIN_TOUCH_SIZE + 8}px;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md}px;
  border-width: 2px;
  border-color: ${colors.gradientEnd};
  background-color: rgba(21, 11, 36, 0.6);
`;

export const BackText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.onPrimary};
`;

export const NextWrapper = styled.View`
  flex: 2;
`;
