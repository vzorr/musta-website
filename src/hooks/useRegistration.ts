// src/hooks/useRegistration.ts - Registration-specific hook
import { useCallback } from 'react';
import { useApi } from './useApi';
import { registrationApi } from '../api';
import { RegistrationFormData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export function useRegistration() {
  const { language } = useLanguage();
  
  const {
    loading,
    error,
    success,
    execute,
    reset
  } = useApi({
    onSuccess: (data) => {
      console.log('Registration successful:', data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });

  const register = useCallback(async (data: RegistrationFormData) => {
    return execute(() => registrationApi.register(data));
  }, [execute]);

  const checkEmail = useCallback(async (email: string) => {
    return execute(() => registrationApi.checkEmail(email));
  }, [execute]);

  const resendConfirmation = useCallback(async (email: string) => {
    return execute(() => registrationApi.resendConfirmation(email));
  }, [execute]);

  return {
    register,
    checkEmail,
    resendConfirmation,
    loading,
    error,
    success,
    reset,
  };
}