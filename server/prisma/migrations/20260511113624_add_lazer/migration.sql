-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "isLazer" BOOLEAN;

-- CreateIndex
CREATE INDEX "Score_playerId_pp_idx" ON "Score"("playerId", "pp");

-- CreateIndex
CREATE INDEX "Score_playerId_gameMode_createdAt_idx" ON "Score"("playerId", "gameMode", "createdAt");
