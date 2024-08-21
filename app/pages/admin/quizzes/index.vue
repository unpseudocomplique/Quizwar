<script setup lang="ts">
import { computed, ref } from 'vue'

const { data: quizzes } = await useFetch('/api/quizzes')

</script>

<template>
    <div class="p-4">
        <h1>Quizzes</h1>
        <ul>
            <li v-for="quiz in quizzes"><router-link :to="`/admin/quizzes/${quiz.id}`">{{ quiz.display }}</router-link>
            </li>
        </ul>
    </div>
</template>
