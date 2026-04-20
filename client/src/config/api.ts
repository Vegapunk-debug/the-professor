/**
 * Central API configuration for The Professor.
 * Used to switch between local development and production environments.
 */

// In Next.js, variables prefixed with NEXT_PUBLIC_ are available in the browser.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Exporting individual endpoints for convenience
export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE}/upload`,
  CHAT: `${API_BASE}/chat`,
  QUIZ: `${API_BASE}/quiz`,
  FLASHCARDS: `${API_BASE}/flashcards`,
  VISUALIZE: `${API_BASE}/visualize`,
  DOCUMENTS: `${API_BASE}/documents`,
  AUTH: `${API_BASE}/auth`,
  HISTORY: `${API_BASE}/history`,
};
