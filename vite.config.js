import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Splitting heavy libraries into separate chunks for SEO and speed optimization
        manualChunks: {
          monaco: ['@monaco-editor/react'],
          recharts: ['recharts'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
