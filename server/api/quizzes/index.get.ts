export default defineEventHandler(async () => {
    return await prisma.quiz.findMany({
        where: {
            isDeleted: false
        }
    })
})