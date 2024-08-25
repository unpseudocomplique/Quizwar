export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string

    const powers = await prisma.usedPower.findMany({
        where: { gameId },
    })

    return powers
})