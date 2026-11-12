import { supabase } from './supabaseClient';

export const QUEUE_POLL_INTERVAL_MS = 5000;
export const QUEUE_CALL_WINDOW_MS = 5 * 60 * 1000;

function firstRow(data) {
  const row = Array.isArray(data) ? data[0] ?? null : data;
  if (!row) {
    return null;
  }

  return {
    id: row.queue_id,
    accessToken: row.access_token,
    queueDate: row.queue_date,
    ticketNumber: row.ticket_number,
    participantName: row.participant_name,
    wantsToLearn: row.wants_to_learn,
    status: row.status,
    joinedAt: row.joined_at,
    calledAt: row.called_at,
    expiresAt: row.expires_at,
    positionAhead: Number(row.position_ahead ?? 0),
  };
}

export function isQueueAvailable() {
  return Boolean(supabase);
}

export async function joinGameQueue({ sessionId, name, wantsToLearn = false }) {
  if (!supabase) {
    throw new Error('QUEUE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.rpc('join_game_queue', {
    p_session_id: sessionId,
    p_name: name,
    p_wants_to_learn: wantsToLearn,
  });

  if (error) {
    throw error;
  }

  return firstRow(data);
}

export async function getGameQueueStatus(accessToken) {
  if (!supabase) {
    throw new Error('QUEUE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.rpc('get_game_queue_status', {
    p_access_token: accessToken,
  });

  if (error) {
    throw error;
  }

  return firstRow(data);
}

export async function setGameQueueLearning(accessToken, wantsToLearn) {
  if (!supabase) {
    throw new Error('QUEUE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.rpc('set_game_queue_learning', {
    p_access_token: accessToken,
    p_wants_to_learn: wantsToLearn,
  });

  if (error) {
    throw error;
  }

  return firstRow(data);
}
