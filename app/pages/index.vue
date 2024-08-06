<script setup lang="ts">

const { data: quizzes } = await useFetch('/api/quiz')

const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)
const isGameStarted = ref(false)

const SeedDB = async () => {
  await useFetch('/api/seed', { method: 'POST' })
  alert('Seeded')
}

const quiz = ref({
  id: 'dadadadada',
  display: 'Test tes connaissances générales',
  questions: [
    {
      id: 'dadada',
      display: 'Quel est le nom de ce pont ?',
      picture: '/pont.webp',
      questionDuration: 2,
      answerDuration: 5,
      labels: [
        { labelId: '1', label: { id: '1', display: 'Pont' } },
      ],
      theme: 'Ponts du monde',
      answers: [
        {
          id: 'zfze',
          display: 'Golden bridge',
          selected: false,
          isCorrect: true
        },
        {
          id: 'zfzedad',
          display: 'Golden shower',
          selected: false,
          isCorrect: false
        },
        {
          id: 'zfzedaad',
          display: 'Golden crow',
          selected: false,
          isCorrect: false
        },
        {
          id: 'zfzedaaad',
          display: 'Golden boy',
          selected: false,
          isCorrect: false
        }
      ]
    },
    {
      id: 'daadadada',
      display: 'Pour les alcolos, quel est le nom de ce cocktail ?',
      picture: '/fib.webp',
      questionDuration: 2,
      answerDuration: 6,
      labels: [
        { labelId: '1', label: { id: '1', display: 'Cocktail' } },
      ],
      theme: 'Cocktails',
      answers: [
        {
          id: 'zadafzade',
          display: 'Gin Fizz',
          selected: false,
          isCorrect: true
        },
        {
          id: 'zfzeadaddadad',
          display: 'Americano',
          selected: false,
          isCorrect: false
        },
        {
          id: 'zfzedadadaaaad',
          display: 'Apple Fizz',
          selected: false,
          isCorrect: false
        },
        {
          id: 'aada',
          display: 'Mai Tai',
          selected: false,
          isCorrect: false
        }
      ]
    }
  ]
})


currentQuestion.value = quiz.value.questions[currentQuestionIndex.value]

const getAnswer = (question, answer) => {
  const questionIndex = quiz.value.questions.findIndex(item => item.id === question.id)
  if (questionIndex === -1) return;

  const answerIndex = !answer ? -1 : quiz.value.questions[questionIndex].answers.findIndex(item => item.id === answer.id)

  if (answerIndex > -1) quiz.value[questionIndex].answers[answerIndex].selected = true

  if (questionIndex === quiz.value.questions.length - 1) {
    currentQuestion.value = null
    isGameOver.value = true
    return;
  }

  currentQuestionIndex.value = questionIndex + 1

  currentQuestion.value = quiz.value.questions[currentQuestionIndex.value]
}

const userScore = computed(() => {
  const score = quiz.value.questions.reduce((acc, item) => {

    const isUserRight = item.answers.every(answer => answer.selected === answer.isCorrect)

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
        <u-button @click="SeedDB">
          Seed db
        </u-button>
        <h1 class="text-2xl">Are you ready ?</h1>
        <UButton @click="isGameStarted = true" color="green" size="xl">Start</UButton>
      </UDashboardPanelContent>
      <UDashboardPanelContent v-else-if="!isGameOver">
        <p>Question : {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</p>
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
