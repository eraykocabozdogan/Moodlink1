"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import apiClient, { setAuthToken } from "@/lib/apiClient"

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  }
}

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
}

export function LoginScreen({ onLogin, onSwitchToSignup, onForgotPassword }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
<<<<<<< Updated upstream
      const response = await apiClient.post<LoginResponse>('/api/Auth/Login', {
        email: username, // Using username as email
        password
      });
      
      // Store token for subsequent requests
      setAuthToken(response.token);
      
      // Call the onLogin callback with user data
      onLogin(response.user);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to login. Please check your credentials and try again."
      );
=======
      const loginData: UserForLoginDto = {
        email: username,
        password: password
      }

      console.log('Sending login request to API...');
      const response = await apiClient.login(loginData);
      console.log('!!! BACKEND LOGIN YANITI:', JSON.stringify(response, null, 2));


      // Set auth token in apiClient
      const token = response.accessToken?.token;
      if (token) {
        console.log('Token found in response, setting auth token...');
        apiClient.setAuthToken(token);

        console.log('Login anında apiClient\'daki token:', apiClient.getAuthToken());

        // Save token to localStorage
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');

        // Call onLogin prop with simplified user data
        console.log('Calling onLogin with userData:', { username: username });
        onLogin({ username: username });
      } else {
        console.error('No token found in response:', response);
        alert('Giriş başarısız: Token alınamadı.');
      }
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        fullError: error
      });

      let errorMessage = 'Giriş yapılırken bir hata oluştu.';

      if (error.response?.status === 401) {
        errorMessage = 'Email veya şifre hatalı.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint bulunamadı.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      }

      alert(errorMessage);
>>>>>>> Stashed changes
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    onLogin({ username: "Google User", id: 1 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoodLink
            </h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Login to MoodLink</h2>
            <p className="text-sm text-white mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 border-gray-300 focus:border-white focus:ring-white text-white placeholder:text-gray-300 bg-transparent"
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-300 focus:border-white focus:ring-white text-white placeholder:text-gray-300 bg-transparent"
            disabled={isLoading}
          />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 hover:text-blue-600"
            disabled={isLoading}
          >
            Login with Google
          </Button>
          <div className="text-center text-sm text-white space-x-2">
            <button 
              onClick={onForgotPassword}
              className="hover:underline"
            >
              Forgot Password?
            </button>
            <span>|</span>
            <button onClick={onSwitchToSignup} className="hover:underline">
              Create New Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}