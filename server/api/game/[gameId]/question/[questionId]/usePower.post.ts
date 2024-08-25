import { PowerType } from "@prisma/client"

export default defineEventHandler(async (event) => {
    const gameId = event.context.params?.gameId as string
    const questionId = event.context.params?.questionId as string
    const { user } = await requireUserSession(event)
    const body = await readBody(event);

    const { power } = body as { power: PowerType }

    const usedPower = await prisma.usedPower.create({
        data: {
            gameId: gameId,
            questionId: questionId,
            originPlayerId: user.id,
            power: power,
        }
    })
    return usedPower
})