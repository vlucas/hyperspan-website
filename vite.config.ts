import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { hyperspan } from '@hyperspan/vite-plugin';

export default defineConfig({
  plugins: [tailwindcss(), ...hyperspan()],
  server: {
    host: process.env.HOSTNAME ?? '0.0.0.0',
    port: Number(process.env.PORT) || 3005,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
