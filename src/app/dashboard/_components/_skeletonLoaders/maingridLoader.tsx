'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';

export default function MainGridSkeleton() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, p: 3 }}>
      {/* Skeleton for cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        <Skeleton width="20%" height={30} />
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {[...Array(4)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} width="100%" />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Skeleton for charts */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        <Skeleton width="20%" height={30} />
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={250} width="100%" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={250} width="100%" />
          </Paper>
        </Grid>
      </Grid>

      {/* Skeleton for details */}
      <Grid container spacing={2} columns={12} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={400} width="100%" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {[...Array(2)].map((_, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{ p: 2, borderRadius: 2, flex: 1 }}
              >
                <Skeleton variant="rectangular" height={180} width="100%" />
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
