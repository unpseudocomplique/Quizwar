export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const session = await requireUserSession(event)

    const { id: playerId } = session.user
    const { questionId, gameId, answerIds } = body;

    if (!playerId || !questionId || !gameId || !answerIds || !Array.isArray(answerIds)) {
        return { error: 'All fields (playerId, questionId, gameId, answerIds) are required and answerIds must be an array' };
    }

    try {
        // Vérifiez si toutes les réponses sont correctes
        const answers = await prisma.answer.findMany({
            where: {
                questionId: questionId,
                isActive: true,
                isDeleted: false
            },
        });

        const allCorrectAnswers = answers.filter((answer) => answer.isCorrect);

        const isCorrect = allCorrectAnswers.length === answerIds.length && allCorrectAnswers.every((answer) => answerIds.includes(answer.id));



        // Créez l'enregistrement de la réponse du joueur
        const playerAnswer = await prisma.playerAnswer.create({
            data: {
                playerId,
                questionId,
                gameId,
                answerIds,
                isCorrect,
            },
        });

        return { success: true, playerAnswer };
    } catch (error) {
        return { error: error.message };
    }
});
