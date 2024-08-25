<script setup lang="ts">
const emits = defineEmits(['selected', 'close'])
defineProps<{
    players: {
        player: {
            id: string,
            username: string
        }
    }[]
}>()

</script>

<template>
    <div class="flex flex-col h-full items-center justify-center gap-5">
        <u-button @click="emits('close')" color="orange" class="scale-in-center">
            Annuler
        </u-button>
        <div v-for="player in players" :key="player.player.id" @click="$emit('selected', player.player)"
            class="cursor-pointer p-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-gray-200 dark:bg-gray-800">
            {{ player.player.username }}
        </div>
    </div>
</template>
