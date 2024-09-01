import route from '../server/api/player/answser.post'

export type TPostedPlayerAnswer = Awaited<ReturnType<typeof route>>

