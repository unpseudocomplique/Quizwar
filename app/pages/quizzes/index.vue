<script setup lang="ts">

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { loggedIn, user, session, fetch, clear } = useUserSession()
await fetch()
if (!user.value) {
  const router = useRouter()
  await router.push('/auth/login')
}

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

  console.log('event', event.data.room)
  try {
    const response = await $fetch(`/api/game/join/${event.data.room}`, {
      method: 'PATCH',
      body: stateJoinRoom.value
    })

    console.log(response)

    if (response.gameId) {
      const { gameId, quizId } = response
      const router = useRouter()
      await router.push(`/quizzes/${quizId}/${gameId}`)
    }

  } catch (e) {
    alert('alert error')
  }
  stateJoinRoom.value.joining = false
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col items-center justify-center gap-4">
        <u-card>
          <template #header>

            <h2 class="text-4xl">Join an existing game</h2>
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

        <nuxt-link v-for="quiz in quizzes" :to="`/quizzes/${quiz.id}`" class="hover:underline text-2xl">
          {{ quiz.display }}
        </nuxt-link>

      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>
