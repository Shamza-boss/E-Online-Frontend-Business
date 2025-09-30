import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import Container from '@mui/material/Container';

export default function Testimonials() {
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
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
          What People Are Saying
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Our classrooms are talking—and we’re listening. Testimonials from
          teachers, students, and schools will appear here soon. Want to be
          featured? Join the platform early and help shape the future of
          education.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                p: 4,
                minHeight: 220,
                textAlign: 'center',
                opacity: 0.6,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Testimonial loading…
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Coming soon from early educators and students
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
