import route from '../server/api/game/[gameId]/question/[questionId]/usePower.post'

export type TPostedPower = Awaited<ReturnType<typeof route>>