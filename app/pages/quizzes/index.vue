<script setup lang="ts">

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { loggedIn, user, session, fetch, clear } = useUserSession()
// await fetch()
// if (!user.value) {
//   const router = useRouter()
//   const route = useRoute()
//   await router.push(`/auth/login?redirect=${route.path}`)
// }

// if (!loggedIn.value) {
//   const router = useRouter()
//   await router.push('/auth/login')
// }

const { data: quizzes } = await useFetch('/api/quizzes')

const schemaJoinRoom = z.object({
  room: z.string().min(1).max(20)
})


type TSchemaJoinRoom = z.infer<typeof schemaJoinRoom>

const stateJoinRoom = ref({
  room: '',
  joining: false
})
const onSubmitJoin = async (event: FormSubmitEvent<TSchemaJoinRoom>) => {
  // Do something with data
  stateJoinRoom.value.joining = true

  try {
    const game = await $fetch(`/api/game/gameDisplay/${event.data.room}/checkGame`)

    const router = useRouter()
    await router.push(`/quizzes/${game.quizId}/${game.id}`)

  }catch(e) {
    const toast = useToast()
    toast.add({ title: 'Game not found', icon: 'i-heroicons-exclamation-circle', color: 'red' })
  }
  stateJoinRoom.value.joining = false
}

const defaultImage = 'https://s3.quizwar.app/default/roy.webp'

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col gap-4">
        <u-card class="w-[400px] max-w-full">
          <template #header>

            <h2 class="text-2xl">Join an existing game</h2>
          </template>

          <u-form :schema="schemaJoinRoom" :state="stateJoinRoom" class="flex gap-2 items-end" @submit="onSubmitJoin">
            <u-form-group label="Code du jeux" name="room">
              <u-input v-model="stateJoinRoom.room" required />
            </u-form-group>

            <u-button type="submit" class="ml-auto" :loading="stateJoinRoom.joining">
              Join game
            </u-button>
          </u-form>
        </u-card>
        <div class="flex gap-4 flex-wrap">

          <u-card class="w-[500px] max-w-full" v-for="quiz in quizzes" :key="quiz.id">
            <template #header>
              <nuxt-img :src="quiz.picture || defaultImage" class="w-full rounded-xl" />
            </template>
            <h2 class="text-2xl font-bold mb-2">{{ quiz.display }}</h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ quiz.description }}
            </p>
            <div class="flex justify-end items-end h-full mt-auto">

              <nuxt-link class="text-end" :to="`/quizzes/${quiz.id}`">
                Create a game
              </nuxt-link>
            </div>
          </u-card>
        </div>

      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>
