/*
  Warnings:

  - You are about to drop the column `gameId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "gameId";

-- CreateTable
CREATE TABLE "PlayerGame" (
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "PlayerGame_pkey" PRIMARY KEY ("playerId","gameId")
);

-- AddForeignKey
ALTER TABLE "PlayerGame" ADD CONSTRAINT "PlayerGame_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGame" ADD CONSTRAINT "PlayerGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
