import { PowerType } from "@prisma/client"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const session = await requireUserSession(event)

    const { id: playerId } = session.user
    const { questionId, gameId, answerIds } = body;

    if (!playerId || !questionId || !gameId || !answerIds || !Array.isArray(answerIds)) {
        // return { error: 'All fields (playerId, questionId, gameId, answerIds) are required and answerIds must be an array' };
        setResponseStatus(event, 400, 'All fields (playerId, questionId, gameId, answerIds) are required and answerIds must be an array')
    }
    const question = await prisma.question.findUnique({
        where: { id: questionId },
    })

    const usedPower = prisma.usedPower.findMany({
        where: {
            questionId: questionId,
            gameId: gameId,
            targetPlayerId: playerId
        }
    })

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

    const powers = await usedPower

    if(isCorrect) {
        const shouldMultiply = powers.some(power => power.power === PowerType.DOUBLE_POINTS)
        let toAdd = 1
        if(shouldMultiply) {
            toAdd = toAdd * 2
        }
        const shouldSteal = powers.find(power => power.power === PowerType.STEAL_POINTS)

        if(shouldSteal){
            await prisma.playerGame.update({
                where: {
                    playerId_gameId: {
                        gameId: gameId,
                        playerId: shouldSteal.originPlayerId
                    }
                },
                data: {
                    gameScore: {
                        increment: toAdd
                    }
                }
            })
        }else {
            await prisma.playerGame.update({
                where: {
                    playerId_gameId: {
                        gameId: gameId,
                        playerId: playerId
                    }
                },
                data: {
                    gameScore: {
                        increment: toAdd
                    }
                }
            })
        }
    }

    return playerAnswer
});
