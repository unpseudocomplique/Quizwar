export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string
    const bestPlayers = await prisma.playerGame.findMany({
      take: 25,
      where: {
        game: {
          quizId: id
        }
      },
      include: {
        player: true
      },
      orderBy: {
        gameScore: 'desc'
      },
      distinct: "playerId"
    })
  
  return bestPlayers;
})