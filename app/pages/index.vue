<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

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
  }
])

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>

      <UDashboardPanelContent>
        <game-question-item v-for="(item, index) in quizz" v-model="quizz[index]"></game-question-item>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
