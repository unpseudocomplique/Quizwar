export default defineEventHandler(async (event) => {

    const gameId = event.context.params?.gameId as string
    
    const scores = await prisma.playerGame.findMany({
        where: { gameId },
        include: {
            player: true,
            game: {
                include: {
                    quiz: {
                        include: {
                            questions: {
                                include: {
                                    question: {
                                        include: {
                                            answers: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
 
    return scores
})