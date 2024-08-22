export default oauthGoogleEventHandler({
    config: {

    },
    async onSuccess(event, { user, tokens }) {
        console.log('GitHub OAuth success:', user)
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
        return sendRedirect(event, foundUser ? '/quizzes' : '/auth/setup')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})