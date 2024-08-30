<script setup lang="ts">

const gameStore = useGameStore();

const isUserReady = (username:string) => {
    console.log(gameStore.playersReadyList)
    const index = gameStore.playersReadyList.find(player => username === player)
    console.log('index found',index)
    return index == undefined ? false : true;
}

</script>

<template>
     <UDashboardPanelContent class="gap-3" >
        <h1 class="text-3xl self-center">Joueurs en attente</h1>
        <div class="flex p-4 w-full border border-gray-300 dark:border-gray-800 rounded-lg justify-between items-center " 
        v-for="player in gameStore.allOtherPlayers">
                <span class="flex gap-5 items-center w-full justify-between ">
                    <span class="w-full flex gap-5 items-center">
                    <u-avatar :src="player.player.picture" />
                    <p class="w-50%">{{ player.player.username }}</p>
                </span>
                    <Icon v-if="isUserReady(player.player.username)" name="flat-color-icons:ok" class="text-3xl"/>
                    <Icon v-else name="fluent-emoji-flat:cross-mark" class="text-3xl"/>
                </span>
        </div>

    </UDashboardPanelContent>
   
</template>