export default defineEventHandler(async (event) => {
    const { gameDisplay } = event.context.params;
    const session = await requireUserSession(event)

    const game = await prisma.game.findFirst({
        where: { display: gameDisplay, isActive: true },
        include: {
            players: {
                where: {
                    playerId: session.user.id
                }
            },
        }
    })


    if (!game) {
        return setResponseStatus(event, 404, 'Game not found')
    }

    // Vérifier si le joueur est déjà dans la partie
    const player = game.players.find(player => player.playerId === session.user.id)


    if (player) {
        return { error: 'You are already in this game' };
    }

    // Ajouter le joueur à la partie
    await prisma.game.update({
        where: { id: game.id },
        data: {
            players: {
                create: {
                    playerId: session.user.id
                }
            }
        }
    });

    return { gameId: game.id, quizId: game.quizId }
})