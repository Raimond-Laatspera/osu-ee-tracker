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
  difficultyRating: number;
  bpm: number;
};

export type Score = {
  id: number;
  playerId: number;
  beatmapId: number;
  pp: number;
  accuracy: number;
  combo: number;
  mods?: number;
  rank: string;
  gameMode: 'OSU' | 'TAIKO' | 'FRUITS' | 'MANIA';
  createdAt: string;
  player: Player;
  beatmap?: Beatmap;
};

export type LeaderboardResponse = {
  items: Score[];
  total: number;
};