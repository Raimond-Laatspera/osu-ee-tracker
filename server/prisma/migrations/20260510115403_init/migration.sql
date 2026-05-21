-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('OSU', 'TAIKO', 'FRUITS', 'MANIA');

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "modes" "GameMode"[],
    "avatarUrl" TEXT,
    "globalRank" INTEGER,
    "countryRank" INTEGER,
    "lastPolledAt" TIMESTAMP(3),
    "lastScoreAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beatmap" (
    "id" INTEGER NOT NULL,
    "beatmapsetId" INTEGER NOT NULL,
    "artist" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "difficultyRating" DOUBLE PRECISION,
    "bpm" DOUBLE PRECISION,
    "totalLength" INTEGER,
    "hitLength" INTEGER,
    "ar" DOUBLE PRECISION,
    "od" DOUBLE PRECISION,
    "hp" DOUBLE PRECISION,
    "cs" DOUBLE PRECISION,
    "maxCombo" INTEGER,
    "keyCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beatmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" BIGINT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "beatmapId" INTEGER NOT NULL,
    "gameMode" "GameMode" NOT NULL,
    "pp" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "score" BIGINT,
    "combo" INTEGER,
    "count300" INTEGER,
    "count100" INTEGER,
    "count50" INTEGER,
    "countMiss" INTEGER,
    "countGeki" INTEGER,
    "countKatu" INTEGER,
    "mods" INTEGER,
    "rank" TEXT,
    "effectiveAr" DOUBLE PRECISION,
    "effectiveOd" DOUBLE PRECISION,
    "effectiveCs" DOUBLE PRECISION,
    "effectiveHp" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Beatmap_mode_idx" ON "Beatmap"("mode");

-- CreateIndex
CREATE INDEX "Beatmap_difficultyRating_idx" ON "Beatmap"("difficultyRating");

-- CreateIndex
CREATE INDEX "Beatmap_ar_idx" ON "Beatmap"("ar");

-- CreateIndex
CREATE INDEX "Beatmap_od_idx" ON "Beatmap"("od");

-- CreateIndex
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt");

-- CreateIndex
CREATE INDEX "Score_playerId_createdAt_idx" ON "Score"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "Score_beatmapId_idx" ON "Score"("beatmapId");

-- CreateIndex
CREATE INDEX "Score_gameMode_createdAt_idx" ON "Score"("gameMode", "createdAt");

-- CreateIndex
CREATE INDEX "Score_pp_idx" ON "Score"("pp");

-- CreateIndex
CREATE INDEX "Score_accuracy_idx" ON "Score"("accuracy");

-- CreateIndex
CREATE INDEX "Score_mods_idx" ON "Score"("mods");

-- CreateIndex
CREATE INDEX "Score_effectiveAr_idx" ON "Score"("effectiveAr");

-- CreateIndex
CREATE INDEX "Score_effectiveOd_idx" ON "Score"("effectiveOd");

-- CreateIndex
CREATE UNIQUE INDEX "Score_playerId_beatmapId_createdAt_key" ON "Score"("playerId", "beatmapId", "createdAt");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_beatmapId_fkey" FOREIGN KEY ("beatmapId") REFERENCES "Beatmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
