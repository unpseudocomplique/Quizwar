export default defineEventHandler(async (event) => {

    const { username } = await readBody(event);

    const session = await requireUserSession(event)
    console.log(session.user.id, username)
    const data = {
        ...(username && { username }),
    }

    console.log(data)

    const player = await prisma.player.update({
        where: { id: session.user.id },
        data
    })

    console.log(player)

    return player

})