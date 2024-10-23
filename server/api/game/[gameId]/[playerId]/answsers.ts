export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string
    const playerId = event.context.params?.playerId as string

    const answers = await prisma.playerAnswer.findMany({
        where: { gameId, playerId },
        include: {
            question: {
                include: {
                    answers: true,
                    UsedPower: {
                        where: {
                            gameId,
                            OR: [
                                {
                                    originPlayerId: playerId,
                                },
                                {
                                    targetPlayerId: playerId,
                                }
                            ]


                        },
                    }
                }
            }
        }
    })

    return answers
})