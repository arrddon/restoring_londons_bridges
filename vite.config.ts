import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Local-only prototype: no cloud bindings, authentication or deployment plugin.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  optimizeDeps: { exclude: ['maplibre-gl'] },
  plugins: [vinext()],
});
