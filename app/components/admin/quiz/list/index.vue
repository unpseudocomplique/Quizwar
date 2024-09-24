<script setup lang="ts">
import { computed, ref } from 'vue'
const { data: quizzes } = await useFetch('/api/quizzes')

</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <ul class="grow max-h-[80dvh] overflow-auto">
            <li class="grow" v-for="quiz in quizzes">
                <router-link :to="`/admin/quizzes/${quiz.id}`">
                    <u-card>
                        <p>{{ quiz.display }}</p>
                    </u-card>
                </router-link>
            </li>
        </ul>
    </div>
</template>
