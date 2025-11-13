/**
 * API Configuration
 *
 * Prefer Vite env override (VITE_API_BASE_URL).
 * Otherwise auto-detect localhost to use the dev backend.
 */

// Production backend URL (Vercel)
const PRODUCTION_API_URL = 'https://herbar-backend-7p73b09f8-pashas-projects-8b099908.vercel.app';

// Development backend URL (Local)
const DEVELOPMENT_API_URL = 'http://localhost:3001';

// Allow override via Vite env: define VITE_API_BASE_URL in .env.local if needed
// Example: VITE_API_BASE_URL=http://localhost:3001
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: import.meta available in Vite
const ENV = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const ENV_API: string | undefined = ENV?.VITE_API_URL || ENV?.VITE_API_BASE_URL;

// Auto-detect if running on localhost (used only for logging now)
const runningOnLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Prefer: ENV override > PRODUCTION default.
// If you want to use local backend, set VITE_API_BASE_URL=http://localhost:3001
export const API_BASE_URL: string = ENV_API || PRODUCTION_API_URL;

// PlantNet API konfiguracija (koristi se kroz backend proxy)
export const PLANTNET_CONFIG = {
  // Backend koristi svoj API ključ
  API_KEY: '2b10xzkW60RZnoaSPTwEUC8Se',
  PROJECT: 'all',
};

const mode = ENV_API ? `ENV OVERRIDE (${ENV?.VITE_API_URL ? 'VITE_API_URL' : 'VITE_API_BASE_URL'})` : 'PRODUCTION (default)';
// Helpful logs during development
console.log(`🌿 API Mode: ${mode}`);
console.log(`🔗 API URL: ${API_BASE_URL}`);