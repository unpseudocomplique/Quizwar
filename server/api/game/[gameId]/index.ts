export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
            players: true,
            parameters: true,
            quiz: {
                include: {
                    questions: {
                        orderBy: {
                            order: 'asc'
                        },
                        include: {
                            question: {
                                include: {
                                    answers: true,
                                    labels: {
                                        include: {
                                            label: true
                                        }
                                    },
                                }
                            }
                        }
                    },
                }
            }
        }
    })
    return game
})