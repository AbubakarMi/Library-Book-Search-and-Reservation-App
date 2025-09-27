import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  customMessage?: string;
  fallbackAction?: () => void;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      customMessage,
      fallbackAction
    } = options;

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    if (logError) {
      console.error('Error handled:', error);
    }

    if (showToast) {
      toast({
        variant: "destructive",
        title: "Error",
        description: customMessage || errorMessage,
        duration: 5000,
      });
    }

    if (fallbackAction) {
      fallbackAction();
    }
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  const withErrorHandling = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    options: ErrorHandlerOptions = {}
  ) => {
    return ((...args: Parameters<T>) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.catch(error => handleError(error, options));
        }
        return result;
      } catch (error) {
        handleError(error, options);
      }
    }) as T;
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    withErrorHandling
  };
}