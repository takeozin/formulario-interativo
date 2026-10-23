import React, { useState } from 'react';
import { Linking } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { EDUCATIONAL_URL } from '../../global/constants/config';
import { InviteCard, InviteText, InviteTitle } from './style';

export default function DoneScreen({ navigation }) {
  const { answers } = useForm();
  const [linkError, setLinkError] = useState('');
  const wantsToLearn = answers.intent === 'wants_to_learn';

  async function handleOpenPlatform() {
    try {
      await Linking.openURL(EDUCATIONAL_URL);
    } catch (error) {
      setLinkError('Não foi possível abrir o link agora. Peça ajuda a alguém da equipe.');
    }
  }

  function handleNext() {
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  return (
    <ScreenLayout
      title={answers.name ? `Valeu, ${answers.name}!` : 'Valeu!'}
      subtitle="Suas respostas foram registradas. Aproveite a Arena!"
      footer={<PrimaryButton title="Próximo participante" onPress={handleNext} variant={wantsToLearn ? 'secondary' : 'primary'} />}
    >
      {wantsToLearn ? (
        <InviteCard>
          <InviteTitle>Quer aprender a criar jogos?</InviteTitle>
          <InviteText>
            A Beast Maragames tem uma plataforma educacional para quem quer entrar no mercado de games.
          </InviteText>
          <PrimaryButton title="Conhecer a plataforma" onPress={handleOpenPlatform} />
          <FieldError message={linkError} />
        </InviteCard>
      ) : null}
    </ScreenLayout>
  );
}
