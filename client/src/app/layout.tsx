import './globals.css';

export const metadata = {
  title: 'osu-ee-tracker',
  description: 'osu! leaderboard tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}