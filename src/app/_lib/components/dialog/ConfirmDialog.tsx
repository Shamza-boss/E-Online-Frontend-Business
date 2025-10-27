'use client';

import React from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText: React.ReactNode;
  cancelText?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  disableConfirm?: boolean;
  disableCancel?: boolean;
  confirmButtonProps?: Omit<ButtonProps, 'onClick' | 'disabled'> & {
    disabled?: ButtonProps['disabled'];
  };
  cancelButtonProps?: Omit<ButtonProps, 'onClick' | 'disabled'> & {
    disabled?: ButtonProps['disabled'];
  };
  dialogTitleId?: string;
  dialogDescriptionId?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  disableConfirm,
  disableCancel,
  confirmButtonProps,
  cancelButtonProps,
  dialogTitleId,
  dialogDescriptionId,
}) => {
  const generatedTitleId = React.useId();
  const generatedDescriptionId = React.useId();

  const titleId = dialogTitleId ?? `${generatedTitleId}-confirm-dialog-title`;
  const descriptionId =
    dialogDescriptionId ??
    `${generatedDescriptionId}-confirm-dialog-description`;

  const {
    disabled: confirmDisabledProp,
    color: confirmColorProp,
    variant: confirmVariantProp,
    ...restConfirmButtonProps
  } = confirmButtonProps ?? {};

  const {
    disabled: cancelDisabledProp,
    color: cancelColorProp,
    variant: cancelVariantProp,
    ...restCancelButtonProps
  } = cancelButtonProps ?? {};

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText id={descriptionId}>
            {description}
          </DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={disableCancel ?? cancelDisabledProp}
          color={cancelColorProp}
          variant={cancelVariantProp}
          {...restCancelButtonProps}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColorProp ?? 'error'}
          variant={confirmVariantProp}
          disabled={disableConfirm ?? confirmDisabledProp}
          {...restConfirmButtonProps}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
