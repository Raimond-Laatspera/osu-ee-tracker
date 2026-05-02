'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';
import { Score } from '../lib/types';

const MODES = ['STANDARD', 'TAIKO', 'CATCH', 'MANIA'];
const PERIODS = ['daily', 'weekly', 'monthly'];

export default function Home() {
  const [scores, setScores] = useState<Score[]>([]);
  const [mode, setMode] = useState('STANDARD');
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getLeaderboard({ mode, period });
      setScores(data.items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

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

    fetchData();
  }, [mode, period]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🇪🇪 osu! Estonia Leaderboard</h1>

      {/* MODE SELECTOR */}
      <div style={{ marginBottom: '1rem' }}>
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              marginRight: 8,
              padding: '8px 12px',
              background: m === mode ? '#ff66aa' : '#eee',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* PERIOD SELECTOR */}
      <div style={{ marginBottom: '1rem' }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              marginRight: 8,
              padding: '8px 12px',
              background: p === period ? '#66ccff' : '#eee',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TABLE */}
      {!loading && (
        <table width="100%" border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>PP</th>
              <th>Accuracy</th>
              <th>Rank</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.player?.username ?? 'Unknown'}</td>
                <td>{s.pp}</td>
                <td>{s.accuracy}%</td>
                <td>{s.rank}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}