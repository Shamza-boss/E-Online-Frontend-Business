'use client';

import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Button,
  DialogActions,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { roleOptions } from '@/app/_lib/common/functions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { UserDto } from '@/app/_lib/interfaces/types';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { updateUser } from '@/app/_lib/actions/users';

interface EditUserModalProps {
  open: boolean;
  user: UserDto | null;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Schema for editing user - validates the form data
const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(20).nonempty('First name is required'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(20).nonempty('Last name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  role: z
    .enum([
      String(UserRole.Admin),
      String(UserRole.Trainee),
      String(UserRole.Instructor),
    ])
    .transform(Number),
});

export default function EditUserModal({
  open,
  user,
  isAdmin,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const alert = useAlert();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Use a key to force form re-initialization when user changes
  const formKey = `edit-user-${user?.userId ?? 'none'}-${open ? 'open' : 'closed'}`;

  const [form, { firstName, lastName, email, role }] = useForm({
    id: formKey,
    defaultValue: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      role: String(user?.role ?? UserRole.Trainee),
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editUserSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user?.userId) {
      alert.error('Unable to identify user to update.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const result = parseWithZod(formData, { schema: editUserSchema });

    if (result.status !== 'success') {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser: UserDto = {
        ...user,
        firstName: result.value.firstName,
        lastName: result.value.lastName,
        email: result.value.email,
        role: isAdmin ? result.value.role : user.role, // Only admins can change role
      };

      await updateUser(updatedUser);
      alert.success(`${updatedUser.firstName} ${updatedUser.lastName}'s details updated successfully!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Failed to update user.';
      alert.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the dialog content if no user is selected
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" key={formKey}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit User Details
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        disabled={isSubmitting}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Box
          component="form"
          {...getFormProps(form)}
          onSubmit={handleSubmit}
          id="edit-user-form"
          sx={{ padding: 3 }}
        >
          <TextField
            placeholder="First Name"
            label="First Name"
            key={firstName.key}
            name={firstName.name}
            defaultValue={user?.firstName ?? ''}
            error={!firstName.valid}
            helperText={firstName.errors || ''}
            fullWidth
            margin="normal"
            disabled={!isAdmin}
            slotProps={{
              input: {
                readOnly: !isAdmin,
              },
            }}
          />
          <TextField
            placeholder="Last Name"
            label="Last Name"
            key={lastName.key}
            name={lastName.name}
            defaultValue={user?.lastName ?? ''}
            error={!lastName.valid}
            helperText={lastName.errors || ''}
            fullWidth
            margin="normal"
            disabled={!isAdmin}
            slotProps={{
              input: {
                readOnly: !isAdmin,
              },
            }}
          />
          <TextField
            placeholder="Email"
            label="Email"
            key={email.key}
            name={email.name}
            defaultValue={user?.email ?? ''}
            fullWidth
            margin="normal"
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            helperText="Email addresses cannot be changed. Contact support if you need to update this."
          />
          <FormControl fullWidth error={!role.valid} margin="normal" disabled={!isAdmin}>
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              label="Role"
              key={role.key}
              name={role.name}
              defaultValue={String(user?.role ?? UserRole.Trainee)}
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-user-form"
          variant="contained"
          disabled={isSubmitting || !isAdmin}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
