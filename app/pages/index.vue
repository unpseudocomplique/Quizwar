<script setup lang="ts">

import { WebSocketMessage, actionTypeEnum } from '@/utils/websocket';

const runtimeConfig = useRuntimeConfig()

// In prod: check if secure, then use wss://
const { status, data, send, open, close } = useWebSocket(`${runtimeConfig.public.websocket}/api/quiz/websocket`)
// const websocket = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/1/websocket`)
const history = ref<string[]>([])
const message = ref('')
const isLoadingQuiz = ref(false)
const quizTheme = ref('')

watch(() => data.value, (newValue) => {
  console.log(newValue)
  history.value.push(`server : ${newValue}`)
})

const SeedDB = async () => {
  try {
    await useFetch('/api/seed', { method: 'POST' })
    alert('Seeded')
  } catch (e) {
    alert('alert error')
  }

}

const room = ref('');
const connectToRoom = async () => {
  send(new WebSocketMessage(actionTypeEnum.JOIN, room.value, '').toString())
}

const sendMessage = async () => {
  send(new WebSocketMessage(actionTypeEnum.MESSAGE, room.value, message.value).toString())
  message.value = ''
}

const createQuiz = async () => {
  isLoadingQuiz.value = true
  const response = await $fetch('/api/quiz/create', {
    method: 'POST',
    query: { topic: quizTheme.value }
  })
  isLoadingQuiz.value = false
  alert('Quiz created')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col items-center justify-center gap-4">
        <div class="flex gap-4 flex-wrap">

          <u-input v-model="quizTheme" placeholder="Topic" size="xl" />
          <u-button @click="createQuiz" size="xl" :disabled="isLoadingQuiz">
            Create quiz
          </u-button>
        </div>

        <u-button @click="SeedDB" size="xl">
          Seed db
        </u-button>
        <u-button to="/quizzes" size="xl">
          Select a quiz
        </u-button>
        <h1>websocket</h1>

        <pre>
          {{ data }}
        </pre>
        <pre>
          {{ status }}
        </pre>

        <form @submit.prevent="connectToRoom">
          <input v-model="room" />
          <button type="submit">Join room</button>
        </form>

        <form @submit.prevent="sendMessage">
          <input v-model="message" />
          <button type="submit">Send message</button>
        </form>


        <div>
          <p v-for="entry in history">{{ entry }}</p>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

  </UDashboardPage>

</template>
