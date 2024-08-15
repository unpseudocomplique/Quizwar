export default defineEventHandler(async (event) => {

    const gameId = event.context.params?.gameId as string
    const playerId = event.context.params?.playerId as string


    await prisma.playerGame.update({
        data: { isFinished: true },
        where: { playerId_gameId: { playerId, gameId } }
    })

    return { success: true }

})