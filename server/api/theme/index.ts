export default defineEventHandler(async () => {
    return await prisma.theme.findMany({
        where: {
            isDeleted: false
        },
        include: {
            _count: {
                select: {
                    quizzes: true
                }
            }
        }
    })
})