import { useAuthStore } from '../store/authStore.js';

const BACKEND_API_URL = 'http://localhost:4000/api/v1';

async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Intercept 401 token expirations and log out
    if (response.status === 401) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    // Handles SVG/text response or standard JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('image/svg+xml')) {
      return response.text();
    }
    
    return response.json();
  } catch (error) {
    console.error('API client request failure:', error);
    throw error;
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
export { BACKEND_API_URL };
