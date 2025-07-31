// src/contexts/ApiContext.tsx - Global API state management (optional)
import React, { createContext, useContext, useCallback, useState } from 'react';
import { apiClient, APIError } from '../app/api/client';

interface ApiContextType {
  isOnline: boolean;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  handleGlobalError: (error: APIError) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Monitor network status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGlobalError = useCallback((error: APIError) => {
    // Global error handling logic
    console.error('Global API Error:', error);
    
    // You could show toast notifications here
    // You could redirect to error page for certain errors
    // You could refresh auth tokens, etc.
  }, []);

  const value: ApiContextType = {
    isOnline,
    globalLoading,
    setGlobalLoading,
    handleGlobalError,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}