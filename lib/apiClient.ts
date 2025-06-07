// API Client for MoodLink application

/**
 * Base URL for API requests fetched from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moodlinkbackend.onrender.com';

/**
 * Default request headers
 */
let headers: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Sets the authentication token for all subsequent API requests
 * @param token - JWT token to be included in the Authorization header
 */
export function setAuthToken(token: string | null): void {
  console.log('Setting auth token:', token ? token.substring(0, 10) + '...' : 'missing');
  
  if (token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };
    console.log('Updated headers with token');
  } else {
    // Remove Authorization header if token is null
    const { Authorization, ...rest } = headers as Record<string, string>;
    headers = rest;
    console.log('Removed token from headers');
  }
}

/**
 * Handle API response and parse JSON
 * @param response - Fetch Response object
 * @returns Promise with parsed response data
 */
async function handleResponse<T>(response: Response, requestInfo?: { method: string, url: string, data?: any }): Promise<T> {
  // Store metadata about the response
  const responseData = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries()),
  };
  
  console.log('API Response:', responseData);

<<<<<<< Updated upstream
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

    // Create a detailed error object
    const detailedError = {
      status: response.status,
      statusText: response.statusText,
      ...responseData,
      errorMessage,
      errorDetails,
      request: requestInfo || { url: response.url }
    };

    console.error('API Error:', detailedError);
    
    // Create an error object with the message and additional details
    const error = new Error(errorMessage);
    (error as any).details = detailedError;
    
    throw error;
  }

  try {
    const text = await response.text();
    console.log('Raw success response:', text.substring(0, 1000) + (text.length > 1000 ? '...(truncated)' : ''));

    if (!text) {
      console.log('Empty response received');
      return {} as T;
    }

    try {
      const data = JSON.parse(text);
      
      // For debugging
      if (response.url.includes('/api/Auth/Login')) {
        console.log('Login response structure:', 
          Object.keys(data).length > 0 
            ? `Keys: ${Object.keys(data).join(', ')}` 
            : 'Empty object');
        
        if (data.token) console.log('Found token with key "token"');
        if (data.accessToken) console.log('Found token with key "accessToken"');
        if (data.access_token) console.log('Found token with key "access_token"');
      }
      
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
    hasAuthHeader: typeof headers === 'object' && 'Authorization' in headers ? 'yes' : 'no'
  });
  
  // Log header info but not the full token
  console.log('Request headers present:', 
    Object.keys(typeof headers === 'object' ? headers : {}).join(', '));
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    return handleResponse<T>(response, { method: 'GET', url });
  } catch (error) {
    console.error(`Network error during GET request to ${url}:`, error);
    throw error;
  }
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
    hasAuthHeader: typeof headers === 'object' && 'Authorization' in headers ? 'yes' : 'no'
  });
  
  // Log header info but not the full token
  console.log('Request headers present:', 
    Object.keys(typeof headers === 'object' ? headers : {}).join(', '));
  console.log('Request body:', data ? JSON.stringify(data) : 'empty');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return handleResponse<T>(response, { method: 'POST', url, data });
  } catch (error) {
    console.error(`Network error during POST request to ${url}:`, error);
    throw error;
  }
}

/**
 * PUT request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param data - Request body data to be JSON stringified
 * @returns Promise with parsed response data
 */
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making PUT request:', {
    url,
    hasAuthHeader: typeof headers === 'object' && 'Authorization' in headers ? 'yes' : 'no'
  });
  
  // Log header info but not the full token
  console.log('Request headers present:', 
    Object.keys(typeof headers === 'object' ? headers : {}).join(', '));
  console.log('Request body:', data ? JSON.stringify(data) : 'empty');

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return handleResponse<T>(response, { method: 'PUT', url, data });
  } catch (error) {
    console.error(`Network error during PUT request to ${url}:`, error);
    throw error;
  }
}

/**
 * DELETE request method
 * @param endpoint - API endpoint to call (without base URL)
 * @param data - Optional request body data
 * @returns Promise with parsed response data
 */
export async function del<T>(endpoint: string, data?: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making DELETE request:', {
    url,
    hasAuthHeader: typeof headers === 'object' && 'Authorization' in headers ? 'yes' : 'no'
  });
  
  // Log header info but not the full token
  console.log('Request headers present:', 
    Object.keys(typeof headers === 'object' ? headers : {}).join(', '));
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return handleResponse<T>(response, { method: 'DELETE', url, data });
  } catch (error) {
    console.error(`Network error during DELETE request to ${url}:`, error);
    throw error;
  }
}

/**
 * Upload file using multipart/form-data
 * @param endpoint - API endpoint to call (without base URL)
 * @param file - File object to upload
 * @param formData - Additional form data to include
 * @returns Promise with parsed response data
 */
export async function uploadFile<T>(endpoint: string, file: File, formData: Record<string, any> = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making file upload request:', {
    url,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasAuthHeader: typeof headers === 'object' && 'Authorization' in headers ? 'yes' : 'no'
  });
  
  const form = new FormData();
  
  // Append the file
  form.append('File', file);
  
  // Append additional form data
  Object.entries(formData).forEach(([key, value]) => {
    form.append(key, value.toString());
  });
  
  // Create headers without Content-Type, browser will set it automatically with boundary
  const uploadHeaders = { ...headers } as Record<string, string>;
  if ('Content-Type' in uploadHeaders) {
    delete uploadHeaders['Content-Type'];
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: uploadHeaders,
      body: form,
    });
    
    return handleResponse<T>(response, { 
      method: 'POST', 
      url, 
      data: { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type,
        ...formData 
      } 
    });
  } catch (error) {
    console.error(`Network error during file upload to ${url}:`, error);
    throw error;
  }
}

/**
 * API client object that contains all methods
 */
const apiClient = {
  get,
  post,
  put,
  delete: del,
  uploadFile,
  setAuthToken,
};

export default apiClient;
=======
export default apiClient;
export { ApiClient };
>>>>>>> Stashed changes
