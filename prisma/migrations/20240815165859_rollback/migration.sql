/*
  Warnings:

  - The primary key for the `PlayerGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlayerGame` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerGame" DROP CONSTRAINT "PlayerGame_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlayerGame_pkey" PRIMARY KEY ("playerId", "gameId");
