export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    const body = await readBody(event);
    const updatedQuiz = await prisma.quiz.update({
        where: { id },
        data: body,
    });
    return updatedQuiz;
});