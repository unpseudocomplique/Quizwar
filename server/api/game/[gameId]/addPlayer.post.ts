export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string

    const session = await requireUserSession(event)
    try {
        const findPlayerGame = await prisma.playerGame.findFirst({
            where: {
                playerId: session.user.id,
                gameId
            }
        })

        if (findPlayerGame) {
            return findPlayerGame
        }

        const playerGame = await prisma.playerGame.create({
            data: {
                playerId: session.user.id,
                gameId
            }
        })

        return playerGame
    } catch (e) {
        //might be a duplicate key error
        return { error: 'Error adding player to game' }
    }

})