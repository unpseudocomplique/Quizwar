<script setup lang="ts">

// In prod: check if secure, then use wss://
const { status, data, send, open, close } = useWebSocket(`ws://${location.host}/api/quiz/1/websocket`)
const history = ref<string[]>([])

watch(data, (newValue) => {
  history.value.push(`server : ${newValue}`)
})

const SeedDB = async () => {
  await useFetch('/api/seed', { method: 'POST' })
  alert('Seeded')
}

const message = ref('');
const sendData = () => {
  history.value.push('client : ' + message.value)
  send(message.value);
  message.value = '';
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
  <form @submit.prevent="sendData">
    <input v-model="message"/>
    <button type="submit">Send</button>
  </form>
  <div>
    <p v-for="entry in history">{{ entry }}</p>
  </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
    
  </UDashboardPage>
  
</template>
