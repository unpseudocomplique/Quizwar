export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const newQuiz = await prisma.quiz.create({
        data: body,
    });
    return newQuiz;
});
