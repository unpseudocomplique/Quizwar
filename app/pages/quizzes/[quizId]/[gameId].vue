<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

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

    send(JSON.stringify({ type: 'answer', room: gameId, player: user.value, answer: answer.playerAnswer }))

    console.log('answer', answer)

    if (questionIndex === game.value.quiz.questions.length - 1) {
        currentQuestion.value = null
        isGameOver.value = true
        return;
    }

    currentQuestionIndex.value = questionIndex + 1

    currentQuestion.value = game.value.quiz.questions[currentQuestionIndex.value].question
}

const startGame = async () => {
    send(JSON.stringify({ type: 'startgame', room: gameId }))
    isGameStarted.value = true
}

const userScore = computed(() => {
    const score = game.value.quiz.questions.reduce((acc, item) => {

        const isUserRight = item.question.answers.every(answer => answer.selected === answer.isCorrect)

        if (isUserRight) acc.rightAnswers++
        else acc.wrongAnswers++
        return acc
    }, { rightAnswers: 0, wrongAnswers: 0 })
    return score
})

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Home">

            </UDashboardNavbar>
            <UDashboardPanelContent v-if="!isGameStarted" class="flex flex-col items-center justify-center gap-4">
                <h1 class="text-2xl">Are you ready ?</h1>
                <UButton @click="startGame" color="green" size="xl">Start</UButton>

            </UDashboardPanelContent>
            <UDashboardPanelContent v-else-if="!isGameOver">
                <p>Question : {{ currentQuestionIndex + 1 }} / {{ game.quiz.questions.length }}</p>
                <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
                    @answer="getAnswer(currentQuestion, $event)"></game-question-item>
            </UDashboardPanelContent>
            <UDashboardPanelContent v-else>
                <!-- <div class="flex flex-col items-center justify-center gap-4 h-full">

                    <p class="text-2xl">Game Over</p>
                    <p class="text-4xl font-bold uppercase">
                        You scored {{ userScore.rightAnswers }}
                        /
                        {{ game.quiz.questions.length }}
                    </p>
                </div> -->

                <game-score :game-id="gameId" />
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
