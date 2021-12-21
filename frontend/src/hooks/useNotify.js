import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useNotify = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const success = useCallback(
    (message, options = {}) =>
      enqueueSnackbar(message, { ...options, variant: 'success' }),
    [enqueueSnackbar]
  );

  const error = useCallback(
    (message, options = {}) =>
      enqueueSnackbar(message, { ...options, variant: 'error' }),
    [enqueueSnackbar]
  );

  const close = useCallback(() => closeSnackbar(), [closeSnackbar]);

  return {
    error,
    close,
    success
  };
};
