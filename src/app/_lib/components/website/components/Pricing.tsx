'use client';
import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          E-Online will always offer a way to get started for free. Paid plans
          for schools and professionals are on the way. You can contact us in
          the meantime. Stay tuned!
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'center', width: '100%' }}
      >
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4,
              opacity: 0.9,
            }}
          >
            <HourglassTopRoundedIcon
              color="primary"
              sx={{ fontSize: 40, mb: 2 }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing plans launching soon
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                We&apos;re working on flexible pricing to suit individual
                learners, educators, and institutions. Want early access or
                partnership pricing? Reach out to us!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
