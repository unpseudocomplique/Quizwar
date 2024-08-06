export default defineEventHandler(async (event) => {
    const quizzes = await prisma.quiz.findMany();
    return quizzes;
});
