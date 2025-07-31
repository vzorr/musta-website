// src/hooks/useGDPR.ts - GDPR-specific hook
import { useCallback } from 'react';
import { useApi } from './useApi';
import { gdprApi } from '../app/api';
import { useLanguage } from '../contexts/LanguageContext';

export function useGDPR() {
  const { language } = useLanguage();
  
  const accessRequest = useApi({
    onSuccess: () => console.log('Data access request successful'),
  });

  const exportRequest = useApi({
    onSuccess: () => console.log('Data export request successful'),
  });

  const deleteRequest = useApi({
    onSuccess: () => console.log('Data deletion request successful'),
  });

  const rectifyRequest = useApi({
    onSuccess: () => console.log('Data rectification request successful'),
  });

  const requestDataAccess = useCallback(async (email: string) => {
    return accessRequest.execute(() => gdprApi.requestDataAccess(email, language));
  }, [accessRequest.execute, language]);

  const requestDataExport = useCallback(async (email: string) => {
    return exportRequest.execute(() => gdprApi.requestDataExport(email, language));
  }, [exportRequest.execute, language]);

  const requestDataDeletion = useCallback(async (
    email: string, 
    confirmEmail: string, 
    reason?: string
  ) => {
    return deleteRequest.execute(() => 
      gdprApi.requestDataDeletion(email, confirmEmail, reason, language)
    );
  }, [deleteRequest.execute, language]);

  const requestDataRectification = useCallback(async (
    email: string, 
    details: string
  ) => {
    return rectifyRequest.execute(() => 
      gdprApi.requestDataRectification(email, details, language)
    );
  }, [rectifyRequest.execute, language]);

  return {
    // Methods
    requestDataAccess,
    requestDataExport,
    requestDataDeletion,
    requestDataRectification,
    
    // States
    accessRequest: {
      loading: accessRequest.loading,
      error: accessRequest.error,
      success: accessRequest.success,
      data: accessRequest.data,
    },
    exportRequest: {
      loading: exportRequest.loading,
      error: exportRequest.error,
      success: exportRequest.success,
    },
    deleteRequest: {
      loading: deleteRequest.loading,
      error: deleteRequest.error,
      success: deleteRequest.success,
    },
    rectifyRequest: {
      loading: rectifyRequest.loading,
      error: rectifyRequest.error,
      success: rectifyRequest.success,
    },
  };
}