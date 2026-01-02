
import { defineConfig } from 'vite';

export default defineConfig({
  // Замените 'velocity-reader' на имя вашего репозитория при деплое на GH Pages
  base: './', 
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
