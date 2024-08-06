export default defineEventHandler(async () => {
    return await prisma.question.findMany({
        where: {
            isDeleted: false
        }
    })
})
