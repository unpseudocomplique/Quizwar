<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')
const { loggedIn, user, session, fetch, clear } = useUserSession()
const route = useRoute()
if (route.path !== '/auth/login' && !user.value) {
  await fetch()
  const router = useRouter()
  const redirect = useCookie('redirect')
  redirect.value = route.path
  await router.push(`/auth/login`)
}

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

const title = 'Quizwar'
const description = 'Défie tes amis et tes proches avec ce jeu de quiz en ligne rempli de rebondissements.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/logo.webp',
  twitterImage: '/logo.webp'
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
