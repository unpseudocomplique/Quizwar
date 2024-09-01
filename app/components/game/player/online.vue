<script setup lang="ts">
const gameStore = useGameStore();

</script>

<template>
    <div class="flex flex-col gap-2 absolute bottom-5 right-5">
        <p class="subtitle">Joueurs en ligne: </p>
        <UAvatarGroup class="self-end" size="sm" :max="10">
            <UAvatar v-for="player in gameStore.players" :key="player.id" :src="player.player.picture" />
        </UAvatarGroup>
    </div>
</template>
