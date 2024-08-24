-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizTheme" (
    "quizId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "QuizTheme_pkey" PRIMARY KEY ("quizId","themeId")
);

-- AddForeignKey
ALTER TABLE "QuizTheme" ADD CONSTRAINT "QuizTheme_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizTheme" ADD CONSTRAINT "QuizTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
