import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface AlertMessage {
  type: AlertColor;
  message: string;
}

interface AlertContextProps {
  showAlert: (type: AlertColor, message: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertQueue, setAlertQueue] = useState<AlertMessage[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(null);

  const showAlert = (type: AlertColor, message: string) => {
    setAlertQueue((prev) => [...prev, { type, message }]);
  };

  const handleClose = () => setCurrentAlert(null);

  React.useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prev) => prev.slice(1));
    }
  }, [alertQueue, currentAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={!!currentAlert}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {currentAlert ? (
          <Alert
            onClose={handleClose}
            severity={currentAlert.type}
            sx={{ width: '100%' }}
          >
            {currentAlert.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
