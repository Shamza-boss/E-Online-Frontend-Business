import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { Grid } from '@mui/material';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Flexible for Every Classroom',
    description:
      ' E-Online adapts to institutions of any size—private or public, urban or rural—bringing structure and insight to every learning space.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Structured, Scalable Learning',
    description:
      'From foundational subjects to complex projects, our tools scale with your curriculum and let teachers build engaging, structured assignments.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Effortless for Students',
    description:
      'Simple interfaces, distraction-free homework flows, and accessible notes ensure students focus on learning, not navigating software.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Innovating Daily Workflows',
    description:
      'Auto-saving notes, smart grading, and PDF annotation are just the start. We’re transforming how teachers and students interact.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Ready to Support You',
    description:
      'We’re hands-on with educators from day one. Whether it’s setup, training, or roadmap feedback—we’re here to help you thrive.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Insight-Driven Results',
    description:
      'Planned learning analytics will help teachers monitor student performance, identify gaps early, and support individual growth.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
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
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer
            support and precision in every detail.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
