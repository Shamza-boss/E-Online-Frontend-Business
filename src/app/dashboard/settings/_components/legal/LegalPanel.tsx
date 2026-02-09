'use client';

import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

export default function LegalPanel() {
  const [termsOpen, setTermsOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <GavelOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Legal Documents
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Review our terms of service and privacy policy. These documents outline how we
            handle your data and the terms governing your use of the platform.
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
        <Stack spacing={3}>
          {/* Terms of Service */}
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <ArticleOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Terms of Service
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Our terms of service explain the rules and regulations for using AO Launchpad.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArticleOutlinedIcon />}
              onClick={() => setTermsOpen(true)}
            >
              View Terms of Service
            </Button>
          </Box>

          {/* Privacy Policy */}
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <PolicyOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Privacy Policy
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Learn how we collect, use, and protect your personal information.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PolicyOutlinedIcon />}
              onClick={() => setPrivacyOpen(true)}
            >
              View Privacy Policy
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Terms Dialog */}
      <Dialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <ArticleOutlinedIcon />
              <Typography variant="h6" fontWeight={700}>
                Terms of Service
              </Typography>
            </Box>
            <IconButton onClick={() => setTermsOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '70vh' }}>
          <Box
            component="iframe"
            src="https://absoluteonline.co.za/terms?embed=true"
            sx={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Terms of Service"
          />
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <PolicyOutlinedIcon />
              <Typography variant="h6" fontWeight={700}>
                Privacy Policy
              </Typography>
            </Box>
            <IconButton onClick={() => setPrivacyOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '70vh' }}>
          <Box
            component="iframe"
            src="https://absoluteonline.co.za/privacy?embed=true"
            sx={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Privacy Policy"
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
