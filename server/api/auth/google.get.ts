export default oauthGoogleEventHandler({
    config: {

    },
    async onSuccess(event, { user, tokens }) {
        const query = getQuery(event)
        const newUrl = parseCookies(event).redirect

        const foundUser = await prisma.player.findUnique({
            where: {
                email: user.email
            }
        })
        if (!foundUser) {
            const username = user.email.split('@')[0]
            await prisma.player.create({
                data: {
                    username,
                    email: user.email,
                    picture: user.picture
                }
            })
        }
        const player = await prisma.player.findUnique({
            where: {
                email: user.email
            }
        })
        await setUserSession(event, {
            user: player
        })

        return sendRedirect(event, foundUser ? newUrl ? newUrl : '/quizzes' : '/auth/setup')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})