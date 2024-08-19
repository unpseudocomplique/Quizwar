export default defineEventHandler(async (event) => {

    const gameId = event.context.params?.gameId as string

    const gameRequest = prisma.game.findUnique({
        where: { id: gameId },
        select: {
            isActive: true
        }
    })

    // Récupérer les réponses des joueurs pour la partie donnée
    const playerAnswers = await prisma.playerAnswer.findMany({
        where: { gameId },
        include: {
            player: true,
            question: {
                include: {
                    answers: true
                }
            }
        }
    })

    // Calculer les scores pour chaque joueur
    const scores = playerAnswers.reduce((acc, answer) => {
        const { playerId, isCorrect, player, question } = answer

        if (!acc[playerId]) {
            acc[playerId] = {
                player,
                score: 0,
                answers: [],
                display: question.display
            }
        }
        acc[playerId].answers.push(answer)

        if (isCorrect) {
            acc[playerId].score += 1
        }

        return acc
    }, {} as Record<string, { player: typeof playerAnswers[0]['player'], score: number, answers: typeof playerAnswers, display: string }>)

    // Transformer l'objet en tableau
    const scoreArray = Object.values(scores)

    const game = await gameRequest

    // Retourner le tableau des scores
    return { scores: scoreArray, isActive: game.isActive }
})