import Header from '../components/Header/Header';
import Leaderboard from '../components/Leaderboard/Leaderboard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f0f14] text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Leaderboard />
      </div>
    </main>
  );
}