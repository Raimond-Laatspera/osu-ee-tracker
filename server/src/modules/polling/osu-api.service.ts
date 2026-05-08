import { Injectable } from '@nestjs/common';

export interface OsuUser {
  id: number;
  username: string;
  country_code: string;
}

export interface OsuBeatmap {
  id: number;

  beatmapset_id: number;

  difficulty_rating: number;

  bpm: number;

  total_length: number;
  hit_length: number;

  version: string;

  mode: string;
  status: string;
}

export interface OsuBeatmapset {
  artist: string;
  title: string;
}

export interface OsuTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface OsuScore {
  id: number;

  pp: number;
  accuracy: number;

  max_combo: number;

  score: number;

  mods: string[];

  rank: string;

  created_at: string;

  beatmap: OsuBeatmap;
  beatmapset: OsuBeatmapset;

  user: OsuUser;
}

@Injectable()
export class OsuApiService {
  private accessToken: string | null = null;
  private expiresAt: number = 0;

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    const res = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: Number(process.env.OSU_CLIENT_ID),
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'public',
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch osu token: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();

    if (
      typeof data !== 'object' ||
      data === null ||
      typeof (data as { access_token?: unknown }).access_token !== 'string' ||
      typeof (data as { expires_in?: unknown }).expires_in !== 'number'
    ) {
      throw new Error('Invalid token response from osu API');
    }

    const tokenData = data as OsuTokenResponse;

    this.accessToken = tokenData.access_token;
    this.expiresAt = Date.now() + tokenData.expires_in * 1000;

    return this.accessToken;
  }

  // 🔥 NEW: per-user recent scores (THIS is what your poller needs)
  async fetchRecentScoresForUser(
    userId: number,
    mode: string,
  ): Promise<OsuScore[]> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `https://osu.ppy.sh/api/v2/users/${userId}/scores/recent?mode=${mode}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`osu API error (user ${userId}): ${res.status} ${text}`);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid recent scores response from osu API');
    }

    return data as OsuScore[];
  }

  // (optional) keep global recent for debugging only
  async fetchRecentScores(mode: string): Promise<OsuScore[]> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `https://osu.ppy.sh/api/v2/scores?mode=${mode}&type=recent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`osu API error: ${res.status} ${text}`);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid scores response from osu API');
    }

    return data as OsuScore[];
  }

  // country leaderboard for bulk user fetching (not used by poller)
  async fetchCountryLeaderboard(
    mode: string,
    country: string,
    pages: number,
  ): Promise<OsuUser[]> {
    const token = await this.getAccessToken();
    const users: OsuUser[] = [];

    for (let page = 1; page <= pages; page++) {
      const res = await fetch(
        `https://osu.ppy.sh/api/v2/rankings/${mode}/performance?country=${country}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`osu rankings error: ${res.status} ${text}`);
      }

      const data = (await res.json()) as { ranking: { user: OsuUser }[] };
      users.push(...data.ranking.map((entry) => entry.user));

      await new Promise((res) => setTimeout(res, 300)); // rate limit between pages
    }

    return users;
  }
}
