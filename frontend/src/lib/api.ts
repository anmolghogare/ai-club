/**
 * Centralized API endpoint helper utility.
 * Handles DEV vs PROD environments cleanly and supports custom VITE_API_URL configuration.
 */

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (import.meta.env.DEV) {
    const devHost = import.meta.env.VITE_DEV_API_URL || 'http://localhost:8000';
    return `${devHost}${normalizedPath}`;
  }

  const prodHost = import.meta.env.VITE_API_URL || '';
  return `${prodHost}${normalizedPath}`;
}
