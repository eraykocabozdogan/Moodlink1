import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setAuthToken } from '@/lib/apiClient';

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio: string;
}

interface LoginRequest {
  email: string;
  password: string;
  authenticatorCode?: string;
}

interface UpdateUserRequest {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  newPassword: string;
  dateOfBirth: string;
  bio: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false);
      router.push('/login');
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to fetch user with token:', token ? `${token.substring(0, 10)}...` : 'missing');
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('Making request to:', '/api/Users/GetFromAuth');
      
      try {
        const response = await apiClient.get<User>('/api/Users/GetFromAuth');
        console.log('Successfully received user data:', JSON.stringify(response, null, 2));
        
        if (!response) {
          throw new Error('No user data received');
        }

        setUser(response);
        setLoading(false);
      } catch (apiError) {
        console.error('API request failed:', {
          error: apiError,
          message: apiError instanceof Error ? apiError.message : 'Unknown API error'
        });
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('User fetch failed with error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      console.log('Clearing auth state due to error');
      localStorage.removeItem('token');
      setAuthToken(null);
      setLoading(false);
      router.push('/login');
    }
  };

  const login = async (email: string, password: string, authenticatorCode: string = "") => {
    try {
      const loginData: LoginRequest = {
        email,
        password,
        authenticatorCode
      };

      console.log('Attempting login with:', {
        url: '/api/Auth/Login', // Büyük 'L' ile Login
        data: loginData
      });

      // Removed headers logging as headers is not accessible here

      const response = await apiClient.post<any>('/api/Auth/Login', loginData);

      console.log('Login response:', JSON.stringify(response, null, 2));
      
      // Token yapısını kontrol edelim
      let token = null;
      
      // Kompleks yapı kontrolü
      if (response?.accessToken?.token) {
        token = response.accessToken.token;
      } 
      // Basit yapı kontrolü
      else if (response?.accessToken || response?.token || response?.access_token) {
        token = response?.accessToken || response?.token || response?.access_token;
      }
      
      if (response && token) {
        console.log('Login successful, token received:', token.substring(0, 10) + '...');
        localStorage.setItem('token', token);
        setAuthToken(token);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('Token stored in localStorage:', storedToken ? 'yes' : 'no', 
                   storedToken ? `(${storedToken.substring(0, 10)}...)` : '');
        
        if (response.user) {
          console.log('User data received:', response.user);
          setUser(response.user);
        } else {
          console.warn('No user data in login response');
          // Eğer user data yoksa sadece login olup kullanıcı bilgilerini sonra çekeceğiz
        }
        
        router.push('/');
        return true;
      } else {
        console.error('Login response missing accessToken:', response);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
  };
} 