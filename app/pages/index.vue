<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()

// In prod: check if secure, then use wss://
const { status, data, send, open, close } = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/websocket`)
// const websocket = useWebSocket(`ws://${runtimeConfig.public.domain}/api/quiz/1/websocket`)
const history = ref<string[]>([])
const message = ref('')

// watch(() => websocket.value?.data, (newValue) => {
//   history.value.push(`server : ${newValue}`)
// })

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
  send(JSON.stringify({ type: 'join', room: room.value }))
}

const sendMessage = async () => {
  send(JSON.stringify({ type: 'message', message: message.value, room: room.value }))
  message.value = ''
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col items-center justify-center gap-4">
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
