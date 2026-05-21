import styles from './LeaderboardEntry.module.css';

type LeaderboardEntryProps = {
  rank: number;

  username: string;

  pp: number;
  accuracy: number;

  gameMode: 'OSU' | 'TAIKO' | 'FRUITS' | 'MANIA';

  grade: string;

  combo: number;
  misses: number;

  mods: string[];

  effectiveAr?: number;
  effectiveOd?: number;
  effectiveCs?: number;
  effectiveHp?: number;

  effectiveBpm?: number;
  effectiveStarRating?: number;

  beatmap: {
    artist: string;
    title: string;
    version: string;

    difficultyRating: number;

    bpm?: number;

    beatmapsetId: number;
  };

  createdAt: string;
};

function LeaderboardEntry({
  rank,
  gameMode,
  username,
  pp,
  accuracy,
  grade,
  combo,
  misses,
  mods,

  effectiveAr,
  effectiveOd,
  effectiveCs,
  effectiveHp,

  effectiveBpm,
  effectiveStarRating,

  beatmap,
  createdAt,
}: LeaderboardEntryProps){
  const getModClass = (mod: string): string => {
    switch (mod) {
      case 'DT':
      case 'NC':
        return styles.modDT;

      case 'HD':
        return styles.modHD;

      case 'HR':
        return styles.modHR;

      case 'FL':
        return styles.modFL;

      case 'EZ':
        return styles.modEZ;

      default:
        return styles.modDefault;
    }
  };

  const displayMods = [...mods];

  if (gameMode === 'MANIA' && effectiveCs !== undefined) {
    displayMods.unshift(`${effectiveCs}K`);
  }

  const songName = `${beatmap.artist} - ${beatmap.title} [${beatmap.version}]`;

  const showAR =
    gameMode !== 'MANIA';

  const showOD =
    gameMode !== 'FRUITS';

  const showCS =
    gameMode !== 'TAIKO' &&
    gameMode !== 'MANIA';

  const showHP = true;

  return (
    <div className={styles.leaderboardEntry}>
      <span className={styles.rank}>#{rank}</span>

      <div className={styles.name}>
        {username.length > 15 ? (
          <div className={styles.marquee}>
            <span>{username}</span>
            <span>{username}</span>
          </div>
        ) : (
          <span>{username}</span>
        )}
      </div>

      <div
        className={styles.beatmap}
        style={{
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmap.beatmapsetId}/covers/cover.jpg)`,
        }}
      >
        <div className={styles.beatmapLeft}>
          <div className={styles.song}>
            {songName.length > 50 ? (
              <div className={styles.marquee}>
                <span>{songName}</span>
                <span>{songName}</span>
              </div>
            ) : (
              <span>{songName}</span>
            )}
          </div>

        <div className={styles.mapStats}>
          <span className={styles.starRating}>
            ★{' '}
            {(effectiveStarRating ??
              beatmap.difficultyRating
            ).toFixed(2)}
          </span>

          {effectiveBpm && (
            <span className={styles.stat}>
              {Math.round(effectiveBpm)} BPM
            </span>
          )}

          { showAR && effectiveAr && (
            <span className={styles.stat}>
              AR {effectiveAr.toFixed(1)}
            </span>
          )}

          {showOD && effectiveOd && (
            <span className={styles.stat}>
              OD {effectiveOd.toFixed(1)}
            </span>
          )}

          {showCS && effectiveCs && (
            <span className={styles.stat}>
              CS {effectiveCs.toFixed(1)}
            </span>
          )}

          {showHP && effectiveHp && (
            <span className={styles.stat}>
              HP {effectiveHp.toFixed(1)}
            </span>
          )}
        </div>
        </div>

        <div className={styles.beatmapRight}>
          <span className={styles.grade}>{grade}</span>

          <span className={styles.accuracy}>
            {accuracy.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className={styles.mods}>
        {displayMods.length ? (
          displayMods.map((mod) => (
            <div
              key={mod}
              className={`${styles.modBubble} ${getModClass(mod)}`}
            >
              {mod}
            </div>
          ))
        ) : (
          <div className={`${styles.modBubble} ${styles.modNM}`}>
            NM
          </div>
        )}
      </div>

      <div className={styles.performance}>
        <span className={styles.combo}>{combo}x</span>

        <span className={styles.miss}>
          {misses}❌
        </span>
      </div>

      <div className={styles.pp}>
        {Math.round(pp)}pp
      </div>

      <div className={styles.date}>
        {new Date(createdAt).toLocaleString('et-EE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}

export default LeaderboardEntry;