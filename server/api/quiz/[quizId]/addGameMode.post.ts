export default defineEventHandler(async (event) => {
    const { gameId, gameMode, rangeStart, rangeEnd } = await readBody(event);

    const quiz = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
            parameters: true
        }
    })

    if (!quiz) {
        return setResponseStatus(event, 404, 'Quiz not found')
    }



    await prisma.gameParameter.create({
        data: {
            gameId: gameId,
            parameter: gameMode,
            rangeStart,
            rangeEnd
        }
    })

    return quiz
})