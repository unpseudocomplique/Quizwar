export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string

    return await prisma.question.findUnique({
        where: { id }
    })
})
