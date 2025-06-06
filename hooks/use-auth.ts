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
      console.log('Attempting to fetch user with:', {
        token: token ? 'present' : 'missing',
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://moodlinkbackend.onrender.com'
      });

      const response = await apiClient.get<User>('/Users/me');
      console.log('Successfully received user data:', response);
      
      if (!response) {
        throw new Error('No user data received');
      }

      setUser(response);
      setLoading(false);
    } catch (error) {
      console.error('User fetch failed with error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      localStorage.removeItem('token');
      setAuthToken(null);
      setLoading(false);
      router.push('/login');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = {
        email,
        password,
      };

      console.log('Attempting login with:', {
        url: '/Auth/login',
        data: loginData
      });

      const response = await apiClient.post<{ accessToken: string; user: User }>('/Auth/login', loginData);

      console.log('Login response:', response);
      
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        setAuthToken(response.accessToken);
        if (response.user) {
          setUser(response.user);
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