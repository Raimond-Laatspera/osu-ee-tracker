-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('OSU', 'TAIKO', 'FRUITS', 'MANIA');

-- CreateEnum
CREATE TYPE "ManiaKeys" AS ENUM ('FOUR', 'SEVEN');

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "country" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beatmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" BIGINT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "beatmapId" INTEGER NOT NULL,
    "gameMode" "GameMode" NOT NULL,
    "maniaKeys" "ManiaKeys",
    "pp" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "combo" INTEGER,
    "score" BIGINT,
    "mods" INTEGER,
    "rank" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt");

-- CreateIndex
CREATE INDEX "Score_playerId_createdAt_idx" ON "Score"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "Score_beatmapId_idx" ON "Score"("beatmapId");

-- CreateIndex
CREATE INDEX "Score_gameMode_createdAt_idx" ON "Score"("gameMode", "createdAt");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_beatmapId_fkey" FOREIGN KEY ("beatmapId") REFERENCES "Beatmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
