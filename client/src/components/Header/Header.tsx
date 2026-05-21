'use client';

function Header() {
  return (
    <header className="w-full py-6 bg-blue-500">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          osu! Estonia Leaderboard
        </h1>

        <p className="text-white/60 text-sm md:text-base">
          Track top performance across all gamemodes
        </p>
      </div>
    </header>
  );
}

export default Header;