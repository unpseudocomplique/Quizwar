<script setup lang="ts">

import { WebSocketMessage, actionTypeEnum } from '@/utils/websocket';

const runtimeConfig = useRuntimeConfig()

const { data: themes } = await useFetch('/api/theme')

// In prod: check if secure, then use wss://
const { status, data, send, open, close } = useWebSocket(`${runtimeConfig.public.websocket}/api/quiz/websocket`)
// const websocket = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/1/websocket`)
const history = ref<string[]>([])
const message = ref('')


watch(() => data.value, (newValue) => {
  console.log(newValue)
  history.value.push(`server : ${newValue}`)
})


const room = ref('');
const connectToRoom = async () => {
  try {
    const game = await $fetch(`/api/game/gameDisplay/${room.value}/checkGame`)

    const router = useRouter()
    await router.push(`/quizzes/${game.quizId}/${game.id}`)

  }catch(e) {
    const toast = useToast()
    toast.add({ title: 'Game not found', icon: 'i-heroicons-exclamation-circle', color: 'red' })
  }
}

const sendMessage = async () => {
  send(new WebSocketMessage(actionTypeEnum.MESSAGE, room.value, message.value).toString())
  message.value = ''
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col items-center justify-center gap-4">

        <div class="flex gap-4 flex-wrap">
          <u-card v-for="theme in themes" :key="theme.id">
            <p>{{ theme.display }}</p>
          </u-card>
        </div>





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
