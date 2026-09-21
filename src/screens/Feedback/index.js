import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import RatingSelector from '../../components/RatingSelector';
import FieldError from '../../components/FieldError';
import { useForm } from '../../contexts/FormContext';
import { CommentInput, Label } from './style';

const COMMENT_MAX_LENGTH = 300;

// RF04 / RNF01 - Feedback qualitativo sobre a experiência na Arena Itinerante.
export default function FeedbackScreen({ navigation }) {
  const { answers, finishSession } = useForm();
  const [rating, setRating] = useState(answers.rating);
  const [comment, setComment] = useState(answers.comment);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleRating(score) {
    setError('');
    setRating(score);
  }

  async function handleFinish() {
    if (!rating) {
      setError('Escolha uma nota de 1 a 5.');
      return;
    }
    setSaving(true);
    await finishSession({ rating, comment: comment.trim() });
    // reset: depois de concluir, o visitante não volta para as perguntas.
    navigation.reset({ index: 0, routes: [{ name: 'Done' }] });
  }

  return (
    <ScreenLayout
      step={5}
      onBack={() => navigation.goBack()}
      title="Como foi a Arena Itinerante?"
      subtitle="Sua opinião ajuda a melhorar os próximos eventos."
      footer={<PrimaryButton title="Concluir" onPress={handleFinish} loading={saving} />}
    >
      <Label>Sua nota</Label>
      <RatingSelector value={rating} onChange={handleRating} />
      <FieldError message={error} />

      <Label $spaced>Quer contar mais? (opcional)</Label>
      <CommentInput
        value={comment}
        onChangeText={setComment}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="O que você mais gostou? O que podemos melhorar?"
        maxLength={COMMENT_MAX_LENGTH}
        multiline
        accessibilityLabel="Comentário opcional"
        $focused={focused}
      />
    </ScreenLayout>
  );
}
