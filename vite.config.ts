import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The hosted preview proxies the app over HTTPS and does not expose
      // Vite's development WebSocket endpoint. Disable HMR so @vite/client
      // does not repeatedly report a socket that can never open.
      hmr: false,
      watch: null,
    },
  };
});
