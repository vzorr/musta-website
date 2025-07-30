// src/hooks/useApi.ts - Generic API hook
import { useState, useCallback, useRef } from 'react';
import { APIResponse, APIError } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
  success: boolean;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: APIError) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<APIResponse<T>>
  ): Promise<T | null> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await apiCall();

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          success: true,
        });

        options.onSuccess?.(response.data);
        return response.data || null;
      } else {
        throw new APIError(
          response.error || 'API_ERROR',
          response.message,
          400
        );
      }
    } catch (error) {
      const apiError = error instanceof APIError 
        ? error 
        : new APIError('UNKNOWN_ERROR', 'An unexpected error occurred');

      setState({
        data: null,
        loading: false,
        error: apiError,
        success: false,
      });

      options.onError?.(apiError);
      return null;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    cancel,
  };
}