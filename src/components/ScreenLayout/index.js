import React from 'react';
import { Platform } from 'react-native';
import ProgressHeader from '../ProgressHeader';
import { TOTAL_STEPS } from '../../global/constants/config';
import { Content, Footer, Keyboard, Safe, Scroll, Subtitle, Title } from './styles';

// Moldura padrão de todas as telas: barra de progresso, título, conteúdo
// rolável e um rodapé fixo para o botão principal (que continua visível
// com o teclado aberto).
export default function ScreenLayout({ step, onBack, title, subtitle, children, footer }) {
  return (
    <Safe>
      {step ? <ProgressHeader step={step} totalSteps={TOTAL_STEPS} onBack={onBack} /> : null}
      <Keyboard behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Scroll>
          <Content>
            <Title accessibilityRole="header">{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            {children}
          </Content>
        </Scroll>
        {footer ? <Footer>{footer}</Footer> : null}
      </Keyboard>
    </Safe>
  );
}
