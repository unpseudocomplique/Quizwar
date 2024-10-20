<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, provide } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useShare } from '@vueuse/core'
import { WebsocketProvider } from 'y-crossws/provider'
import * as Y from 'yjs'
import type { TGame } from '~/../types/game'
import { useGameStore } from '~/stores/game'

const { share } = useShare()
const gameStore = useGameStore()
const route = useRoute()
const quizId = route.params.quizId
const gameId = route.params.gameId as string
const status = ref("connecting");

gameStore.resetGame()

const isGameStarted = ref(false)
const isGameOver = ref(false)
const showScore = ref(false)
const awaitUsers = ref(false)
const isSettingsOpen = ref(false)

const isLastQuestion = computed(() => gameStore.currentQuestionIndex === gameStore.game.quiz.questions.length - 1)
const currentQuestion = ref(null)
const { user } = useUserSession()

const requestPowers = useFetch(`/api/game/${gameId}/usedPower`)
const requestScore = useFetch(`/api/game/${gameId}/score`)

const { data: game } = await useFetch<TGame>(`/api/game/${gameId}`)

//game.value.quiz.questions = game.value.quiz.questions.slice(0, 5)

gameStore.game = game.value

const { data: powers } = await requestPowers
// const { data: gameAnswers } = await requestScore

powers.value.forEach(power => {
    gameStore.usedPowers.push(power)
})

// gameAnswers.value.scores.forEach(score => {
//     score.answers.forEach(answer => {
//         gameStore.addAnswser(answer, score.player)
//     })
// })

const { text, copy, copied, isSupported } = useClipboard({ source: game.value.display })



// Yjs setup
const ydoc = new Y.Doc()
let provider
let yGameState
let yPlayers

onMounted(() => {
    const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProto}//${window.location.host}/api/yjs`;
    console.log(wsUrl)
    const provider = new WebsocketProvider(wsUrl, "game", ydoc);
    const statusHandler = (event: { status: string }) => {
        console.log('event update', event)
        status.value = event.status;
    };
    provider.on("status", statusHandler);

    // Create Yjs maps for game state and players
    yGameState = ydoc.getMap('gameState')
    yPlayers = ydoc.getMap('players')

    // Set up listeners for Yjs updates
    yGameState.observe(event => {
        const state = yGameState.toJSON()
        if (state.isGameStarted !== undefined) {
            isGameStarted.value = state.isGameStarted
        }
    })

    yPlayers.observe(event => {
        const updatedPlayers = Object.values(yPlayers.toJSON()).map(player => ({
            player,
            answers: []
        }))
        gameStore.players = updatedPlayers
    })

    // Join the game room with the player's info
    const playerInfo = {
        id: user.value.id,
        username: user.value.username,
        picture: user.value.picture
    }
    yPlayers.set(user.value.id, playerInfo)
    // gameStore.addPlayer(playerInfo)
})

onBeforeUnmount(() => {
    if (provider) {
        provider.disconnect()
    }
})

const startGame = () => {
    yGameState.set('isGameStarted', true)
}

const nextQuestion = () => {
    if (isLastQuestion.value) {
        const router = useRouter()
        router.push(`/quizzes/${quizId}/${gameId}/score`)
        return
    }

    gameStore.currentQuestionIndex += 1
    currentQuestion.value = gameStore.game.quiz.questions[gameStore.currentQuestionIndex].question
}

const sendAnswer = (question, answers) => {
    const { user } = useUserSession()
    const answerData = {
        questionId: question.id,
        playerId: user.value.id,
        answers,
    }
    yPlayers.set(user.value.id, { ...yPlayers.get(user.value.id), answers })
    gameStore.addAnswser(answerData, user.value)
}

const managePlayersReady = (player) => {
    gameStore.addPlayerReady(player)
    verifyAllPlayersReady()
}

const verifyAllPlayersReady = () => {
    if (gameStore.players.length === gameStore.playersReadyList.length) {
        awaitUsers.value = false
        gameStore.resetPlayersReady()
        nextQuestion()
    }
}

const shareGame = async () => {
    await share({
        url: window.location.href,
        title: 'La guerre est déclarée',
        text: `Je te défie sur ${gameStore.game.display}`,
    })
}
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Home">
                <template #right>
                    <UButton @click="isSettingsOpen = true" variant="soft">
                        Settings
                        <Icon name="i-ph-gear-six-light" class="text-xl" />
                    </UButton>
                </template>
            </UDashboardNavbar>

            <UDashboardPanelContent v-if="!isGameStarted" class="flex flex-col items-center gap-4">
                <game-setup-questions v-model="gameStore.game" v-if="user.id === gameStore.game.authorId" />
                <p class="text-xl font-bold">STATE : {{ status }}</p>
                <p class="cursor-pointer text-xl mt-28" @click="copy(gameStore.game.display)">
                    Game code : {{ gameStore.game.display }}
                    <Icon name="i-ph-clipboard-text-thin"></Icon>
                </p>
                <ClientOnly>
                    <UButton @click="shareGame" color="green" size="xl">Share</UButton>
                </ClientOnly>

                <h1 class="text-2xl mt-10">Are you ready?</h1>
                <UButton @click="startGame" color="green" size="xl">Start</UButton>
                <game-player-online />
            </UDashboardPanelContent>

            <UDashboardPanelContent v-else-if="!isGameOver">
                <!-- <vue-particles id="tsparticles" class="absolute top-0 left-0 w-full h-full"
                    :options="particlesOptions" /> -->
                <u-card v-if="!showScore">
                    <template #header>
                        <p>Question : {{ gameStore.currentQuestionIndex + 1 }} / {{ gameStore.game.quiz.questions.length
                            }}</p>
                    </template>
                    <game-question-item v-if="currentQuestion && !awaitUsers" v-model="currentQuestion"
                        @answer="sendAnswer(currentQuestion, $event)" />
                    <game-player-ready v-if="awaitUsers" />
                </u-card>

                <u-card v-else>
                    <template #header>
                        <p>Comment se déroule la partie à la question : {{ gameStore.currentQuestionIndex + 1 }}?</p>
                    </template>
                    <game-score :game-id="gameId" />
                </u-card>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
