import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function mirvaiApiPlugin(): Plugin {
  return {
    name: 'mirvai-api-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');

        if (pathname === '/api/properties' && req.method === 'GET') {
          res.statusCode = 200;
          return res.end(JSON.stringify([]));
        }

        if (pathname === '/api/appointments') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ bookedTimes: ['11:00'] }));
          }
          if (req.method === 'POST') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ ok: true }));
          }
        }

        if (pathname === '/api/enquiries' && req.method === 'POST') {
          res.statusCode = 200;
          return res.end(JSON.stringify({ ok: true }));
        }

        if (pathname === '/api/chat') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ messages: [], conversation: null }));
          }
          if (req.method === 'POST') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ ok: true }));
          }
        }

        if (pathname === '/api/analytics') {
          res.statusCode = 200;
          return res.end(JSON.stringify({ ok: true }));
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mirvaiApiPlugin()],
    resolve: {
      alias: [
        { find: 'next/image', replacement: path.resolve(__dirname, 'src/shims/next-image.tsx') },
        { find: 'next/link', replacement: path.resolve(__dirname, 'src/shims/next-link.tsx') },
        { find: 'next/navigation', replacement: path.resolve(__dirname, 'src/shims/next-navigation.ts') },
        { find: 'next', replacement: path.resolve(__dirname, 'src/shims/next.ts') },
        { find: /^@\/components\/(.*)/, replacement: path.resolve(__dirname, 'website-source/components/$1') },
        { find: /^@\/lib\/(.*)/, replacement: path.resolve(__dirname, 'website-source/lib/$1') },
        { find: /^@\/app\/(.*)/, replacement: path.resolve(__dirname, 'website-source/app/$1') },
        { find: '@', replacement: path.resolve(__dirname, '.') },
      ],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
