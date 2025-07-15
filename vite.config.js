import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    historyApiFallback: true, 
   },
})

//748023442531-0foobb1veeh83cgmdd1g7s0gjh9mq7db.apps.googleusercontent.com
//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