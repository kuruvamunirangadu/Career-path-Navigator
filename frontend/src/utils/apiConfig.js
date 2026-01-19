/**
 * API Base URL Configuration
 * Automatically selects the correct API endpoint based on environment
 */

export const getApiBase = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }

  // Development fallback
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000'
  }

  // Production fallback
  return 'https://career-navigator-backend-7el6.onrender.com'
}

export const API_BASE = getApiBase()

export default API_BASE
