export default defineEventHandler(async (event) => {

    const gameId = event.context.params?.gameId as string


    // Récupérer les réponses des joueurs pour la partie donnée
    const playerAnswers = await prisma.playerAnswer.findMany({
        where: { gameId },
        include: {
            player: true
        }
    })

    // Calculer les scores pour chaque joueur
    const scores = playerAnswers.reduce((acc, answer) => {
        const { playerId, isCorrect, player } = answer

        if (!acc[playerId]) {
            acc[playerId] = {
                player,
                score: 0,
            }
        }

        if (isCorrect) {
            acc[playerId].score += 1
        }

        return acc
    }, {} as Record<string, { player: typeof playerAnswers[0]['player'], score: number }>)

    // Transformer l'objet en tableau
    const scoreArray = Object.values(scores)

    // Retourner le tableau des scores
    return { scores: scoreArray }
})