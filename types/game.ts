import route from '../server/api/game/[gameId]/question/[questionId]/usePower.post'
import routFetchGame from '../server/api/game/[gameId]/index'

export type TPostedPower = Awaited<ReturnType<typeof route>>

export type TGame = Awaited<ReturnType<typeof routFetchGame>>