import i18n from "../../i18n";


// Base configuration for all API (Spring Boot) requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';


// Custom error class for API errors
export class ApiError extends Error {
  constructor({ status, error, message, details, timestamp }) {
    super(message || error || 'API Error');
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.details = details;
    this.timestamp = timestamp;
  }
}

// Helper to build query strings from an object
export function buildQueryString(params) {
  if (!params) return '';
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => esc(k) + '=' + esc(v))
      .join('&')
  );
}

// Centralized response management
async function handleResponse(response, requestMethod) {
  
  if (response.status === 204) return null;
  
  const text = await response.text();
  if (!response.ok) {
    let errorData;
    try {
      errorData = text ? JSON.parse(text) : {};
    } 
    catch {
      errorData = { message: text || response.statusText };
    }

    let finalMessage = errorData.message || errorData.error || response.statusText;

    if (response.status === 403) {
      finalMessage = i18n.t('common:error.accessDenied.description');
    } 
    else if (response.status === 409 && requestMethod === 'DELETE') {
      finalMessage = i18n.t('common:error.resourceInUse');
    }

    throw new ApiError({
      status: response.status,
      error: errorData.error || response.statusText,
      message: finalMessage,
      details: errorData.details,
      timestamp: errorData.timestamp,
    });
  }
  
  if (!text) return null;
  try {
    return JSON.parse(text);
  } 
  catch {
    return text;
  }
}


// --------------------------------------------------------
// Base API client with fetch
export const apiClient = {
    
  get: async (endpoint, params) => {
    const url = API_BASE_URL + endpoint + (params ? buildQueryString(params) : '');
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response, 'GET');
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response, 'POST');
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response, 'PUT');
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response, 'PATCH');
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response, 'DELETE');
  },
};
