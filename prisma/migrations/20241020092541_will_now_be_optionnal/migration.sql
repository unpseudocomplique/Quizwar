/*
  Warnings:

  - Made the column `authorId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_authorId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "order" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
