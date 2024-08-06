export default defineEventHandler(async (event) => {
    const { cursor, take } = getQuery(event)
    const queryCursor = cursor ? { id: cursor as string } : undefined
    const queryTake = parseInt(take as string) || 10

    const quizzes = await prisma.quiz.findMany({
        where: {
            isDeleted: false
        },
        take: queryTake + 1,
        skip: cursor ? 1 : 0,
        cursor: queryCursor,
    })

    return {
        quizzes: quizzes.slice(0, queryTake),
        hasMore: quizzes.length > queryTake
    }
})
