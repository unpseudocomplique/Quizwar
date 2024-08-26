<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const quizId = useRoute().params.quizId as string

const schemaCreateRoom = z.object({
    room: z.string().min(1).max(20),
})

type TSchemaCreateRoom = z.infer<typeof schemaCreateRoom>

const stateCreateRoom = ref({
    room: '',
    creating: false
})
async function onSubmitCreateRoom(event: FormSubmitEvent<TSchemaCreateRoom>) {
    stateCreateRoom.value.creating = true
    const responseCreation = await $fetch('/api/game/create', {
        method: 'POST',
        body: {
            ...stateCreateRoom.value,
            quizId
        }
    })
    const router = useRouter()
    await router.push(`/quizzes/${quizId}/${responseCreation.id}`)
    stateCreateRoom.value.creating = false
}

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Nouveau quiz">

            </UDashboardNavbar>

            <UDashboardPanelContent>
                <div class="flex flex-col items-center justify-center gap-16 h-full">

                    <u-card>
                        <template #header>

                            <h2 class="text-4xl">Create a new game</h2>
                        </template>

                        <u-form :schema="schemaCreateRoom" :state="stateCreateRoom" class="flex gap-2 items-end"
                            @submit="onSubmitCreateRoom">
                            <u-form-group label="Code du jeux" name="room">
                                <u-input v-model="stateCreateRoom.room" required />
                            </u-form-group>


                            <u-button type="submit" class="ml-auto" :loading="stateCreateRoom.creating">
                                Create game
                            </u-button>
                        </u-form>

                    </u-card>
                </div>
                <u-button :to="`/quizzes/${quizId}/leaderboard`" class="ml-auto" :loading="stateCreateRoom.creating">
                                Learderboard
                            </u-button>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
