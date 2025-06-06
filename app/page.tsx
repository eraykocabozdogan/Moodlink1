"use client"

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { MessagesPage } from '@/components/pages/messages-page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <MessagesPage 
        onChatSelect={(chat) => {
          console.log('Selected chat:', chat);
          // TODO: Implement chat selection
        }} 
      />
    </main>
  );
}
