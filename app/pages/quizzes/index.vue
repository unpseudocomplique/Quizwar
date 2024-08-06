<script setup lang="ts">

const { data: quizzes } = await useFetch('/api/quizzes')



</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">

      </UDashboardNavbar>
      <UDashboardPanelContent class="flex flex-col items-center justify-center gap-4">
        <nuxt-link v-for="quiz in quizzes" :to="`/quizzes/${quiz.id}`" class="hover:underline">
          <h1 class="text-2xl">{{ quiz.display }}</h1>
        </nuxt-link>

      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>
