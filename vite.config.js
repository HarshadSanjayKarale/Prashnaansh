import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Set the base path to relative
  build: {
    outDir: 'dist', // Ensure the output directory is set
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevent code splitting for simplicity
      },
    },
  },
});
