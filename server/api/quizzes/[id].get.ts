export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string
    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
            questions: {
                include: {
                    question: {
                        include: {
                            answers: true
                        }
                    }
                }
            }
        }
    })

    return quiz
})