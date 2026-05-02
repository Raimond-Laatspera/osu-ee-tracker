export type Player = {
  id: number;
  username: string;
  country: string;
};

export type Score = {
  id: number;
  playerId: number;
  pp: number;
  accuracy: number;
  rank: string | null;
  gameMode: 'STANDARD' | 'TAIKO' | 'FRUITS' | 'MANIA';
  maniaKeys: string | null;
  createdAt: string;
  player: Player;
};