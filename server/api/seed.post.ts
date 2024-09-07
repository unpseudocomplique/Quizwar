export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    const adminEmails = ['mathnewph@gmail.com']

    if (!adminEmails.includes(user.email)) {
        setResponseStatus(event, 400, 'You are not allowed to seed')
    }
    // Suppression des anciennes données
    await prisma.questionLabel.deleteMany({});
    await prisma.quizQuestion.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.playerAnswer.deleteMany({});
    await prisma.playerGame.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.label.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.quiz.deleteMany({});


    const quizzesDatas = [
    ]

    // Création des nouvelles données

    const promises = quizzesDatas.map(data => {
        return prisma.quiz.create({ data })
    })
    return await Promise.all(promises);
});
