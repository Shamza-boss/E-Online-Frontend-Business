'use client';

/**
 * Error Handler Hook
 *
 * Unified error handling that:
 * - Shows alerts for recoverable errors
 * - Redirects to error pages for critical errors
 * - Integrates with the error code system
 * - Provides user-friendly messages
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
  type ErrorCodeType,
  ErrorCode,
  isApiError,
  isNetworkError,
  isTimeoutError,
  getTrackingId,
} from '@/lib/api';
import {
  getUserFriendlyError,
  shouldShowFullPage,
} from '@/lib/api/userMessages';

interface ErrorHandlerOptions {
  /** Override the default behavior for full page vs alert */
  forceAlert?: boolean;
  /** Override the default behavior for full page vs alert */
  forceFullPage?: boolean;
  /** Custom action to show in the alert */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback after error is handled */
  onHandled?: () => void;
}

interface ErrorHandlerResult {
  /** Handle any error type */
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  /** Handle an error with a specific code */
  handleErrorCode: (
    code: ErrorCodeType,
    trackingId?: string,
    options?: ErrorHandlerOptions
  ) => void;
  /** Show a generic error message */
  showGenericError: (message?: string) => void;
}

export function useErrorHandler(): ErrorHandlerResult {
  const router = useRouter();
  const alert = useAlert();

  /**
   * Handle error by code
   */
  const handleErrorCode = useCallback(
    (
      code: ErrorCodeType,
      trackingId?: string,
      options?: ErrorHandlerOptions
    ) => {
      const userError = getUserFriendlyError(code);
      const showFullPage =
        options?.forceFullPage ||
        (!options?.forceAlert && shouldShowFullPage(code));

      if (showFullPage) {
        // Redirect to appropriate error page
        const errorPages: Partial<Record<ErrorCodeType, string>> = {
          [ErrorCode.UNAUTHORIZED]: '/signin',
          [ErrorCode.SESSION_EXPIRED]: '/signin',
          [ErrorCode.FORBIDDEN]: '/error/forbidden',
          [ErrorCode.NOT_FOUND]: '/not-found',
        };

        const page = errorPages[code] || '/error/server-error';
        const url = trackingId ? `${page}?ref=${trackingId}` : page;
        router.push(url as any);
      } else {
        // Show alert
        alert.showAlert({
          type: userError.severity,
          title: userError.title,
          message: userError.description,
          code: trackingId,
          action:
            options?.action ||
            (userError.action
              ? {
                  label: userError.action,
                  onClick: () => {
                    if (userError.action === 'Sign in') {
                      router.push('/signin');
                    } else if (userError.action === 'Retry') {
                      window.location.reload();
                    } else if (userError.action === 'Go back') {
                      router.back();
                    }
                  },
                }
              : undefined),
        });
      }

      options?.onHandled?.();
    },
    [router, alert]
  );

  /**
   * Handle any error type
   */
  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      // Extract error code and tracking ID
      let code: ErrorCodeType = ErrorCode.UNKNOWN;
      let trackingId: string | undefined;

      if (isApiError(error)) {
        code = error.code;
        trackingId = error.context.trackingId;
      } else if (isNetworkError(error)) {
        code = ErrorCode.NETWORK_ERROR;
        trackingId = error.context.trackingId;
      } else if (isTimeoutError(error)) {
        code = ErrorCode.TIMEOUT;
        trackingId = error.context.trackingId;
      } else {
        trackingId = getTrackingId(error);
      }

      // Log error for debugging (in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorHandler]', {
          code,
          trackingId,
          error,
        });
      }

      handleErrorCode(code, trackingId, options);
    },
    [handleErrorCode]
  );

  /**
   * Show a generic error message
   */
  const showGenericError = useCallback(
    (message?: string) => {
      alert.error(
        message || 'Something went wrong. Please try again.',
        undefined
      );
    },
    [alert]
  );

  return {
    handleError,
    handleErrorCode,
    showGenericError,
  };
}
