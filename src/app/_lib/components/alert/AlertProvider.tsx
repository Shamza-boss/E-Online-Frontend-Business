'use client';

/**
 * Alert Provider
 *
 * Modern alert/notification system with:
 * - Queue management for multiple alerts
 * - Rich formatting with icons and actions
 * - Error code integration for debugging
 * - Smooth animations
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useId,
} from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Typography,
  Box,
  IconButton,
  Collapse,
  Button,
  Slide,
  type AlertColor,
  type SlideProps,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// ============================================================================
// Types
// ============================================================================

export interface AlertOptions {
  /** Alert title (optional, will use default based on type) */
  title?: string;
  /** Main message to display */
  message: string;
  /** Severity level */
  type: AlertColor;
  /** How long to show (ms), 0 = indefinite */
  duration?: number;
  /** Error/tracking code for debugging */
  code?: string;
  /** Action button config */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Whether to persist until manually closed */
  persistent?: boolean;
}

interface AlertMessage extends AlertOptions {
  id: string;
}

/**
 * Legacy showAlert signature for backward compatibility
 * @deprecated Use success(), error(), warning(), info() methods instead
 */
type LegacyShowAlert = (type: AlertColor, message: string) => void;

/**
 * New showAlert signature with full options
 */
type NewShowAlert = (options: AlertOptions) => void;

interface AlertContextValue {
  /**
   * Show an alert - supports both legacy and new signatures
   * Legacy: showAlert('success', 'Message')
   * New: showAlert({ type: 'success', message: 'Message', code: 'ERR_123' })
   */
  showAlert: LegacyShowAlert & NewShowAlert;
  /** Quick success message */
  success: (message: string, title?: string) => void;
  /** Quick error message */
  error: (message: string, code?: string) => void;
  /** Quick warning message */
  warning: (message: string) => void;
  /** Quick info message */
  info: (message: string) => void;
  /** Dismiss current alert */
  dismiss: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

// ============================================================================
// Helpers
// ============================================================================

const DEFAULT_TITLES: Record<AlertColor, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

const ALERT_ICONS: Record<AlertColor, React.ReactNode> = {
  success: <CheckCircleOutlineIcon />,
  error: <ErrorOutlineIcon />,
  warning: <WarningAmberIcon />,
  info: <InfoOutlinedIcon />,
};

const DEFAULT_DURATIONS: Record<AlertColor, number> = {
  success: 3000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

// ============================================================================
// Alert Component
// ============================================================================

interface AlertContentProps {
  alert: AlertMessage;
  onClose: () => void;
}

function AlertContent({ alert, onClose }: AlertContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(async () => {
    if (alert.code) {
      await navigator.clipboard.writeText(alert.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [alert.code]);

  const title = alert.title || DEFAULT_TITLES[alert.type];
  const hasDetails = !!alert.code;

  return (
    <Alert
      severity={alert.type}
      icon={ALERT_ICONS[alert.type]}
      onClose={onClose}
      sx={{
        width: '100%',
        minWidth: 320,
        maxWidth: 480,
        boxShadow: 3,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
      action={
        hasDetails ? (
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ ml: 1 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ) : undefined
      }
    >
      <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>

      <Typography variant="body2" sx={{ mb: alert.action ? 1 : 0 }}>
        {alert.message}
      </Typography>

      {/* Action Button */}
      {alert.action && (
        <Button
          size="small"
          color="inherit"
          onClick={alert.action.onClick}
          sx={{
            mt: 1,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          {alert.action.label}
        </Button>
      )}

      {/* Expandable Details */}
      <Collapse in={expanded}>
        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {alert.code && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                px: 1.5,
                py: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontFamily: 'monospace', flex: 1 }}
              >
                Reference: {alert.code}
              </Typography>
              <IconButton
                size="small"
                onClick={handleCopyCode}
                title="Copy reference code"
              >
                {copied ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Use this reference when contacting support.
          </Typography>
        </Box>
      </Collapse>
    </Alert>
  );
}

// ============================================================================
// Provider
// ============================================================================

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<AlertMessage[]>([]);
  const [current, setCurrent] = useState<AlertMessage | null>(null);
  const idPrefix = useId();
  const idCounter = React.useRef(0);

  const generateId = useCallback(() => {
    idCounter.current += 1;
    return `${idPrefix}-${idCounter.current}`;
  }, [idPrefix]);

  // Internal: Show alert with AlertOptions
  const showAlertInternal = useCallback(
    (options: AlertOptions) => {
      const alertMsg: AlertMessage = {
        ...options,
        id: generateId(),
        duration: options.duration ?? DEFAULT_DURATIONS[options.type],
      };
      setQueue((prev) => [...prev, alertMsg]);
    },
    [generateId]
  );

  // Show alert - supports both legacy and new signatures
  // Legacy: showAlert('success', 'Message')
  // New: showAlert({ type: 'success', message: 'Message' })
  const showAlert = useCallback(
    (typeOrOptions: AlertColor | AlertOptions, message?: string) => {
      if (typeof typeOrOptions === 'string' && message !== undefined) {
        // Legacy signature: showAlert('success', 'Message')
        showAlertInternal({ type: typeOrOptions, message });
      } else if (typeof typeOrOptions === 'object') {
        // New signature: showAlert({ type: 'success', message: 'Message' })
        showAlertInternal(typeOrOptions);
      }
    },
    [showAlertInternal]
  ) as LegacyShowAlert & NewShowAlert;

  // Quick helpers
  const success = useCallback(
    (message: string, title?: string) => {
      showAlertInternal({ type: 'success', message, title });
    },
    [showAlertInternal]
  );

  const error = useCallback(
    (message: string, code?: string) => {
      showAlertInternal({
        type: 'error',
        message,
        code,
        duration: code ? 8000 : 6000,
      });
    },
    [showAlertInternal]
  );

  const warning = useCallback(
    (message: string) => {
      showAlertInternal({ type: 'warning', message });
    },
    [showAlertInternal]
  );

  const info = useCallback(
    (message: string) => {
      showAlertInternal({ type: 'info', message });
    },
    [showAlertInternal]
  );

  const dismiss = useCallback(() => {
    setCurrent(null);
  }, []);

  // Process queue
  React.useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, current]);

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway' && current?.persistent) {
        return;
      }
      setCurrent(null);
    },
    [current]
  );

  const contextValue = useMemo<AlertContextValue>(
    () => ({
      showAlert,
      success,
      error,
      warning,
      info,
      dismiss,
    }),
    [showAlert, success, error, warning, info, dismiss]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={!!current}
        autoHideDuration={current?.persistent ? null : current?.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{ mt: 1 }}
      >
        {current ? (
          <Box>
            <AlertContent alert={current} onClose={handleClose} />
          </Box>
        ) : undefined}
      </Snackbar>
    </AlertContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

// Re-export for convenience
export type { AlertColor };
