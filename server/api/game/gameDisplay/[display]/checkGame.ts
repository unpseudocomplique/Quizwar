export default defineEventHandler(async (event) => {
    const display = event.context.params?.display as string

    const game = await prisma.game.findFirst({
        where: { display: display, isActive: true },
    })

    if (!game) {
        return setResponseStatus(event, 404, 'Game not found')
    }

    return game
})
