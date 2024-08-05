<script setup lang="ts">


const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)
const isGameStarted = ref(false)


const quizz = ref([
  {
    id: 'dadada',
    display: 'Quel est le nom de ce pont ?',
    picture: '/pont.webp',
    questionDuration: 2,
    answerDuration: 5,
    rightAnswers: ['zfze'],
    answers: [
      {
        id: 'zfze',
        display: 'Golden bridge',
        selected: false
      },
      {
        id: 'zfzedad',
        display: 'Golden shower',
        selected: false
      },
      {
        id: 'zfzedaad',
        display: 'Golden crow',
        selected: false
      },
      {
        id: 'zfzedaaad',
        display: 'Golden boy',
        selected: false
      }
    ]
  },
  {
    id: 'daadadada',
    display: 'Pour les alcolos, quel est le nom de ce cocktail ?',
    picture: '/fib.webp',
    questionDuration: 2,
    answerDuration: 6,
    rightAnswers: ['zadafzade'],
    answers: [
      {
        id: 'zadafzade',
        display: 'Gin Fizz',
        selected: false
      },
      {
        id: 'zfzeadaddadad',
        display: 'Americano',
        selected: false
      },
      {
        id: 'zfzedadadaaaad',
        display: 'Apple Fizz',
        selected: false
      },
      {
        id: 'aada',
        display: 'Mai Tai',
        selected: false
      }
    ]
  }
])


currentQuestion.value = quizz.value[currentQuestionIndex.value]

const getAnswer = (question, answer) => {
  const questionIndex = quizz.value.findIndex(item => item.id === question.id)
  if (questionIndex === -1) return;

  const answerIndex = !answer ? -1 : quizz.value[questionIndex].answers.findIndex(item => item.id === answer.id)

  if (answerIndex > -1) quizz.value[questionIndex].answers[answerIndex].selected = true

  if (questionIndex === quizz.value.length - 1) {
    currentQuestion.value = null
    isGameOver.value = true
    return;
  }

  currentQuestionIndex.value = questionIndex + 1

  currentQuestion.value = quizz.value[currentQuestionIndex.value]
}

const userScore = computed(() => {
  const score = quizz.value.reduce((acc, item) => {
    const userAnswers = item.answers.filter(answer => answer.selected).map(answer => answer.id)
    const isUserRight = item.rightAnswers.length === userAnswers.length && item.rightAnswers.every(answer => userAnswers.includes(answer))

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
      </UDashboardPanelContent>
      <UDashboardPanelContent v-else-if="!isGameOver">
        <p>Question : {{ currentQuestionIndex + 1 }} / {{ quizz.length }}</p>
        <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
          @answer="getAnswer(currentQuestion, $event)"></game-question-item>
      </UDashboardPanelContent>
      <UDashboardPanelContent v-else>
        <div class="flex flex-col items-center justify-center gap-4 h-full">

          <p class="text-2xl">Game Over</p>
          <p class="text-4xl font-bold uppercase">You scored {{ userScore.rightAnswers }} / {{ quizz.length }}</p>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
