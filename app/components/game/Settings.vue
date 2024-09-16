<script setup lang="ts">
import { computed, ref } from 'vue'
import { ParameterGameMode } from '~/stores/game'
const game = defineModel()

const gameModes = Object.values(ParameterGameMode).map(mode => ({ label: parameterGameModeDisplay[mode], value: mode }))

</script>

<template>
    <UCard class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
            <h2>Settings</h2>
        </template>
        <div class="flex flex-col gap-4">
            <div class="flex gap-4 flex-wrap">
                <USelect v-model="game.modelType" :options="gameModes" />
                <u-button>
                    Ajouter le mode
                </u-button>
            </div>
        </div>
    </UCard>
</template>
