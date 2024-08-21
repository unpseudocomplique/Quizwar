export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event)
    if (!files[0]) {
        return setResponseStatus(event, 400, 'Missing file')
    }
    const questionId = event.context.params?.questionId as string
    const quizId = event.context.params?.quizId as string

    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            answers: true
        }
    })

    if (!question) {
        return setResponseStatus(event, 404, 'Question not found')
    }
    const file = files[0]
    const fileName = file.filename
    const fileBuffer = file.data
    await uploadFile(fileBuffer, 'default', fileName)
    question.picture = `https://s3.quizwar.app/default/${fileName}`

    await prisma.question.update({
        where: { id: questionId },
        data: { picture: question.picture }
    })



    return { question }
})