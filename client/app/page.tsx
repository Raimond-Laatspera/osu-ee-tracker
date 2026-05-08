'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';
import { Score } from '../lib/types';

const MODES = ['OSU', 'TAIKO', 'FRUITS', 'MANIA'] as const;
const PERIODS = ['daily', 'weekly', 'monthly'];

const MODE_LABELS: Record<string, string> = {
  OSU: 'Standard',
  TAIKO: 'Taiko',
  FRUITS: 'Catch the Beat',
  MANIA: 'Mania',
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

const MOD_COLORS: Record<string, string> = {
  HD: 'bg-yellow-400/20 text-yellow-300',
  HR: 'bg-red-400/20 text-red-300',
  DT: 'bg-blue-400/20 text-blue-300',
  NC: 'bg-blue-400/20 text-blue-300',
  HT: 'bg-slate-400/20 text-slate-300',
  EZ: 'bg-green-400/20 text-green-300',
  FL: 'bg-purple-400/20 text-purple-300',
  NF: 'bg-slate-400/20 text-slate-300',
  SD: 'bg-orange-400/20 text-orange-300',
  PF: 'bg-orange-400/20 text-orange-300',
  SO: 'bg-slate-400/20 text-slate-300',
  FI: 'bg-teal-400/20 text-teal-300',
};

function parseMods(bitfield: number): string[] {
  if (!bitfield) return [];

  return MOD_BITS.filter(([bit]) => (bitfield & bit) !== 0).map(
    ([, name]) => name,
  );
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
        const data = await getLeaderboard({
          mode,
          period,
        });

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
    <main className="min-h-screen bg-[#0f0f14] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          🇪🇪 osu! Estonia Leaderboard
        </h1>

        <p className="text-white/60 mb-8">
          {MODE_LABELS[mode]} • {period}
        </p>

        {/* MODE SELECTOR */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                m === mode
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

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

        {/* LOADING */}
        {loading && (
          <div className="text-white/70">
            Loading leaderboard...
          </div>
        )}
        {/* SCORES */}
        {!loading && (
          <div className="flex flex-col gap-4">
            {scores.map((s: Score, index: number) => (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-2xl border border-white/10 min-h-[180px]"
              >
                {/* BACKGROUND IMAGE */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(https://assets.ppy.sh/beatmaps/${s.beatmap?.beatmapsetId}/covers/cover.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: 'scale(1.05)',
                  }}
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

                {/* CONTENT */}
                <div className="relative z-10 p-6 flex flex-col gap-4">
                  {/* TOP ROW */}
                  <div className="flex items-start justify-between gap-4">
                    {/* LEFT SIDE */}
                    <div>
                      <div className="text-pink-400 text-2xl font-bold">
                        #{index + 1}
                      </div>

                      <div className="text-2xl font-semibold">
                        {s.player?.username ?? 'Unknown'}
                      </div>

                      <div className="text-white/60 text-sm">
                        {new Date(s.createdAt).toLocaleString(
                          'et-EE',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right">
                      <div className="text-4xl font-bold text-cyan-300">
                        {Math.round(s.pp)}
                      </div>

                      <div className="text-white/60">
                        pp
                      </div>

                      <div className="mt-2 font-semibold">
                        {(s.accuracy * 100).toFixed(2)}%
                      </div>

                      <div className="text-sm text-white/60">
                        {s.rank}
                      </div>
                    </div>
                  </div>

                  {/* BEATMAP INFO */}
                  <div>
                    <div className="text-lg font-semibold">
                      {s.beatmap?.artist} —{' '}
                      {s.beatmap?.title}
                    </div>

                    <div className="text-white/70">
                      [{s.beatmap?.version}] •{' '}
                      {s.beatmap?.difficultyRating?.toFixed(
                        2,
                      )}
                      ★
                    </div>
                  </div>

                  {/* MODS */}
                  <div className="flex flex-wrap gap-2">
                    {parseMods(s.mods ?? 0).map((mod) => (
                      <span
                        key={mod}
                        className={`text-xs px-2 py-1 rounded-md font-mono font-semibold ${
                          MOD_COLORS[mod] ??
                          'bg-white/10 text-white/50'
                        }`}
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {!scores.length && (
              <div className="text-white/50 text-center py-12">
                No scores found.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}