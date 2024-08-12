export default defineEventHandler(async (event) => {
    const { room, quizId } = await readBody(event);

    const session = await requireUserSession(event)


    const game = await prisma.game.create({
        data: {
            display: room,
            quizId: quizId,
            players: {
                create: {
                    playerId: session.user.id,
                }
            }
        },
        include: {
            players: {
                include: {
                    player: true
                }
            }
        }
    });


    return game

});