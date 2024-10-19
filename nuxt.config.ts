// https://nuxt.com/docs/api/configuration/nuxt-config

import {nodePolyfills} from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  vite: {
    plugins: [
      nodePolyfills({
        protocolImports: true, // This will handle imports like "node:buffer"
      }),
    ],
    optimizeDeps: {
      include: ['buffer'], // Make sure buffer is included
    },
  },
  css: ['@/assets/css/tailwind.css'],
})