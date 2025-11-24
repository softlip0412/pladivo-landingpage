/**
 * API Fetch Wrapper with Auto-Refresh Token
 * Automatically refreshes expired access tokens and retries failed requests
 */

let isRefreshing = false;
let refreshPromise = null;

/**
 * Custom fetch wrapper that handles token refresh automatically
 * @param {string} url - API endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function apiFetch(url, options = {}) {
  // Always include credentials for cookie-based auth
  const fetchOptions = {
    ...options,
    credentials: 'include',
  };

  // Make the initial request
  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized, check if it's due to expired token
  if (response.status === 401) {
    try {
      const data = await response.clone().json();
      
      // Check if error is related to token expiration
      const isTokenExpired = 
        data.error?.includes('TokenExpiredError') ||
        data.error?.includes('jwt expired') ||
        data.error?.includes('Token expired');

      if (isTokenExpired) {
        // Prevent multiple simultaneous refresh calls
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
        }

        // Wait for refresh to complete
        const refreshRes = await refreshPromise;
        
        // Reset refresh state
        isRefreshing = false;
        refreshPromise = null;

        if (refreshRes.ok) {
          // Token refreshed successfully, retry original request
          console.log('✅ Token refreshed, retrying request...');
          response = await fetch(url, fetchOptions);
        } else {
          // Refresh failed, redirect to login
          console.error('❌ Refresh token expired, redirecting to login...');
          window.location.href = '/login';
          throw new Error('Session expired, please login again');
        }
      }
    } catch (error) {
      // If we can't parse JSON or other error, just return original response
      if (error.message !== 'Session expired, please login again') {
        console.error('Error handling 401:', error);
      } else {
        throw error;
      }
    }
  }

  return response;
}

/**
 * Convenience wrapper for JSON API calls
 * @param {string} url - API endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiFetchJSON(url, options = {}) {
  const response = await apiFetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'API request failed');
  }
  
  return response.json();
}
