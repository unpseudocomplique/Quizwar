export default defineEventHandler(async (event) => {
    const id = event.context.params?.id as string
    const playersGroupedByGame = await prisma.playerAnswer.groupBy({
        by: ['gameId', 'playerId'],
        where: {
          isCorrect: true,
          question: {
            quizzes: {
              some: {
                quizId: id,  // Filtrer par le quiz spécifique
              },
            },
          },
        },
        _count: {
          id: true,  // Compter le nombre de réponses correctes par joueur par partie
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 100,
    });

    const playerIds = playersGroupedByGame.map(player => player.playerId);
    

    const playersInfo = await prisma.player.findMany({
    where: {
        id: { in: playerIds },
    },
    select: {
        id: true,
        username: true,
        picture: true
    },
    });

     // Étape 3 : Associer les informations des joueurs à leurs statistiques
  const results = playersInfo.map(playerInfo => {
    return {
        ...playerInfo,
        score: playersGroupedByGame.find(playerScore => playerScore.playerId === playerInfo.id)._count.id || 0

    }
  });

  console.log(results);

  return results;
})