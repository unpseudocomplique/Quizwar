<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useShare } from '@vueuse/core'
import type { TGame } from '~/../types/game'

const { share } = useShare()


const runtimeConfig = useRuntimeConfig()
const { status, data, send, open, close, } = useWebSocket(`${runtimeConfig.public.websocket}/api/quiz/websocket`)
const { loggedIn, user, session, fetch, clear } = useUserSession()

// provide('sendGameInformation', (message: string) => send(message))

onMounted(() => {
    $fetch(`/api/game/${gameId}/addPlayer`, { method: 'POST' })
})


const gameStore = useGameStore()
gameStore.resetGame()

const route = useRoute()
const quizId = route.params.quizId

const gameId = route.params.gameId as string

const GameRoom = new Room(send, gameId)

provide('GameRoom', GameRoom)
GameRoom.join(user.value)

gameStore.addPlayer(user.value)

watch(() => data.value, (newValue) => {
    const parsed = JSON.parse(newValue)
    if (parsed.type === actionTypeEnum.START_GAME) {
        isGameStarted.value = true
    }

    if (parsed.type === actionTypeEnum.ANSWER) {
        gameStore.addAnswser(parsed.answer, parsed.player)
    }

    if (parsed.type === actionTypeEnum.JOIN) {
        gameStore.addPlayer(parsed.player)
    }
    if (parsed.type === actionTypeEnum.POWER_USED) {
        gameStore.usedPowers.push(parsed.power)
    }
    if(parsed.type === actionTypeEnum.PLAYER_READY) {
        managePlayersReady(parsed.player);
    }
    if (parsed.type === actionTypeEnum.CLOSE) {
        gameStore.players = gameStore.players.filter(player => player.player.id === parsed.playerId)
    }
}, { deep: true })


onBeforeUnmount(() => {
    GameRoom.close(user.value.id)
})

const requestPowers = useFetch(`/api/game/${gameId}/usedPower`)
const requestScore = useFetch(`/api/game/${gameId}/score`)

const { data: game } = await useFetch<TGame>(`/api/game/${gameId}`)

//game.value.quiz.questions = game.value.quiz.questions.slice(0, 5)

gameStore.game = game.value

const { data: powers } = await requestPowers
const { data: gameAnswers } = await requestScore

powers.value.forEach(power => {
    gameStore.usedPowers.push(power)
})

// gameAnswers.value.scores.forEach(score => {
//     score.answers.forEach(answer => {
//         gameStore.addAnswser(answer, score.player)
//     })
// })

const { text, copy, copied, isSupported } = useClipboard({ source: game.value.display })


onMounted(() => {
    // const isDev = window.location.href.includes('localhost')
    // if (isDev) game.value.quiz.questions = game.value.quiz.questions.slice(0, 2)
})

watch(text, () => {

    const toast = useToast()
    toast.add({ title: 'Copied game code', icon: 'i-heroicons-clipboard-check', color: 'green' })
})
const currentQuestion = ref(null)
const isGameOver = ref(false)
const isGameStarted = ref(false)
const showScore = ref(false)
const awaitUsers = ref(false);
const isSettingsOpen = ref(false)

const isLastQuestion = computed(() => gameStore.currentQuestionIndex === game.value.quiz.questions.length - 1)

currentQuestion.value = game.value.quiz.questions[gameStore.currentQuestionIndex].question
const getAnswer = async (question, answers) => {
    const questionIndex = game.value.quiz.questions.findIndex(item => item.questionId === question.id)
    if (questionIndex === -1) return;

    // const answerIndex = answers.length === 0 ? -1 : game.value.quiz.questions[questionIndex].question.answers.findIndex(item => item.id === answers.find(answer => answer.selected).id)

    // if (answerIndex > -1) game.value.quiz.questions[questionIndex].question.answers[answerIndex].selected = true
    try {

        const answer = await $fetch('/api/player/answser', {
            method: 'POST',
            body: { questionId: question.id, gameId: gameId, answerIds: answers.map(answer => answer.id) }
        })
        GameRoom.sendAnswer(user.value, answer)

        gameStore.addAnswser(answer, user.value)
    } catch (e) {
        console.log(e)
    }

    if (!isLastQuestion.value && gameStore.currentQuestionIndex % 5 === 0) {
        showScore.value = true
        await sleep(5000)
        showScore.value = false
    }
    
    awaitUsers.value = true;
    await sendReady()
}

const sendReady = async () => {
    GameRoom.sendPlayerReady(user.value.username)
    managePlayersReady(user.value.username)
}

const managePlayersReady = (player:string) => {
    gameStore.addPlayerReady(player);

    verifyAllPlayersReady();
}

const verifyAllPlayersReady = () => {
    const allPlayerReady = ref(false);

    // Ajouter ici la logique
    if(gameStore.allOtherPlayers.length+1 == gameStore.playersReadyList.length)
        allPlayerReady.value = true;

    if (allPlayerReady.value === true) {
        awaitUsers.value = false;
        gameStore.resetPlayersReady();
        nextQuestion();
    }
}

const nextQuestion = () => {
    if (isLastQuestion.value) {
        const router = useRouter()
        router.push(`/quizzes/${quizId}/${gameId}/score`)
        return;
    }

    gameStore.currentQuestionIndex = gameStore.currentQuestionIndex + 1

    currentQuestion.value = game.value.quiz.questions[gameStore.currentQuestionIndex].question
}

const startGame = async () => {
    GameRoom.startGame()
    isGameStarted.value = true
}

const shareGame = async () => {
    share({
        url: window.location.href,
        title: 'La guerre est déclarée',
        text: `Je te défie sur ${game.value.display}`,
    })
}

const particlesOptions = {
    fullScreen: {
        enable: false,
    },
    fpsLimit: 120,
    background: {
        color: {
            value: 'transparent'
        }
    },
    particles: {
        number: {
            value: 80
        },
        size: {
            value: { min: 1, max: 5 }
        }
    },
    preset: 'stars',
    detectRetina: true
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
                <!-- <u-slideover v-model="isSettingsOpen">
                </u-slideover> -->
                <!-- <game-settings v-model="game" /> -->
                <game-setup-questions v-model="game" />
                <p class="cursor-pointer text-xl mt-28" @click="copy(game.display)">Game code : {{ game.display }} <icon
                        name="i-ph-clipboard-text-thin"></icon>
                </p>
                <p class="text-gray-400">or share this game</p>
                <ClientOnly>
                    <UButton @click="shareGame" color="green" size="xl">Share
                        <Icon name="i-ph-share-network-duotone" />
                    </UButton>
                </ClientOnly>

                <h1 class="text-2xl mt-10">Are you ready ?</h1>
                <UButton @click="startGame" color="green" size="xl">Start</UButton>
                <game-player-online />


            </UDashboardPanelContent>
            <UDashboardPanelContent v-else-if="!isGameOver">
                <vue-particles id="tsparticles" class="absolute top-0 left-0 w-full h-full"
                    :options="particlesOptions" />
                <u-card class="h-full flex flex-col" v-if="!showScore"
                    :ui="{ body: { base: 'h-full flex' }, padding: 'px-4 py-5 sm:p-6' }">
                    <template #header>
                        <p>Question : {{ gameStore.currentQuestionIndex + 1 }} / {{ game.quiz.questions.length }}</p>

                    </template>
                    <game-question-item v-if="currentQuestion && !awaitUsers" v-model="currentQuestion"
                        :key="currentQuestion.id" @answer="getAnswer(currentQuestion, $event)"></game-question-item>
                    <game-player-ready v-if="awaitUsers" />

                </u-card>
                <u-card v-else class="h-full flex flex-col"
                    :ui="{ body: { base: 'h-full flex' }, padding: 'px-4 py-5 sm:p-6' }">
                    <template #header>
                        <p>Comment se déroule la partie a la question : {{ gameStore.currentQuestionIndex + 1 }} ?</p>

                    </template>
                    <!-- <game-score-table /> -->
                    <game-score :game-id="gameId" />

                </u-card>

            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
