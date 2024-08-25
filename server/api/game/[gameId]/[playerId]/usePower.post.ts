import { PowerType } from "@prisma/client"

export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string
    const playerId = event.context.params?.playerId as string
    const body = await readBody(event);

    const { power } = body as { power: PowerType }

    power

    const usedPower = await prisma.usedPower.create({
        data: {
            gameId: gameId,
            originPlayerId: playerId,
            power: power,

        }
    })

    return usedPower
})