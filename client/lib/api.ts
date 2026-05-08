import { Score } from './types';

const BASE_URL = 'http://localhost:3000';

export async function getLeaderboard(params: {
  mode?: string;
  period?: string;
  limit?: number;
}): Promise<{ items: Score[] }> {
  const query = new URLSearchParams();

  if (params.mode) query.append('mode', params.mode);
  if (params.period) query.append('period', params.period);
  if (params.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`${BASE_URL}/scores/leaderboard?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json() as Promise<{ items: Score[] }>;
}