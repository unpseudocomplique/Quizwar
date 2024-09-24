<script setup lang="ts">
import { computed, ref } from 'vue'
const game = defineModel()

</script>

<template>
    <div class="flex flex-col flex-4">
        <h2>Questions</h2>
        <div class="flex gap-y-4 gap-x-0.5 flex-wrap">
            <game-setup-questions-item v-for="(question, index) in game.quiz.questions" v-model:game="game"
                :index="index" :key="question.id" v-model="game.quiz.questions[index]" />
        </div>
    </div>
</template>
