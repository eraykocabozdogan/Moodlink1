// API Client for MoodLink application

/**
 * Base URL for API requests fetched from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Default request headers
 */
let headers: HeadersInit = {
  'Content-Type': 'application/json',
};

/**
 * Sets the authentication token for all subsequent API requests
 * @param token - JWT token to be included in the Authorization header
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };
  } else {
    // Remove Authorization header if token is null
    const { Authorization, ...rest } = headers as Record<string, string>;
    headers = rest;
  }
}

/**
 * Handles API responses, automatically parsing JSON and handling errors
 * @param response - Fetch Response object
 * @returns Parsed JSON response
 * @throws Error with status code and message if response is not ok
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get error message from response if possible
    try {
      const errorData = await response.json();
      throw new Error(`${response.status}: ${errorData.message || response.statusText}`);
    } catch (e) {
      // If can't parse error as JSON, throw generic error with status
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
  
  // Check if response is empty
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  }
  
  // Return empty object for no-content responses
  return {} as T;
}

/**
 * GET request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param params - Optional query parameters as an object
 * @returns Promise with parsed response data
 */
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  return handleResponse<T>(response);
}

/**
 * POST request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param data - Request body data to be JSON stringified
 * @returns Promise with parsed response data
 */
export async function post<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  return handleResponse<T>(response);
}

/**
 * PUT request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param data - Request body data to be JSON stringified
 * @returns Promise with parsed response data
 */
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  return handleResponse<T>(response);
}

/**
 * DELETE request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param data - Optional request body data
 * @returns Promise with parsed response data
 */
export async function del<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  return handleResponse<T>(response);
}

/**
 * Upload file method - handles multipart/form-data requests
 * @param endpoint - API endpoint to call (without base URL)
 * @param file - The file to upload
 * @param additionalData - Optional additional form data to include
 * @returns Promise with parsed response data (usually contains fileId)
 */
export async function uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();
  
  // Append the file to the form data
  formData.append('file', file);
  
  // Append any additional data if provided
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  // Create headers without Content-Type, browser will set it automatically with boundary
  const uploadHeaders: HeadersInit = {};
  
  // Copy all headers except Content-Type
  Object.entries(headers).forEach(([key, value]) => {
    if (key !== 'Content-Type') {
      uploadHeaders[key] = value;
    }
  });
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: uploadHeaders,
    body: formData,
  });
  
  return handleResponse<T>(response);
}

/**
 * API client object that contains all methods
 */
const apiClient = {
  get,
  post,
  put,
  delete: del,
  setAuthToken,
  uploadFile,
};

export default apiClient;