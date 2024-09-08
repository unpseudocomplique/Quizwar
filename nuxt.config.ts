// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  css: ['@/assets/animation.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@formkit/auto-animate/nuxt',
    "nuxt-auth-utils",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  nitro: {
    experimental:{
      websocket: true
    }
  },
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },

  colorMode: {
    disableTransition: true
  },

  routeRules: {
  },

  devtools: {
    enabled: true
  },

  typescript: {
    strict: false
  },

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  imports: {
    dirs: [      // ... or scan all modules within given directory
      'types/**'
    ]
  },

  runtimeConfig: {
    bucketEndpoint: undefined,
    minioUser: undefined,
    minioPassword: undefined,
    public: {
      domain: 'localhost:3000',
      websocket: 'ws://localhost:3000',
      openreplayProjectKey: ''
    }
  },
  compatibilityDate: '2024-07-11',
  
})
