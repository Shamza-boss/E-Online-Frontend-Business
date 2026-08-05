'use client';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState, useEffect, useRef } from 'react';
import { roleOptions } from '@/app/_lib/common/functions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { editUserSchema } from '@/app/_lib/schemas/management';
import { type UserDto } from '@/app/_lib/interfaces/types';
import { UpdateUserAction } from './updateUserAction';
import { isFormActionSuccess } from '@/app/_lib/types/actionState';

type EditUserFormProps = {
  user: UserDto | null;
  isAdmin: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
}

export default function EditUserForm({ user, isAdmin, handleClose, onSuccess }: EditUserFormProps) {
  if (!user) {
    return null;
  }
  
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(UpdateUserAction, null);
  const isMountedRef = useRef(true);
  
  const formId = `edit-user-${user.userId}`;
  const [form, { firstName, lastName, email, role }] = useForm({
    id: formId,
    lastResult,
    defaultValue: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: String(user.role),
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editUserSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isFormActionSuccess(lastResult) && isMountedRef.current) {
      const user = lastResult.data;
      showAlert(
        'success',
        `${user.firstName} ${user.lastName} updated successfully🚀!`,
      );
      
      // Call onSuccess to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      // Delay close to allow async operations to complete
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          handleClose();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  return (
    <Box
      component="form"
      {...getFormProps(form)}
      action={action}
      sx={{ padding: 3 }}
    >
      <input type="hidden" name="userId" value={user.userId} />
      <input type="hidden" name="institutionId" value={user.institutionId || ''} />
      <input type="hidden" name="currentRole" value={String(user.role)} />
      <input type="hidden" name="isAdmin" value={String(isAdmin)} />

      <Alert severity="info" sx={{ my: 2 }}>
        <strong>Important:</strong> Email addresses cannot be changed. If a change is needed, you will need to contact support.
      </Alert>
      <TextField
        placeholder="First Name"
        label="First Name"
        key={firstName.key}
        name={firstName.name}
        defaultValue={firstName.initialValue || user.firstName}
        error={!firstName.valid}
        helperText={firstName.errors || ''}
        fullWidth
        margin="normal"
        disabled={!isAdmin}
      />
      <TextField
        placeholder="Last Name"
        label="Last Name"
        key={lastName.key}
        name={lastName.name}
        defaultValue={lastName.initialValue || user.lastName}
        error={!lastName.valid}
        helperText={lastName.errors || ''}
        fullWidth
        margin="normal"
        disabled={!isAdmin}
      />
      <TextField
        placeholder="Email"
        label="Email"
        key={email.key}
        name={email.name}
        defaultValue={email.initialValue || user.email}
        error={!email.valid}
        helperText={email.errors || 'Email addresses cannot be changed. Contact support if you need to update this.'}
        fullWidth
        margin="normal"        
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <FormControl fullWidth error={!role.valid} margin="normal" disabled={!isAdmin}>
        <InputLabel id="edit-role-label">Role</InputLabel>
        <Select
          labelId="edit-role-label"
          label="Role"
          key={role.key}
          name={role.name}
          defaultValue={role.initialValue ?? String(user.role)}
          readOnly={!isAdmin}
        >
          {roleOptions.map((data) => (
            <MenuItem key={data.value} value={data.value}>
              {data.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {!isAdmin ? 'Only administrators can change user roles' : (role.errors || '')}
        </FormHelperText>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
        <Button
          type="submit"
          loading={pending}
          variant="contained"
          disabled={!isAdmin}
          sx={{ minWidth: 100 }}
        >
          {pending ? 'Saving…' : 'Update User'}
        </Button>
      </Box>
    </Box>
  );
}
