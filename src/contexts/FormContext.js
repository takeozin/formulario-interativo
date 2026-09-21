import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { CONSENT_VERSION } from '../global/constants/config';
import { getDatabase } from '../services/database';
import { deleteResponse, saveResponse } from '../services/responseRepository';

const FormContext = createContext(null);

const INITIAL_ANSWERS = {
  id: null,
  status: 'in_progress',
  consentType: null,
  consentVersion: null,
  consentAt: null,
  avatar: null,
  name: '',
  ageRange: null,
  intent: null,
  rating: null,
  comment: '',
  completedAt: null,
};

// Gravar no aparelho nunca deve travar o visitante: se falhar, só avisamos no console.
async function persist(answers) {
  if (!answers.id) {
    return;
  }
  try {
    await saveResponse(answers);
  } catch (error) {
    console.warn('[Soulstar] Não foi possível salvar no aparelho:', error);
  }
}

export function FormProvider({ children }) {
  // A ref guarda sempre o valor mais recente, para dois toques seguidos
  // não sobrescreverem um ao outro. O state serve só para redesenhar a tela.
  const answersRef = useRef(INITIAL_ANSWERS);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);

  // Abre o banco já na inicialização, para o primeiro toque não esperar.
  useEffect(() => {
    getDatabase().catch((error) => {
      console.warn('[Soulstar] Não foi possível abrir o banco local:', error);
    });
  }, []);

  const commit = useCallback(async (next) => {
    answersRef.current = next;
    setAnswers(next);
    await persist(next);
    return next;
  }, []);

  // Limpa a memória para o próximo visitante (não apaga o que já foi gravado).
  const resetSession = useCallback(() => {
    answersRef.current = INITIAL_ANSWERS;
    setAnswers(INITIAL_ANSWERS);
  }, []);

  // Começa uma resposta nova, já com a autorização registrada.
  const startSession = useCallback(
    (consentType) =>
      commit({
        ...INITIAL_ANSWERS,
        id: Crypto.randomUUID(),
        consentType,
        consentVersion: CONSENT_VERSION,
        consentAt: new Date().toISOString(),
      }),
    [commit]
  );

  // Atualiza campos e grava no aparelho na hora (coleta progressiva).
  const saveAnswers = useCallback((patch) => commit({ ...answersRef.current, ...patch }), [commit]);

  const finishSession = useCallback(
    (patch = {}) =>
      commit({
        ...answersRef.current,
        ...patch,
        status: 'completed',
        completedAt: new Date().toISOString(),
      }),
    [commit]
  );

  // Descarta a resposta em andamento (ex.: menor de idade sem autorização).
  const discardSession = useCallback(async () => {
    const { id } = answersRef.current;
    resetSession();
    if (!id) {
      return;
    }
    try {
      await deleteResponse(id);
    } catch (error) {
      console.warn('[Soulstar] Não foi possível apagar a resposta descartada:', error);
    }
  }, [resetSession]);

  const value = useMemo(
    () => ({ answers, startSession, saveAnswers, finishSession, discardSession, resetSession }),
    [answers, startSession, saveAnswers, finishSession, discardSession, resetSession]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm precisa ser usado dentro de <FormProvider>.');
  }
  return context;
}
