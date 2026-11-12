import { defineConfig } from 'vite'

export default defineConfig({

  preview: {
    allowedHosts: [
      'luxxbeebeauty.com',
      'www.luxxbeebeauty.com' // Recomendado incluir também com www
    ]
  }
})
