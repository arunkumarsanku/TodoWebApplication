import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    alias: {
      '@': '/src',  // Example alias, ensure this matches your setup
    },
  },
});
