export type Player = {
  id: number;
  username: string;
  country: string;
};

export type Beatmap = {
  id: number;
  beatmapsetId: number;

  artist: string;
  title: string;
  version: string;

  difficultyRating?: number;

  bpm?: number;

  ar?: number;
  od?: number;
  hp?: number;
  cs?: number;

  keyCount?: number;

  maxCombo?: number;
};

export type Score = {
  id: number;
  isLazer: boolean;
  
  playerId: number;
  beatmapId: number;

  pp: number;
  accuracy: number;

  combo: number;

  score?: number;

  count300: number;
  count100: number;
  count50: number;
  countMiss: number;

  countGeki?: number | null;
  countKatu?: number | null;

  mods?: number;

  rank: string;

  gameMode: 'OSU' | 'TAIKO' | 'FRUITS' | 'MANIA';

  effectiveAr?: number;
  effectiveOd?: number;
  effectiveCs?: number;
  effectiveHp?: number;

  effectiveBpm?: number;
  effectiveStarRating?: number;

  createdAt: string;

  player: Player;

  beatmap?: Beatmap;
};

export type LeaderboardResponse = {
  items: Score[];
  total: number;
};