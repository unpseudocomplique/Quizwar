<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const quizId = useRoute().params.quizId as string


const username = ref('')

const quiz = ref({
    display: '',
})

const showJoinRoom = ref(true)

const roomToJoin = ref('')

const createQuiz = async () => {
    const newQuiz = await $fetch('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify(quiz.value)
    })

}

const joinRoom = async () => {
    const router = useRouter()
    await router.push(`/quizzes/${quizId}/${roomToJoin.value}`)
}


const schemaJoinRoom = z.object({
    username: z.string().min(1).max(20),
    room: z.string().min(1).max(20)
})


type TSchemaJoinRoom = z.infer<typeof schemaJoinRoom>

const stateJoinRoom = ref({
    room: '',
    joining: false
})
async function onSubmitJoin(event: FormSubmitEvent<TSchemaJoinRoom>) {
    // Do something with data
    stateJoinRoom.value.joining = true
    console.log(event.data)

    stateJoinRoom.value.joining = false
}

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
                <div class="flex flex-col items-center justify-center gap-4 h-full">
                    <!-- 
                    <label>
                        <span class="text-gray-900 dark:text-white font-medium">Pseudo</span>
                        <u-input size="xl" v-model="username" required />
                    </label>

                    <h2 class="text-xl">Join a room</h2>

                    <u-input v-model="quiz.display" placeholder="Quiz name" required />

                    <h2 class="text-2xl">Créer un nouveau quiz</h2>

                    <form @submit.prevent="createQuiz">
                        <UInput v-model="quiz.display" placeholder="Quiz name" required />

                        <UButton type="submit" color="green" size="xl">Create</UButton>
                    </form> -->

                    <h2 class="text-4xl">Join an existing game</h2>

                    <u-form :schema="schemaJoinRoom" :state="stateJoinRoom" class="space-y-4" @submit="onSubmitJoin">
                        <u-form-group label="Code du jeux" name="room">
                            <u-input v-model="stateJoinRoom.room" required />
                        </u-form-group>

                        <u-button type="submit" class="ml-auto" :loading="stateJoinRoom.joining" disabled>
                            Join game
                        </u-button>
                    </u-form>

                    <h2 class="text-4xl">Create a new game</h2>

                    <u-form :schema="schemaCreateRoom" :state="stateCreateRoom" class="space-y-4"
                        @submit="onSubmitCreateRoom">
                        <u-form-group label="Code du jeux" name="room">
                            <u-input v-model="stateCreateRoom.room" required />
                        </u-form-group>


                        <u-button type="submit" class="ml-auto" :loading="stateCreateRoom.creating">
                            Create game
                        </u-button>
                    </u-form>

                </div>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
