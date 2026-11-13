import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function spaRoutesPlugin(): Plugin {
  return {
    name: 'mirvai-spa-route-copies',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexFile = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexFile)) return;
      const html = fs.readFileSync(indexFile, 'utf-8');
      for (const route of ['app', 'team', 'team-view', 'admin']) {
        const routeDir = path.join(distDir, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
      }
      fs.writeFileSync(path.join(distDir, '404.html'), html, 'utf-8');
    },
  };
}

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
          const curatedList = [
            {
              id: 2,
              reference: 'MIR-LEK-002',
              title: 'Contemporary 4-Bedroom Terrace Duplex',
              location: 'Lekki Phase 1, Admiralty Way Corridor, Lagos',
              type: 'Terrace duplex',
              category: 'terrace-duplex',
              price: 185000000,
              status: 'Available',
              description: 'Contemporary 4-bedroom terrace duplex designed with soaring double-height ceilings, fitted Italian marble kitchen, private rooftop terrace, and integrated maid quarters.',
              image_key: null,
              image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              featured: 1,
              verified: 1,
            },
            {
              id: 3,
              reference: 'MIR-IKY-003',
              title: 'Executive 5-Bedroom Diplomatic Villa',
              location: 'Old Ikoyi, Bourdillon Road Enclave, Lagos',
              type: 'Fully detached duplex',
              category: 'fully-detached-duplex',
              price: 580000000,
              status: 'Available',
              description: 'Architectural masterpiece in diplomatic quarter. Features Olympic-grade private pool, home cinema room, private elevator, and dual staff quarters.',
              image_key: null,
              image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
              featured: 1,
              verified: 1,
            },
            {
              id: 4,
              reference: 'MIR-CHV-004',
              title: 'Modern 4-Bedroom Semi-Detached Duplex',
              location: 'Chevron Tollgate Enclave, Lekki, Lagos',
              type: 'Semi-detached duplex',
              category: 'semi-detached-duplex',
              price: 145000000,
              status: 'Available',
              description: 'Immaculate semi-detached duplex in a family-oriented private estate. Fitted kitchen with Bosch appliances, stamp-concrete compound, perimeter CCTV.',
              image_key: null,
              image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
              featured: 0,
              verified: 1,
            },
            {
              id: 5,
              reference: 'MIR-EPE-005',
              title: 'Prime Waterfront Commercial & Residential Land',
              location: 'Epe Express Waterfront Corridor, Lagos',
              type: 'Land',
              category: 'land',
              price: 65000000,
              status: 'Available',
              description: '100% Dry table-land along expanding commercial corridor. Free from government acquisition with registered survey.',
              image_key: null,
              image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
              featured: 0,
              verified: 1,
            },
            {
              id: 6,
              reference: 'MIR-EKO-006',
              title: 'Atlantic Marina Luxury Oceanfront Condominium',
              location: 'Eko Atlantic City, Marina District, Lagos',
              type: 'Off-plan property',
              category: 'off-plan',
              price: 320000000,
              status: 'Available',
              description: 'Waterfront luxury condominium offering panoramic Atlantic views. Tier-1 construction backed by escrow disbursement milestones.',
              image_key: null,
              image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
              featured: 0,
              verified: 1,
            },
          ];
          res.statusCode = 200;
          return res.end(JSON.stringify(curatedList));
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
    plugins: [react(), tailwindcss(), mirvaiApiPlugin(), spaRoutesPlugin()],
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
