<script setup lang="ts">
const isLoadingQuiz = ref(false)
const quizTheme = ref('')

const items = [
    {
        slot: 'create',
        label: 'Create quiz'
    },
    {
        slot: 'quizzes',
        label: 'Quizzes'
    },
    {
        slot: 'seed',
        label: 'Seed db'
    },
]


const models = ['openAi', 'vertexAI']
const modelSelected = ref(models[0])


const seedDB = async () => {
    try {
        await useFetch('/api/seed', { method: 'POST' })
        alert('Seeded')
    } catch (e) {
        alert('alert error')
    }

}


const createQuiz = async () => {
    try {

        isLoadingQuiz.value = true
        const response = await $fetch('/api/quiz/create', {
            method: 'POST',
            query: { topic: quizTheme.value, modelType: modelSelected.value }
        })
        alert('Quiz created')
    } catch (e) {
        console.log(e)
        alert('error')
    }
    isLoadingQuiz.value = false
}

</script>

<template>
    <div class="p-4 grow">
        <UTabs :items="items" class="w-full">
            <template #quizzes="{ item }">
                <admin-quiz-list />
            </template>
            <template #seed="{ item }">

                <u-button @click="seedDB" size="xl">
                    Seed db
                </u-button>
            </template>
            <template #create="{ item }">
                <div class="flex gap-4 flex-wrap">

                    <USelect v-model="modelSelected" :options="models" />
                    <u-input v-model="quizTheme" placeholder="Topic" size="xl" />
                    <u-button @click="createQuiz" size="xl" :disabled="isLoadingQuiz">
                        Create quiz
                    </u-button>
                </div>
            </template>
        </UTabs>


    </div>
</template>
