// API Client for MoodLink application

/**
 * Base URL for API requests fetched from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moodlinkbackend.onrender.com/api';

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
      'Accept': 'application/json',
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
  const responseData = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries())
  };

  console.log('API Response:', responseData);

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    let errorDetails = {};

    try {
      const text = await response.text();
      console.log('Raw error response:', text);

      try {
        const errorData = JSON.parse(text);
        errorDetails = errorData;
        errorMessage = errorData.message || errorData.title || errorData.error || errorMessage;
      } catch (parseError) {
        console.warn('Failed to parse error response as JSON:', parseError);
        errorDetails = { rawText: text };
      }
    } catch (textError) {
      console.error('Failed to read error response:', textError);
    }

    console.error('API Error:', {
      ...responseData,
      errorMessage,
      errorDetails
    });

    throw new Error(errorMessage);
  }

  try {
    const text = await response.text();
    console.log('Raw success response:', text);

    if (!text) {
      console.log('Empty response received');
      return {} as T;
    }

    try {
      const data = JSON.parse(text);
      console.log('Parsed response data:', data);
      return data as T;
    } catch (parseError) {
      console.error('Failed to parse success response as JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Failed to read success response:', error);
    throw error;
  }
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
  
  console.log('Making GET request:', {
    url,
    headers,
  });
  
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
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making POST request:', {
    url,
    headers,
    data
  });

  const response = await fetch(url, {
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
 * API client object that contains all methods
 */
const apiClient = {
  get,
  post,
  put,
  delete: del,
  setAuthToken,
};

export default apiClient;