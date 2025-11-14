import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import useSWR from 'swr';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
  getInstitutionWithAdmin,
  updateInstitutionWithAdmin,
} from '@/app/_lib/actions/institutions';
import { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';

interface ManageInstitutionModalProps {
  open: boolean;
  institutionId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

const fieldWidth = { width: '100%' };

const ManageInstitutionModal: React.FC<ManageInstitutionModalProps> = ({
  open,
  institutionId,
  onClose,
  onUpdated,
}) => {
  const { showAlert } = useAlert();
  const [institutionName, setInstitutionName] = React.useState('');
  const [adminFirstName, setAdminFirstName] = React.useState('');
  const [adminLastName, setAdminLastName] = React.useState('');
  const [adminEmail, setAdminEmail] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const shouldFetch = open && Boolean(institutionId);
  const { data, isValidating, error, mutate } = useSWR<InstitutionWithAdminDto>(
    shouldFetch ? ['institution-with-admin', institutionId] : null,
    () => getInstitutionWithAdmin(institutionId as string),
    {
      revalidateOnFocus: false,
    }
  );

  React.useEffect(() => {
    if (!open) {
      setInstitutionName('');
      setAdminFirstName('');
      setAdminLastName('');
      setAdminEmail('');
      return;
    }

    if (data) {
      setInstitutionName(data.institution?.name ?? '');
      setAdminFirstName(data.admin?.firstName ?? '');
      setAdminLastName(data.admin?.lastName ?? '');
      setAdminEmail(data.admin?.email ?? data.institution?.adminEmail ?? '');
    }
  }, [data, open]);

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!institutionId || saving) {
      return;
    }

    const baseInstitution = data?.institution ?? {
      id: institutionId,
      name: institutionName,
      adminEmail,
      createdAt: '',
      updatedAt: '',
      isActive: true,
    };

    const payload: InstitutionWithAdminDto = {
      institution: {
        ...baseInstitution,
        name: institutionName.trim(),
        adminEmail: adminEmail.trim(),
      },
      admin: {
        firstName: adminFirstName.trim(),
        lastName: adminLastName.trim(),
        email: adminEmail.trim(),
      },
    };

    setSaving(true);
    try {
      await updateInstitutionWithAdmin(institutionId, payload);
      await mutate();
      onUpdated();
      showAlert('success', 'Institution details updated successfully.');
      onClose();
    } catch (err) {
      console.error('Failed to update institution', err);
      showAlert('error', 'Unable to update institution details.');
    } finally {
      setSaving(false);
    }
  };

  const loading = shouldFetch && !data && isValidating;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      keepMounted
    >
      <DialogTitle sx={{ pr: 5 }}>Manage Institution</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 16, top: 16 }}
        disabled={saving}
      >
        <CloseIcon />
      </IconButton>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ minHeight: 280 }}>
          {loading ? (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ py: 4 }}>
              <Typography color="error" align="center">
                We could not load the institution details. Please try again.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Institution Information
                </Typography>
                <TextField
                  label="Institution Name"
                  value={institutionName}
                  onChange={(event) => setInstitutionName(event.target.value)}
                  required
                  sx={fieldWidth}
                  margin="normal"
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Update the institution name or assign a different admin email
                  if needed. Status changes remain available in the table view.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Institution Administrator
                </Typography>
                <TextField
                  label="Admin First Name"
                  value={adminFirstName}
                  onChange={(event) => setAdminFirstName(event.target.value)}
                  required
                  sx={fieldWidth}
                  margin="normal"
                />
                <TextField
                  label="Admin Last Name"
                  value={adminLastName}
                  onChange={(event) => setAdminLastName(event.target.value)}
                  required
                  sx={fieldWidth}
                  margin="normal"
                />
                <TextField
                  label="Admin Email"
                  type="email"
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  required
                  sx={fieldWidth}
                  margin="normal"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Provide the administrator details to create or update the
                  associated user for this institution.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        {!loading && !error && (
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Updating...' : 'Update Institution'}
            </Button>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
};

export default ManageInstitutionModal;
