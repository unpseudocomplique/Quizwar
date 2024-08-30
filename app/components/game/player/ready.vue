    <script setup lang="ts">

const gameStore = useGameStore();

const isUserReady = (username:string) => {
    return gameStore.playersReadyList.some(player => username === player)
}

</script>

<template>
    <UDashboardPanelContent class="gap-3">
        <h1 class="text-3xl self-center">Joueurs en attente</h1>
        <div class="flex p-4 w-full border border-gray-300 dark:border-gray-800 rounded-lg justify-between items-center "
            v-for="player in gameStore.allOtherPlayers">
            <span class="flex gap-5 items-center w-full justify-between ">
                <span class="w-full flex gap-5 items-center">
                    <u-avatar :src="player.player.picture" />
                    <p class="w-50%">{{ player.player.username }}</p>
                </span>
                <transition name="scale-in-center" mode="out-in">

                    <Icon v-if="isUserReady(player.player.username)" name="line-md:check-all"
                        class="text-3xl text-green-700" />
                    <Icon v-else name="line-md:loading-alt-loop" class="text-3xl text-orange-600" />
                </transition>
            </span>
        </div>

    </UDashboardPanelContent>

</template>