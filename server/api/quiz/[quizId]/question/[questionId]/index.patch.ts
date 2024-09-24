export default defineEventHandler(async (event) => {
    const { display } = await readBody(event);


    return await prisma.question.update({
        where: { id: event.context.params?.questionId as string },
        data: { display }
    })
})