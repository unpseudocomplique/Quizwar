export default defineEventHandler(async (event) => {
    const { username, room, quizId } = await readBody(event);

    return await prisma.game.create({
        data: {
            display: room,
            quizId: quizId,
            players: {
                create: [
                    {
                        username,
                    }
                ]
            }
        },
    });

});