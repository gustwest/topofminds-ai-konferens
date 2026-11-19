import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function liveViewerBridge(): Plugin {
  const stateFile = path.resolve(import.meta.dirname, '.live-state.json');
  return {
    name: 'tom-live-viewer-bridge',
    configureServer(server) {
      server.middlewares.use('/__live_state', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const payload = {
                ...parsed,
                updatedAt: new Date().toISOString(),
              };
              fs.writeFileSync(stateFile, JSON.stringify(payload, null, 2), 'utf8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ ok: false }));
            }
          });
          return;
        }
        if (req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          const existing = fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8') : '{}';
          res.end(existing);
          return;
        }
        res.statusCode = 405;
        res.end();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), liveViewerBridge()],
  server: {
    port: 5174,
    strictPort: true,
    host: 'localhost',
  },
});
