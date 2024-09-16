// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      API_LOCAL_URL: process.env.API_LOCAL_URL,
    },
  },
  app: {
    head: {
      title: 'Smart Card Reader - Mong Kut Wattana V.1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Smart Card Reader - Mong Kut Wattana V.1' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '~/assets/scss/global.scss'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    ['@nuxtjs/google-fonts', {
      families: {
        'Nunito': true,
        'Prompt': true,
        download: true,
        inject: true
      }
    }],
    '@sidebase/nuxt-auth',
    'nuxt-security'
    // 'nuxt-helm'
  ],
  security: {
    headers: {
      crossOriginResourcePolicy: 'cross-origin',
      // referrerPolicy: 'same-origin',
      contentSecurityPolicy: false,
      xFrameOptions: false,
    },
  },
  auth: {
    globalAppMiddleware: true,
    baseURL: process.env.API_BASE_URL,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        // signUp: { path: '/auth/register', method: 'post' },
        getSession: { path: '/profile', method: 'get' }
      },
      pages: {
        login: '/auth/login'
      },
      token: {
        signInResponseTokenPointer: '/accessToken'
      },
      sessionDataType: {}
    },
    enableSessionRefreshPeriodically: 5000,
    enableSessionRefreshOnWindowFocus: true,
    globalMiddlewareOptions: {
      allow404WithoutAuth: true, // Defines if the 404 page will be accessible while unauthenticated
      addDefaultCallbackUrl: '/', // Where authenticated user will be redirected to by default
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    // '/api/**': { proxy: { to: `${process.env.API_BASE_URL}/**` } },
    '/api_local/**': { proxy: { to: `${process.env.API_LOCAL_URL}/**` } }
  },
  // nitro: {
  //   devProxy: {
  //     '/api_local': {
  //       target: process.env.API_LOCAL_URL,
  //       pathRewrite: {'^/api_local/': ''},
  //       changeOrigin: true
  //     },
  //     '/api/': {
  //       target: process.env.API_BASE_URL,
  //       pathRewrite: {'^/api/': ''},
  //       changeOrigin: true
  //     }
  //   }
  // }
})