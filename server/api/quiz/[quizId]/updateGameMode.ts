export default defineEventHandler(async (event) => {
    const {id, rangeStart, rangeEnd } = await readBody(event);
    const gameMode = await prisma.gameParameter.update({
        where: { id },
        data: {
            rangeStart,
            rangeEnd
        }
    })

    if (!gameMode) {
        return setResponseStatus(event, 404, 'Game mode not found')
    }

    return gameMode
})
