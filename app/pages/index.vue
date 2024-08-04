<script setup lang="ts">

const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const isGameOver = ref(false)

const quizz = ref([
  {
    id: 'dadada',
    display: 'Quel est le nom de ce pont ?',
    picture: '/pont.webp',
    questionDuration: 3,
    answerDuration: 10,
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
    display: 'Quel est le nom de ce pont autre question ?',
    picture: '/pont.webp',
    questionDuration: 3,
    answerDuration: 10,
    answers: [
      {
        id: 'zadafze',
        display: 'Golden bridge',
        selected: false
      },
      {
        id: 'zfzeadaddad',
        display: 'Golden shower',
        selected: false
      },
      {
        id: 'zfzedadadaad',
        display: 'Golden crow',
        selected: false
      },
      {
        id: 'zfzadadedaaad',
        display: 'Golden boy',
        selected: false
      }
    ]
  }
])

currentQuestion.value = quizz.value[currentQuestionIndex.value]

const getAnswer = (question, answer) => {
  console.log(question, answer)
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


</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>

      <UDashboardPanelContent v-if="!isGameOver">
        <p>Question : {{ currentQuestionIndex + 1 }} / {{ quizz.length }}</p>
        <game-question-item v-if="currentQuestion" v-model="currentQuestion" :key="currentQuestion.id"
          @answer="getAnswer(currentQuestion, $event)"></game-question-item>
      </UDashboardPanelContent>
      <UDashboardPanelContent v-else>
        <p>Game Over</p>
        <p>Did you won ? >_> </p>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
