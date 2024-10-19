<script setup lang="ts">

const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const { loggedIn, user, session, fetch, clear } = useUserSession()

onMounted(() => {
  const isDev = window.location.href.includes('localhost')
  if (isDev) return

  const nuxtApp = useNuxtApp();
  if (user.value) {
    nuxtApp.$tracker.setUserID(user.value.email)
  }
})

const links = [
  {
    id: 'quizzes',
    label: 'Quizzes',
    icon: 'i-ph-clipboard-text-thin',
    to: '/quizzes'
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: 'i-ph-flask-duotone',
    to: '/'
  }
]

const logout = async () => {
  const router = useRouter()
  const route = useRoute()
  await clear()
  await router.push(`/auth/login?redirect=${route.path}`)
}

// const footerLinks = [{
//   label: 'Invite people',
//   icon: 'i-heroicons-plus',
//   to: '/settings/members'
// }, {
//   label: 'Help & Support',
//   icon: 'i-heroicons-question-mark-circle',
//   click: () => isHelpSlideoverOpen.value = true
// }]

// const groups = [{
//   key: 'links',
//   label: 'Go to',
//   commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
// }, {
//   key: 'code',
//   label: 'Code',
//   commands: [{
//     id: 'source',
//     label: 'View page source',
//     icon: 'i-simple-icons-github',
//     click: () => {
//       window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
//     }
//   }]
// }]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left v-if="loggedIn">
          <router-link to="/auth/setup" class="flex items-center gap-2">

            <u-avatar :src="user.picture" />
            <p class="line-clamp-1">{{ user.username }}</p>
          </router-link>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <!-- <UDashboardSidebarLinks :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="colors => defaultColors = colors" /> -->

        <div class="flex-1" />

        <!-- <UDashboardSidebarLinks :links="footerLinks" /> -->

        <UDivider class="sticky bottom-0" />
        <UColorModeSelect class="w-28" />
        <template #footer>
          <div class="flex flex-col gap-10">

            <nuxt-img src="/logo.webp" class="w-36 h-36" />
            <u-button @click="logout" v-if="user" variant="ghost">Logout</u-button>
          </div>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
    <HelpSlideover />

    <NotificationsSlideover />
  </UDashboardLayout>
</template>
