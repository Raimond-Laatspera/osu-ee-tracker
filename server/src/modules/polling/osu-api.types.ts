export interface OsuUser {
  id: number;
  username: string;
  country_code: string;
}

export interface OsuRankingEntry {
  pp: number;
  hit_accuracy: number;

  play_count?: number;
  play_time?: number;

  user: OsuUser;
}

export interface OsuRankingsResponse {
  ranking: OsuRankingEntry[];
  total?: number;
}

export interface OsuTokenResponse {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
}
