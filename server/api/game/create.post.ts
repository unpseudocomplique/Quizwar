export default defineEventHandler(async (event) => {
    const { room, quizId } = await readBody(event);

    const session = await requireUserSession(event)

    const doesGameExist = await prisma.game.findFirst({
        where: { display: room, isActive: true },
    })

    if (doesGameExist) {
        return setResponseStatus(event, 409, 'Game already exists')
    }

    const game = await prisma.game.create({
        data: {
            display: room,
            quizId: quizId,
            players: {
                create: {
                    playerId: session.user.id,
                }
            },
            authorId: session.user.id
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