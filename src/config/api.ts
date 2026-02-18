/**
 * API endpoints configuration.
 * Override via .env: VITE_DOBROSCHYOT_URL=http://...
 */
export const API = {
  dobroschyot: import.meta.env.VITE_DOBROSCHYOT_URL || "http://194.87.134.161:8100",
};
