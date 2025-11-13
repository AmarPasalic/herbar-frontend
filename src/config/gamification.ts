// Central config for gamification thresholds and settings
// Values can be overridden via environment variables:
// - VITE_LOW_CONFIDENCE_THRESHOLD (0-100)
// - VITE_RARE_CONFIDENCE_THRESHOLD (0-100)

const clampPercent = (val: number) => Math.min(100, Math.max(0, val));
const parsePercent = (val: unknown, fallback: number) => {
    const n = Number(val);
    return Number.isFinite(n) ? clampPercent(n) : fallback;
};

const DEFAULT_LOW = 50; // % below which we warn the user
const DEFAULT_RARE = 90; // % at/above which we mark as rare

// Read from Vite env (if provided) with safe parsing and clamping
const LOW_FROM_ENV = parsePercent((import.meta as any).env?.VITE_LOW_CONFIDENCE_THRESHOLD, DEFAULT_LOW);
const RARE_FROM_ENV = parsePercent((import.meta as any).env?.VITE_RARE_CONFIDENCE_THRESHOLD, DEFAULT_RARE);

export const LOW_CONFIDENCE_THRESHOLD = LOW_FROM_ENV;
// Ensure rare is never below low; if so, align to low to avoid inconsistent UX
export const RARE_CONFIDENCE_THRESHOLD = Math.max(RARE_FROM_ENV, LOW_CONFIDENCE_THRESHOLD);

// Offline confidence settings (used for graceful fallbacks when backend/PlantNet is unavailable)
const DEFAULT_OFFLINE_MIN = 70;
const DEFAULT_OFFLINE_MAX = 85;

const OFFLINE_MIN_FROM_ENV = parsePercent((import.meta as any).env?.VITE_OFFLINE_CONFIDENCE_MIN, DEFAULT_OFFLINE_MIN);
const OFFLINE_MAX_FROM_ENV = parsePercent((import.meta as any).env?.VITE_OFFLINE_CONFIDENCE_MAX, DEFAULT_OFFLINE_MAX);

// Ensure min <= max; if misconfigured, collapse to a single value at min
export const OFFLINE_CONFIDENCE_MIN = Math.min(OFFLINE_MIN_FROM_ENV, OFFLINE_MAX_FROM_ENV);
export const OFFLINE_CONFIDENCE_MAX = Math.max(OFFLINE_MIN_FROM_ENV, OFFLINE_MAX_FROM_ENV);

// Helper to generate a pseudo-random offline confidence within configured bounds
export function getOfflineConfidence(): number {
    const min = OFFLINE_CONFIDENCE_MIN;
    const max = OFFLINE_CONFIDENCE_MAX;
    if (min === max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min; // inclusive range
}
