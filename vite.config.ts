import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Escludiamo jspdf e jspdf-autotable dal bundle.
      // Verranno risolti a runtime tramite la importmap in index.html
      external: ['jspdf', 'jspdf-autotable'],
    },
  },
});