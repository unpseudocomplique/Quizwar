-- CreateEnum
CREATE TYPE "ParameterType" AS ENUM ('FASTER_RESPONSE_MORE_POINTS', 'POINTS_X5');

-- CreateTable
CREATE TABLE "GameParameter" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "parameter" "ParameterType" NOT NULL,
    "value" TEXT,
    "rangeStart" INTEGER NOT NULL,
    "rangeEnd" INTEGER NOT NULL,

    CONSTRAINT "GameParameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameParameter_gameId_idx" ON "GameParameter"("gameId");

-- AddForeignKey
ALTER TABLE "GameParameter" ADD CONSTRAINT "GameParameter_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
