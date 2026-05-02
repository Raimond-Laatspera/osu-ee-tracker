/*
  Warnings:

  - The values [Standard,Taiko,Catch,Mania] on the enum `GameMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [Keys4,Keys5,Keys6,Keys7,Keys8,Keys9,Keys10,Keys11,Keys12] on the enum `ManiaKeys` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameMode_new" AS ENUM ('STANDARD', 'TAIKO', 'CATCH', 'MANIA');
ALTER TABLE "Score" ALTER COLUMN "gameMode" TYPE "GameMode_new" USING ("gameMode"::text::"GameMode_new");
ALTER TYPE "GameMode" RENAME TO "GameMode_old";
ALTER TYPE "GameMode_new" RENAME TO "GameMode";
DROP TYPE "public"."GameMode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ManiaKeys_new" AS ENUM ('KEYS4', 'KEYS5', 'KEYS6', 'KEYS7', 'KEYS8', 'KEYS9', 'KEYS10', 'KEYS11', 'KEYS12');
ALTER TABLE "Score" ALTER COLUMN "maniaKeys" TYPE "ManiaKeys_new" USING ("maniaKeys"::text::"ManiaKeys_new");
ALTER TYPE "ManiaKeys" RENAME TO "ManiaKeys_old";
ALTER TYPE "ManiaKeys_new" RENAME TO "ManiaKeys";
DROP TYPE "public"."ManiaKeys_old";
COMMIT;
