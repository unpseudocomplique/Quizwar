export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string

    const updatedQuiz = await prisma.quiz.update({
        where: { id },
        data: { isDeleted: true }
    })

    return updatedQuiz
})
