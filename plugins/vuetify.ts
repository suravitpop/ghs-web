import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#F5F5F5",
    surface: "#FFFFFF",
    primary: "#13622A",
    secondary: "#E6E9FF",
    error: "#F44336",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107"
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    defaults: {
      global: {
        ripple: false,
        elevation: 0,
      },
      VSheet: {
        elevation: 0,
      },
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
