export const useGameStore = defineStore('game', {
    state: () => {

        const players = ref([])
        const currentQuestionIndex = ref(0)

        return {
            players,
            currentQuestionIndex
        }
    },
    actions: {
        resetGame: function () {
            this.players = []
            this.currentQuestionIndex = 0
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
        }
    }
})