<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useShare } from '@vueuse/core'
import { ca } from 'date-fns/locale';

const { share } = useShare()


const runtimeConfig = useRuntimeConfig()
const { status, data, send, open, close, } = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/websocket`)
const { loggedIn, user, session, fetch, clear } = useUserSession()

const gameStore = useGameStore()
gameStore.resetGame()

const route = useRoute()
const quizId = route.params.quizId

const gameId = route.params.gameId as string
send(JSON.stringify({ type: 'join', room: gameId, player: toRaw(user.value) }))

watch(() => data.value, (newValue) => {
    const parsed = JSON.parse(newValue)
    if (parsed.type === 'startgame') {
        isGameStarted.value = true
    }

    if (parsed.type === "answer") {
        gameStore.addAnswser(parsed.answer, parsed.player)
    }

    if (parsed.type === "join") {
        gameStore.addPlayer(parsed.player)
    }
}, { deep: true })


const { data: dataType } = useFetch(`/api/game/fakeId`, { immediate: false })

const { data: game } = await useFetch<typeof dataType.value>(`/api/game/${gameId}`)

const { text, copy, copied, isSupported } = useClipboard({ source: game.value.display })


onMounted(() => {
    const isDev = window.location.href.includes('localhost')
    if (isDev) game.value.quiz.questions = game.value.quiz.questions.slice(0, 4)
})

watch(text, () => {

    const toast = useToast()
    toast.add({ title: 'Copied game code', icon: 'i-heroicons-clipboard-check', color: 'green' })
})
const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)
const isGameStarted = ref(false)
const showScore = ref(false)

currentQuestion.value = game.value.quiz.questions[currentQuestionIndex.value].question
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
        send(JSON.stringify({ type: 'answer', room: gameId, player: user.value, answer: answer }))

        gameStore.addAnswser(answer, user.value)
    } catch (e) {
        console.log(e)
    }

    if (currentQuestionIndex.value % 2 === 0) {
        showScore.value = true
        await sleep(5000)
        showScore.value = false
    }
    nextQuestion()
}

const nextQuestion = () => {
    if (currentQuestionIndex.value === game.value.quiz.questions.length - 1) {
        const router = useRouter()
        router.push(`/quizzes/${quizId}/${gameId}/score`)
        return;
    }

    currentQuestionIndex.value = currentQuestionIndex.value + 1

    currentQuestion.value = game.value.quiz.questions[currentQuestionIndex.value].question
}

const startGame = async () => {
    send(JSON.stringify({ type: 'startgame', room: gameId }))
    isGameStarted.value = true
}

const shareGame = async () => {
    share({
        url: window.location.href,
        title: 'La guerre est déclarée',
        text: `Je te défie sur ${game.value.display}`,
    })
}

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Home">
            </UDashboardNavbar>
            <UDashboardPanelContent v-if="!isGameStarted" class="flex flex-col items-center justify-center gap-4">

                <p class="cursor-pointer text-xl" @click="copy(game.display)">Game code : {{ game.display }} <icon
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


            </UDashboardPanelContent>
            <UDashboardPanelContent v-else-if="!isGameOver">

                <u-card class="h-full flex flex-col" v-if="!showScore"
                    :ui="{ body: { base: 'h-full flex' }, padding: 'px-4 py-5 sm:p-6' }">
                    <template #header>
                        <p>Question : {{ currentQuestionIndex + 1 }} / {{ game.quiz.questions.length }}</p>

                    </template>
                    <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
                        @answer="getAnswer(currentQuestion, $event)"></game-question-item>

                </u-card>
                <u-card v-else class="h-full flex flex-col"
                    :ui="{ body: { base: 'h-full flex' }, padding: 'px-4 py-5 sm:p-6' }">
                    <template #header>
                        <p>Comment se déroule la partie a la question : {{ currentQuestionIndex + 1 }} ?</p>

                    </template>
                    <game-score-table />

                </u-card>

            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
