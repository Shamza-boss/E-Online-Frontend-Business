'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Typography,
  useTheme,
  Pagination,
  Stack,
} from '@mui/material';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

const allItems = [
  {
    icon: <ViewQuiltRoundedIcon fontSize="large" />,
    title: 'Smart Dashboard',
    category: 'Now Available',
    description:
      'An intuitive dashboard tailored for both students and teachers. Track progress, upcoming tasks, and feedback—all in one view.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/dash-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/dash-dark.png',
  },
  {
    icon: <DevicesRoundedIcon fontSize="large" />,
    title: 'Cross-Platform Access',
    category: 'Now Available',
    description:
      'Study or teach from anywhere.  E-Online works seamlessly across laptops, tablets, and mobile devices.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/devices-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/devices-dark.png',
  },
  {
    icon: <EdgesensorHighRoundedIcon fontSize="large" />,
    title: 'Live Assignment System',
    category: 'Now Available',
    description:
      'Trainers can build, assign, and grade structured assignments. Students/trainees get real-time access and feedback—replacing paper forever.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/mobile-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/mobile-dark.png',
  },
  {
    icon: <DevicesRoundedIcon fontSize="large" />,
    title: 'Offline Notes & Annotated PDFs',
    category: 'Now Available',
    description:
      'Bring your study material to life with highlights, comments, and annotations. Even works when offline.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/mobile-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/mobile-dark.png',
  },
  {
    icon: <AssignmentTurnedInRoundedIcon fontSize="large" />,
    title: 'AI-Powered Grading',
    category: 'Coming Soon',
    description:
      'Save time with automatic answer evaluation, suggestion-based feedback, and smart rubrics—currently in development.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/dash-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/dash-dark.png',
  },
  {
    icon: <AutoGraphRoundedIcon fontSize="large" />,
    title: 'Learning Analytics',
    category: 'Coming Soon',
    description:
      'Gain deep insight into student engagement, topic mastery, and learning trends to better support their journey.',
    imageLight:
      'https://mui.com/static/images/templates/templates-images/dash-light.png',
    imageDark:
      'https://mui.com/static/images/templates/templates-images/dash-dark.png',
  },
];

const ITEMS_PER_PAGE = 3;

export default function Features() {
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setSelectedIndex((value - 1) * ITEMS_PER_PAGE); // default to first item on new page
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const items = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedItem = items[selectedIndex - startIndex] || items[0];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' }, mb: 4 }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Explore Our Features
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Built for classrooms, designed for tomorrow. Here&apos;s what you can
          do with E-Online—and what’s coming soon.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '55%',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 400,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage:
                theme.palette.mode === 'light'
                  ? `url(${selectedItem.imageLight})`
                  : `url(${selectedItem.imageDark})`,
              borderRadius: 2,
            }}
          />
        </Card>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: { xs: '100%', md: '45%' },
          }}
        >
          {items.map((item, index) => {
            const isComingSoon = item.category === 'Coming Soon';
            return (
              <Button
                key={index}
                onClick={() => setSelectedIndex(startIndex + index)}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  border:
                    selectedIndex === startIndex + index
                      ? '2px solid'
                      : '1px solid',
                  borderColor:
                    selectedIndex === startIndex + index
                      ? 'primary.main'
                      : 'divider',
                  p: 2,
                  borderRadius: 2,
                  background: isComingSoon
                    ? 'rgba(0,0,0,0.03)'
                    : 'background.paper',
                }}
              >
                <Stack spacing={1} alignItems="flex-start">
                  <Box sx={{ fontSize: 28 }}>{item.icon}</Box>
                  <Typography variant="h6" color="text.primary">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Chip
                    size="small"
                    label={item.category}
                    color={isComingSoon ? 'default' : 'primary'}
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>
              </Button>
            );
          })}
        </Box>
      </Box>

      <Box mt={6} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(allItems.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Container>
  );
}
