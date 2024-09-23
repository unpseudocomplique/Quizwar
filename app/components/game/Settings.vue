<script setup lang="ts">
import { computed, ref } from 'vue'
import { ParameterGameMode } from '~/stores/game'
const game = defineModel()


const addFastPass = () => {

}

</script>

<template>
    <!-- <UCard class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
            <h2>Settings</h2>
        </template>
        <div class="flex flex-col gap-4">
            <p>Ajouter un mode de jeu</p>
            <u-card>
                <template #header>
                    <UBlogPost title="x5" description="Les questions rapportent 5x plus de points"
                        class="cursor-pointer" />
                </template>
            </u-card>
            <u-card>
                <template #header>
                    <UBlogPost title="Fastpass"
                        description="3 points pour le premier, 1 pour le deuxième, 1 pour le 3ème et -1 pour les suivants."
                        class="cursor-pointer" />
                </template>
            </u-card>
        </div>
    </UCard> -->
    <div class="flex flex-col flex-4">
        <h2>Questions</h2>
        <div class="flex gap-4 flex-wrap">
            <div v-for="question in game.quiz.questions" class="w-32 rounded-lg h-6 bg-gray-200 dark:bg-gray-700"></div>
        </div>
    </div>
</template>
