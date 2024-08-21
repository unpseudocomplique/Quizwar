export default defineEventHandler(async (event) => {
    // Suppression des anciennes données
    await prisma.questionLabel.deleteMany({});
    await prisma.quizQuestion.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.playerAnswer.deleteMany({});
    await prisma.playerGame.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.label.deleteMany({});
    // await prisma.player.deleteMany({});
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
