-- CreateEnum
CREATE TYPE "PowerType" AS ENUM ('FIFTY_FIFTY', 'STEAL_POINTS', 'BLOCK', 'DOUBLE_POINTS');

-- CreateTable
CREATE TABLE "UsedPower" (
    "id" TEXT NOT NULL,
    "power" "PowerType" NOT NULL,
    "questionId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "originPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsedPower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsedPower_originPlayerId_idx" ON "UsedPower"("originPlayerId");

-- CreateIndex
CREATE INDEX "UsedPower_targetPlayerId_idx" ON "UsedPower"("targetPlayerId");

-- CreateIndex
CREATE INDEX "UsedPower_questionId_idx" ON "UsedPower"("questionId");

-- CreateIndex
CREATE INDEX "UsedPower_gameId_idx" ON "UsedPower"("gameId");

-- AddForeignKey
ALTER TABLE "UsedPower" ADD CONSTRAINT "UsedPower_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedPower" ADD CONSTRAINT "UsedPower_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedPower" ADD CONSTRAINT "UsedPower_originPlayerId_fkey" FOREIGN KEY ("originPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedPower" ADD CONSTRAINT "UsedPower_targetPlayerId_fkey" FOREIGN KEY ("targetPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
