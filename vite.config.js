import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      'react-router-dom': fileURLToPath(new URL('./src/router/reactRouterDomCompat.jsx', import.meta.url)),
    },
  },
  plugins: [
    react(),
    {
      name: 'error-logger',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__log_error') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              console.error('\n=== BROWSER ERROR DETECTED ===\n', body, '\n==============================\n');
              res.end('ok');
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});

