<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'


const runtimeConfig = useRuntimeConfig()
const { status, data, send, open, close, } = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/websocket`)
const { loggedIn, user, session, fetch, clear } = useUserSession()


const players = ref([

])


const route = useRoute()
const quizId = route.params.quizId

const gameId = route.params.gameId as string
send(JSON.stringify({ type: 'join', room: gameId, }))

watch(() => data.value, (newValue) => {
    console.log('--------NEW DATA--------')
    const parsed = JSON.parse(newValue)
    console.log(parsed)
    if (parsed.type === 'startgame') {
        isGameStarted.value = true
    }

    if (parsed.type === "answer") {

    }

    if (parsed.type === "join") {

    }
}, { deep: true })


const { data: dataType } = useFetch(`/api/game/fakeId`, { immediate: false })

const { data: game } = await useFetch<typeof dataType.value>(`/api/game/${gameId}`)

const { text, copy, copied, isSupported } = useClipboard({ source: game.value.display })


onMounted(() => {
    const isDev = window.location.href.includes('localhost')
    if (isDev) game.value.quiz.questions = game.value.quiz.questions.slice(0, 2)
})

watch(text, () => {

    const toast = useToast()
    toast.add({ title: 'Copied game code', icon: 'i-heroicons-clipboard-check', color: 'green' })
})
const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)
const isGameStarted = ref(false)

currentQuestion.value = game.value.quiz.questions[currentQuestionIndex.value].question
const getAnswer = async (question, answers) => {
    const questionIndex = game.value.quiz.questions.findIndex(item => item.questionId === question.id)
    if (questionIndex === -1) return;

    // const answerIndex = answers.length === 0 ? -1 : game.value.quiz.questions[questionIndex].question.answers.findIndex(item => item.id === answers.find(answer => answer.selected).id)

    // if (answerIndex > -1) game.value.quiz.questions[questionIndex].question.answers[answerIndex].selected = true

    const answer = await $fetch('/api/player/answser', {
        method: 'POST',
        body: { questionId: question.id, gameId: gameId, answerIds: answers.map(answer => answer.id) }
    })

    send(JSON.stringify({ type: 'answer', room: gameId, player: user.value, answer: answer }))

    if (questionIndex === game.value.quiz.questions.length - 1) {
        const router = useRouter()
        router.push(`/quizzes/${quizId}/${gameId}/score`)
        return;
    }

    currentQuestionIndex.value = questionIndex + 1

    currentQuestion.value = game.value.quiz.questions[currentQuestionIndex.value].question
}

const startGame = async () => {
    send(JSON.stringify({ type: 'startgame', room: gameId }))
    isGameStarted.value = true
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
                <h1 class="text-2xl">Are you ready ?</h1>
                <UButton @click="startGame" color="green" size="xl">Start</UButton>

            </UDashboardPanelContent>
            <UDashboardPanelContent v-else-if="!isGameOver">
                <p>Question : {{ currentQuestionIndex + 1 }} / {{ game.quiz.questions.length }}</p>
                <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
                    @answer="getAnswer(currentQuestion, $event)"></game-question-item>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
