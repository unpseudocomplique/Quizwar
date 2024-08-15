export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string

    const players = await prisma.playerGame.findMany({
        where: { gameId, isFinished: false },
    })

    if (players.length > 0) {
        return { error: 'Some players are still playing' }
    }

    await prisma.game.update({
        data: { isActive: false },
        where: { id: gameId }
    })

    return { success: true }

})