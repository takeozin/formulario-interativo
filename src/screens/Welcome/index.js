import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/ScreenLayout';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { CONSENT_OPTIONS } from '../../global/constants/formOptions';
import { NoticeCard, NoticeText, NoticeTitle, SectionLabel } from './style';

export default function WelcomeScreen({ navigation }) {
  const { startSession, resetSession } = useForm();
  const [consentType, setConsentType] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  // Sempre que a tela inicial aparece, tudo recomeça do zero. No totem isso
  // garante que o próximo visitante nunca veja os dados do anterior.
  useFocusEffect(
    useCallback(() => {
      resetSession();
      setConsentType(null);
      setError('');
      setStarting(false);
    }, [resetSession])
  );

  function handleSelect(id) {
    setError('');
    setConsentType(id);
  }

  async function handleStart() {
    if (!consentType) {
      setError('Escolha uma opção para continuar.');
      return;
    }
    setStarting(true);
    await startSession(consentType);
    navigation.navigate('Character');
  }

  return (
    <ScreenLayout
      title="Bem-vindo à Arena Itinerante"
      subtitle="São 5 perguntas rápidas, em cerca de 1 minuto."
      footer={<PrimaryButton title="Começar" onPress={handleStart} loading={starting} />}
    >
      <NoticeCard>
        <NoticeTitle>Como usamos seus dados</NoticeTitle>
        <NoticeText>
          Vamos guardar seu nome ou apelido, sua faixa de idade e suas respostas. A Beast Maragames usa essas
          informações só para entender quem participa dos eventos. Não pedimos contato nem documentos.
        </NoticeText>
        <NoticeText $spaced>
          As respostas ficam neste aparelho e são enviadas para um banco de dados protegido. Elas não são vendidas nem
          repassadas a ninguém e ficam guardadas por até 12 meses. Para pedir que suas respostas sejam apagadas, fale
          com a equipe no estande ou envie um e-mail para contato@maragames.app.
        </NoticeText>
      </NoticeCard>

      <SectionLabel>Autorização</SectionLabel>
      {CONSENT_OPTIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          selected={consentType === option.id}
          onPress={() => handleSelect(option.id)}
        />
      ))}
      <FieldError message={error} />
    </ScreenLayout>
  );
}
