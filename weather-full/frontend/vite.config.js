import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

async function findBackendPort() {
  for (let port = 5000; port < 5020; port++) {
    try {
      const res = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(300) });
      if (res.ok) return port;
    } catch (_) {}
  }
  return 5000;
}

export default defineConfig(async () => {
  const backendPort = await findBackendPort();
  console.log(`[vite] Proxying /api → http://localhost:${backendPort}`);
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': { target: `http://localhost:${backendPort}`, changeOrigin: true }
      }
    }
  };
});
