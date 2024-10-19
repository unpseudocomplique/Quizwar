<script setup lang="ts">
import { computed, ref } from 'vue'
const game = defineModel()

const gameStore = useGameStore()



</script>

<template>
    <div class="flex flex-col flex-4">
        <h2>Questions</h2>
        <div class="flex gap-y-4 gap-x-0.5 flex-wrap">
            <game-setup-questions-item v-for="(question, index) in game.quiz.questions" v-model:game="game"
                :index="index" :key="question.id" v-model="game.quiz.questions[index]" />
        </div>

        <table>
            <caption>
                Front-end web developer course 2021
            </caption>
            <thead>
                <tr>
                    <th scope="col">id</th>
                    <th scope="col">gameId</th>
                    <th scope="col">parameter</th>
                    <th scope="col">rangeStart</th>
                    <th scope="col">rangeEnd</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="parameter in gameStore.game.parameters" :key="parameter.id">
                    <th class="border border-gray-200 dark:border-gray-700">{{ parameter.id }}</th>
                    <td class="border border-gray-200 dark:border-gray-700">{{ parameter.gameId }}</td>
                    <td class="border border-gray-200 dark:border-gray-700">{{ parameter.parameter }}</td>
                    <td class="border border-gray-200 dark:border-gray-700">{{ parameter.rangeStart }}</td>
                    <td class="border border-gray-200 dark:border-gray-700">{{ parameter.rangeEnd }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
