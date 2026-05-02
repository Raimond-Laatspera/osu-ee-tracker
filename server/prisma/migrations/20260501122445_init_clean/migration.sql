/*
  Warnings:

  - You are about to drop the column `score` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameMode` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pp` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('Standard', 'Taiko', 'Catch', 'Mania');

-- CreateEnum
CREATE TYPE "ManiaKeys" AS ENUM ('Keys4', 'Keys5', 'Keys6', 'Keys7', 'Keys8', 'Keys9', 'Keys10', 'Keys11', 'Keys12');

-- AlterTable
CREATE SEQUENCE player_id_seq;
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT nextval('player_id_seq');
ALTER SEQUENCE player_id_seq OWNED BY "Player"."id";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "score",
ADD COLUMN     "gameMode" "GameMode" NOT NULL,
ADD COLUMN     "maniaKeys" "ManiaKeys",
ADD COLUMN     "pp" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rank" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE INDEX "Score_gameMode_pp_idx" ON "Score"("gameMode", "pp");
