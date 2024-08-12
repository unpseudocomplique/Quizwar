export default defineEventHandler(async (event) => {
    const { username } = await readBody(event);

    const player = await prisma.player.create({
        data: {
            username,
        }
    });

    await setUserSession(event, { user: player });
    return player;

});