<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { loggedIn, user, session, fetch, clear } = useUserSession()
const schemaCreatePlayer = z.object({
    username: z.string().min(1).max(20),
})

type TSchemaCreatePlayer = z.infer<typeof schemaCreatePlayer>

const stateCreatePlayer = ref({
    username: '',
    creating: false
})

const isUserNameChoosed = ref(false)
const route = useRoute()

const createPLayer = async (event: FormSubmitEvent<TSchemaCreatePlayer>) => {

    const response = await $fetch('/api/player/create', {
        method: 'POST',
        body: stateCreatePlayer.value
    })

    const router = useRouter()

    const url = useCookie('redirect')

    if (url.value) {
        await fetch()
        await router.replace(url.value)

    } else {

        await router.push(`/quizzes`)
    }


}

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Creation du profil du joeur">

            </UDashboardNavbar>

            <UDashboardPanelContent>
                <div class="flex flex-col items-center justify-center gap-4 h-full">
                    <u-button :to="{ path: '/api/auth/google' }" icon="i-logos-google-icon" label="Login with GitHub"
                        color="black" external>Login with
                        Google</u-button>
                    <!-- <u-card class="w-[600px] max-w-full">
                        <UForm :schema="schemaCreatePlayer" :state="stateCreatePlayer" class="space-y-4"
                            @submit="createPLayer">
                            <UFormGroup label="Votre username" name="username">
                                <UInput v-model="stateCreatePlayer.username" required />
                            </UFormGroup>


                            <UButton type="submit" class="ml-auto" :loading="stateCreatePlayer.creating">
                                Création de mon profil joueur
                            </UButton>
                        </UForm>
                    </u-card> -->
                </div>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
