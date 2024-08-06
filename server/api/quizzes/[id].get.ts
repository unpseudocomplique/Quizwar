export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string

    return await prisma.quiz.findUnique({
        where: { id },
        include: {
            questions: {
                include: {
                    question: true
                }
            }
        }
    })
})