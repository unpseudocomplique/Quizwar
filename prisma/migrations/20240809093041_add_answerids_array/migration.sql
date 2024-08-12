/*
  Warnings:

  - You are about to drop the column `answerId` on the `PlayerAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `gameQuestionGameId` on the `PlayerAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `gameQuestionQuestionId` on the `PlayerAnswer` table. All the data in the column will be lost.
  - You are about to drop the `GameQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameQuestion" DROP CONSTRAINT "GameQuestion_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameQuestion" DROP CONSTRAINT "GameQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAnswer" DROP CONSTRAINT "PlayerAnswer_answerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAnswer" DROP CONSTRAINT "PlayerAnswer_gameQuestionGameId_gameQuestionQuestionId_fkey";

-- AlterTable
ALTER TABLE "PlayerAnswer" DROP COLUMN "answerId",
DROP COLUMN "gameQuestionGameId",
DROP COLUMN "gameQuestionQuestionId",
ADD COLUMN     "answerIds" TEXT[];

-- DropTable
DROP TABLE "GameQuestion";
