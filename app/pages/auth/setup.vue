<script setup lang="ts">
import { computed, ref } from 'vue'

const { loggedIn, user, session, fetch, clear } = useUserSession()

const stateCreatePlayer = ref({
    updating: false
})

const updatePlayer = async () => {

    stateCreatePlayer.value.updating = true
    console.log(user.value.username)
    const response = await $fetch('/api/player/update', {
        method: 'patch',
        body: {
            username: user.value.username
        }
    })


    stateCreatePlayer.value.updating = false
}

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Mise à jour du profil du joueur">

            </UDashboardNavbar>

            <UDashboardPanelContent>
                <div class="flex flex-col items-center justify-center gap-4 h-full">
                    <u-card class="w-[600px] max-w-full" :ui="{ body: { base: 'flex flex-col gap-4' } }">
                        <UFormGroup label="Votre username" name="username">
                            <UInput v-model="user.username" maxlength="20" />
                        </UFormGroup>


                        <UButton @click="updatePlayer" class="ml-auto" :loading="stateCreatePlayer.updating">
                            Mettre à jour mon profil joueur
                        </UButton>
                    </u-card>
                </div>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
