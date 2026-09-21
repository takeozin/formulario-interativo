import styled from 'styled-components/native';
import { colors } from '../../global/styles/colors';
import { spacing } from '../../global/styles/metrics';

export const Message = styled.Text`
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
  color: ${colors.danger};
  margin-top: ${spacing.sm}px;
`;
