'use client';

import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BoldChip, FlexBox } from '../BillingExperience/elements';
import type { BillingToolbarProps } from './types';

export default function BillingToolbar({
  institutionOptions,
  selectedInstitutionId,
  selectedOption,
  institutionsLoading,
  institutionsError,
  generating,
  togglingStatus,
  onSelectInstitution,
  onToggleInstitutionStatus,
  onGenerateInvoice,
}: BillingToolbarProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'flex-end' }}
      >
        <FlexBox>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Institution
          </Typography>
          {institutionsError ? (
            <Alert severity="error">
              We could not load the institution directory. Please refresh the page.
            </Alert>
          ) : (
            <TextField
              select
              fullWidth
              size="small"
              value={selectedInstitutionId ?? ''}
              onChange={(event) => onSelectInstitution(event.target.value)}
              disabled={institutionsLoading || institutionOptions.length === 0}
              helperText={
                institutionOptions.length === 0
                  ? 'No institutions available yet.'
                  : 'Billing panels below update for this school.'
              }
            >
              {institutionOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </FlexBox>

        {selectedOption ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            pb={institutionOptions.length === 0 ? 0 : { md: '22px' }}
            flexWrap="wrap"
          >
            <BoldChip
              label={selectedOption.isActive ? 'Active' : 'Disabled'}
              color={selectedOption.isActive ? 'success' : 'error'}
              variant="filled"
              size="small"
            />
            <Button
              size="small"
              variant="outlined"
              color={selectedOption.isActive ? 'error' : 'success'}
              startIcon={
                togglingStatus ? (
                  <CircularProgress size={16} color="inherit" />
                ) : selectedOption.isActive ? (
                  <BlockIcon />
                ) : (
                  <CheckCircleIcon />
                )
              }
              disabled={togglingStatus}
              onClick={onToggleInstitutionStatus}
            >
              {selectedOption.isActive ? 'Disable access' : 'Enable access'}
            </Button>
          </Stack>
        ) : null}
      </Stack>

      {selectedInstitutionId ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={
              generating ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <ReceiptIcon />
              )
            }
            onClick={onGenerateInvoice}
            disabled={generating}
          >
            Generate invoice for this institution
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
