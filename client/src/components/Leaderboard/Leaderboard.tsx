'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../lib/api';
import { Score } from '../../lib/types';
import LeaderboardEntry from '../LeaderboardEntry/LeaderboardEntry';

import OsuIcon from '../../../public/icons/OsuIcon.png';
import TaikoIcon from '../../../public/icons/TaikoIcon.png';
import CatchIcon from '../../../public/icons/CatchIcon.png';
import ManiaIcon from '../../../public/icons/ManiaIcon.png';

const MODES = ['OSU', 'TAIKO', 'FRUITS', 'MANIA'] as const;
const PERIODS = ['daily', 'weekly', 'monthly'];

const MODE_LABELS: Record<string, string> = {
  OSU: 'STANDARD',
  TAIKO: 'TAIKO',
  FRUITS: 'CATCH THE BEAT',
  MANIA: 'MANIA',
};

const ICONS = {
  OSU: OsuIcon,
  TAIKO: TaikoIcon,
  FRUITS: CatchIcon,
  MANIA: ManiaIcon,
};

const MOD_BITS: [number, string][] = [
  [1, 'NF'],
  [2, 'EZ'],
  [8, 'HD'],
  [16, 'HR'],
  [32, 'SD'],
  [64, 'DT'],
  [256, 'HT'],
  [512, 'NC'],
  [1024, 'FL'],
  [4096, 'SO'],
  [1048576, 'FI'],
];

function parseMods(bitfield: number): string[] {
  if (!bitfield) return [];

  return MOD_BITS
    .filter(([bit]) => (bitfield & bit) !== 0)
    .map(([, name]) => name);
}

export default function Home() {
  const [scores, setScores] = useState<Score[]>([]);
  const [mode, setMode] = useState('OSU');
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const data = await getLeaderboard({ mode, period });

        setScores(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [mode, period]);

  return (
    <div>
      <div className="w-full content-center flex flex-col items-center gap-40 py-12">


        {/* MODE SELECTOR BUTTONS*/}
        <div className="gap-2 mb-4 flex-wrap w-full flex justify-center">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`w-24 h-12 px-4 py-2 rounded-lg transition-all duration-200 ${
                m === mode
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Image
                width={100}
                height={100}
                src={ICONS[m].src}
                alt={m}
                className="w-6 h-6"
              />
            </button>
          ))}
        </div>
        <h2 className="w-full text-red-500 text-2xl font-bold text-center">
          {MODE_LABELS[mode]} • {period.toUpperCase()}
        </h2>
        {/* PERIOD SELECTOR */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                p === period
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-white/70">
            Loading leaderboard...
          </div>
        )}

        {!loading && (
          <div className="flex flex-col items-center gap-4">
            {scores.map((s, index) => (
              <LeaderboardEntry
                key={s.id}
                rank={index + 1}
                gameMode={s.gameMode}
                username={s.player?.username ?? 'Unknown'}
                pp={s.pp ?? 0}
                accuracy={s.accuracy ?? 0}
                grade={s.rank}
                combo={Number(s.combo) || 0}
                misses={s.countMiss ?? 0}
                mods={parseMods(s.mods ?? 0)}

                effectiveAr={s.effectiveAr}
                effectiveOd={s.effectiveOd}
                effectiveCs={s.effectiveCs}
                effectiveHp={s.effectiveHp}

                effectiveBpm={s.effectiveBpm}
                effectiveStarRating={
                  s.effectiveStarRating
                }

                beatmap={{
                  artist: s.beatmap?.artist ?? '',
                  title: s.beatmap?.title ?? '',
                  version: s.beatmap?.version ?? '',

                  difficultyRating:
                    s.beatmap?.difficultyRating ?? 0,

                  bpm: s.beatmap?.bpm,

                  beatmapsetId:
                    s.beatmap?.beatmapsetId ?? 0,
                }}

                createdAt={s.createdAt}
              />
            ))}

            {!scores.length && (
              <div className="text-white/50 text-center py-12">
                No scores found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}