/**
 * API Base URL Configuration
 * Intelligently detects the correct API endpoint based on environment
 * 
 * Rules:
 * 1. Use VITE_API_BASE env var if available (Vercel production)
 * 2. If on localhost/127.0.0.1 domain: use local backend (development)
 * 3. Otherwise: use production backend (mobile/other domains)
 */

export const getApiBase = () => {
  // Production URL (Render backend)
  const productionUrl = 'https://career-navigator-backend-7el6.onrender.com'

  // 1) Hosted override (Vercel/Render env)
  if (import.meta.env.VITE_API_BASE) {
    console.log('API: Using VITE_API_BASE env var:', import.meta.env.VITE_API_BASE)
    return import.meta.env.VITE_API_BASE
  }

  // 2) Production fallback (Render)
  console.log('API: Using production backend:', productionUrl)
  return productionUrl
}

export const API_BASE = getApiBase()

export default API_BASE
