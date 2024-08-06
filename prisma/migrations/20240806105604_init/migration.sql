-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "questionDuration" INTEGER NOT NULL,
    "answerDuration" INTEGER NOT NULL,
    "rightAnswers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "theme" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "display" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLabel" (
    "questionId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,

    CONSTRAINT "QuestionLabel_pkey" PRIMARY KEY ("questionId","labelId")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLabel" ADD CONSTRAINT "QuestionLabel_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLabel" ADD CONSTRAINT "QuestionLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
