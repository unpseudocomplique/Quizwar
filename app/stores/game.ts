export enum PowerType {
    FIFTY_FIFTY = 'FIFTY_FIFTY',
    STEAL_POINTS = 'STEAL_POINTS',
    BLOCK = 'BLOCK',
    DOUBLE_POINTS = 'DOUBLE_POINTS'
}
export const useGameStore = defineStore('game', {
    state: () => {

        const game = ref(null)
        const players = ref([])
        const currentQuestionIndex = ref(0)
        const usedPowers = ref([])

        return {
            game,
            players,
            currentQuestionIndex,
            usedPowers
        }
    },
    actions: {
        resetGame: function () {
            this.players = []
            this.currentQuestionIndex = 0
            this.usedPowers = []
            this.game = null
        },
        addAnswser: function (answser, player) {
            let playerIndex = this.players.findIndex(item => item.player.id === player.id)
            if (playerIndex === -1) {
                this.players.push({
                    player,
                    answers: [answser]
                })
            } else {
                this.players[playerIndex].answers.push(answser)
            }
        },
        addPlayer: function (player) {
            const playerIndex = this.players.findIndex(item => player.id === item.player.id)
            if (playerIndex !== -1) {
                return
            }
            this.players.push({
                player,
                answers: []
            })
        }
    },
    getters: {
        scorePerPlayer(store) {
            console.log(store.players)
            return store.players.reduce((acc, player) => {
                const { answers } = player
                const score = answers.reduce((acc, answer) => {
                    if (answer.isCorrect) {
                        acc.correct += 1
                    } else {
                        acc.wrong += 1
                    }
                    return acc
                }, { correct: 0, wrong: 0 })
                acc.push({
                    player: player.player,
                    score
                })
                return acc
            }, [])
        },
        availablePowers(store) {
            const initialPowers = {
                FIFTY_FIFTY: 2,
                STEAL_POINTS: 2,
                BLOCK: 2,
                DOUBLE_POINTS: 2
            }
            const { user } = useUserSession()
            const playerId = user.value.id
            return store.usedPowers.reduce((acc, power) => {
                if (power.originPlayerId === playerId) {
                    acc[power.power] -= 1
                }
                return acc
            }, initialPowers)

        },
        allOtherPlayers(store) {
            const { user } = useUserSession()
            return store.players.filter(player => player.player.id !== user.value.id)
        }
    }
})