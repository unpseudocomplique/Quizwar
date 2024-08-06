<script setup lang="ts">
import { computed, ref } from 'vue'


const quizId = useRoute().params.quizId as string
console.log(quizId)
const { data: quiz } = await useFetch(`/api/quizzes/${quizId}`)


const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)
const isGameStarted = ref(false)

currentQuestion.value = quiz.value.questions[currentQuestionIndex.value].question

const getAnswer = (question, answer) => {
    const questionIndex = quiz.value.questions.findIndex(item => item.questionId === question.id)
    if (questionIndex === -1) return;

    const answerIndex = !answer ? -1 : quiz.value.questions[questionIndex].question.answers.findIndex(item => item.id === answer.id)

    if (answerIndex > -1) quiz.value.questions[questionIndex].question.answers[answerIndex].selected = true

    if (questionIndex === quiz.value.questions.length - 1) {
        currentQuestion.value = null
        isGameOver.value = true
        return;
    }

    currentQuestionIndex.value = questionIndex + 1

    currentQuestion.value = quiz.value.questions[currentQuestionIndex.value].question
}

const userScore = computed(() => {
    const score = quiz.value.questions.reduce((acc, item) => {

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
                <UButton @click="isGameStarted = true" color="green" size="xl">Start</UButton>

                <!-- <pre>{{ quiz }}</pre> -->

            </UDashboardPanelContent>
            <UDashboardPanelContent v-else-if="!isGameOver">
                <p>Question : {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</p>
                <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
                    @answer="getAnswer(currentQuestion, $event)"></game-question-item>
            </UDashboardPanelContent>
            <UDashboardPanelContent v-else>
                <div class="flex flex-col items-center justify-center gap-4 h-full">

                    <p class="text-2xl">Game Over</p>
                    <p class="text-4xl font-bold uppercase">
                        You scored {{ userScore.rightAnswers }}
                        /
                        {{ quiz.questions.length }}
                    </p>
                </div>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
