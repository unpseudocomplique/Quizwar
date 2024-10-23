import route from '../server/api/game/[gameId]/question/[questionId]/usePower.post'
import routFetchGame from '../server/api/game/[gameId]/index'
import routeFetchGameScore from '../server/api/game/[gameId]/score'
import routeFetchGamePlayerAnswers from '../server/api/game/[gameId]/[playerId]/answsers'

export type TPostedPower = Awaited<ReturnType<typeof route>>

export type TGame = Awaited<ReturnType<typeof routFetchGame>>

export type TGameScore = Awaited<ReturnType<typeof routeFetchGameScore>>

export type TGamePlayerAnswers = Awaited<ReturnType<typeof routeFetchGamePlayerAnswers>>