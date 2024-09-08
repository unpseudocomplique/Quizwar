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

const defaultImage = 'https://s3.quizwar.app/default/roy.webp'

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Choose a theme">

      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="flex gap-4 flex-wrap">
          <u-card v-for="theme in themes" :key="theme.id" ui="{ body: { base: 'flex flex-col gap-4' } }"
            class="w-[400px] max-w-[700px] grow">
            <nuxt-img :src="theme.picture || defaultImage" class="w-full rounded-xl" />
            <h2 class="text-xl">{{ theme.display }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ theme._count.quizzes }} quizzes</p>
          </u-card>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

  </UDashboardPage>

</template>
