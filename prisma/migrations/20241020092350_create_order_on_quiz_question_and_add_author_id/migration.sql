-- AlterTable
ALTER TABLE "Game" ADD COLUMN "authorId" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN "order" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Game"
ADD CONSTRAINT "Game_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Met à jour les enregistrements existants pour définir authorId
UPDATE "Game"
SET
    "authorId" = (
        SELECT "id"
        FROM "Player"
        ORDER BY "createdAt"
        LIMIT 1
    )
WHERE
    "authorId" IS NULL;