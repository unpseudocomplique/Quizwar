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

const createLotOfQuiz = async () => {
    try {
        const allThemes = [
            "Histoire mondiale",
            "Géographie et capitales",
            "Culture générale",
            "Sciences et découvertes",
            "Cinéma et séries TV",
            "Musique et artistes célèbres",
            "Technologie et innovations",
            "Mathématiques et logique",
            "Littérature classique et contemporaine",
            "Sports et athlètes célèbres",
            "Nature et environnement",
            "Mythologie et légendes",
            "Cuisine et gastronomie",
            "Art et artistes célèbres",
            "Langues et expressions idiomatiques",
            "Culture pop des années 80 et 90",
            "Jeux vidéo et eSports",
            "Animaux et leur habitat",
            "Politique et gouvernance",
            "Événements et inventions marquants"
        ]
        isLoadingQuiz.value = true
        allThemes.forEach(theme => {
            $fetch('/api/quiz/create', {
                method: 'POST',
                query: { topic: theme, modelType: modelSelected.value }
            })
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
        <UTabs :items="items" class="w-full max-h-full">
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

                    <u-button class="ml-auto" @click="createLotOfQuiz" size="xl" :disabled="isLoadingQuiz">
                        Create lot of predefined quiz
                    </u-button>
                </div>
            </template>
        </UTabs>


    </div>
</template>
