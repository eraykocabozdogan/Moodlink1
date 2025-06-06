"use client"

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { MainApp } from '@/components/main-app';

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Oturum açmanız gerekiyor.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <MainApp user={user} onLogout={logout} />
    </main>
  );
}
