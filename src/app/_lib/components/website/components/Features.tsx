'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Typography,
  useTheme,
  Stack,
  IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  category: 'Core' | 'Content' | 'Analytics' | 'Coming Soon';
  description: string;
  details: string[];
  gradient: string;
}

const allFeatures: FeatureItem[] = [
  {
    icon: <DashboardRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Admin Dashboard',
    category: 'Core',
    description: 'Role-aware analytics for Platform Admins, Department Managers, Trainers, and Employees.',
    details: [
      'Real-time KPI cards with 30-day trends',
      'Department activity visualization',
      'Completion rate tracking over time',
      'Training progress and certification stats',
    ],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: <AssignmentRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Assessment System',
    category: 'Core',
    description: 'Create certification exams with multiple question types—single-select, multi-select, video scenarios, and document-based questions.',
    details: [
      'Drag-and-drop question builder',
      'Weighted scoring for competency tracking',
      'Automatic pass/fail thresholds',
      'Real-time completion tracking',
    ],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <MenuBookRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Document Viewer',
    category: 'Content',
    description: 'Full-featured PDF reader for policies, procedures, and training manuals with navigation and bookmarking.',
    details: [
      'Page-by-page rendering with smooth scrolling',
      'Document outline navigation',
      'Link documents to training modules',
      'Text highlighting and annotations',
    ],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <DrawRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Diagram Builder',
    category: 'Content',
    description: 'Virtual whiteboard for process flows, org charts, and visual training aids embedded directly in courses.',
    details: [
      'Professional diagram templates',
      'Infinite canvas for complex processes',
      'Export and embed in materials',
      'Dark and light theme support',
    ],
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    icon: <VideoLibraryRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Video Training',
    category: 'Content',
    description: 'Enterprise-grade video delivery via Cloudflare Stream with adaptive bitrate and secure access controls.',
    details: [
      'Direct upload from admin dashboard',
      'Global CDN for fast delivery',
      'Processing status indicators',
      'Secure signed URLs for privacy',
    ],
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    icon: <BusinessCenterRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Course Builder',
    category: 'Content',
    description: 'Rich content editor powered by Tiptap for creating interactive training materials with embedded media.',
    details: [
      'Full formatting toolbar',
      'Embedded diagrams and videos',
      'Document linking and references',
      'Auto-save and version history',
    ],
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <GroupsRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Organization Management',
    category: 'Core',
    description: 'Complete workspace for managing departments, teams, training tracks, and employee enrollments.',
    details: [
      'Role-based access control',
      'Department provisioning',
      'Training track setup',
      'Bulk enrollment management',
    ],
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    icon: <AnalyticsRoundedIcon sx={{ fontSize: 40 }} />,
    title: 'Performance Analytics',
    category: 'Coming Soon',
    description: 'Deep insights into employee engagement, competency gaps, and training ROI for data-driven L&D decisions.',
    details: [
      'Completion trend analysis',
      'Engagement heat maps',
      'Compliance deadline alerts',
      'Executive reports',
    ],
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  },
];

const categoryColors: Record<FeatureItem['category'], string> = {
  Core: '#10B981',
  Content: '#3B82F6',
  Analytics: '#8B5CF6',
  'Coming Soon': '#6B7280',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Features() {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectedFeature = allFeatures[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allFeatures.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allFeatures.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 10, sm: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ mb: { xs: 6, sm: 8 } }}
        >
          <Typography
            component="span"
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block',
            }}
          >
            Platform Features
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            Everything Your Organization Needs
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              fontWeight: 400,
            }}
          >
            Built for enterprises, designed for results. A complete corporate training
            platform with powerful tools for content creation, certification, and analytics.
          </Typography>
        </MotionBox>

        {/* Feature Showcase - Large Selected Feature */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Selected Feature Detail */}
          <AnimatePresence mode="wait">
            <MotionCard
              key={selectedIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              sx={{
                flex: { lg: '0 0 50%' },
                p: 4,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : theme.palette.background.paper,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Gradient accent */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: selectedFeature.gradient,
                }}
              />

              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: selectedFeature.gradient,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedFeature.icon}
                  </Box>
                  <Box>
                    <Chip
                      label={selectedFeature.category}
                      size="small"
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        bgcolor: alpha(categoryColors[selectedFeature.category], 0.15),
                        color: categoryColors[selectedFeature.category],
                      }}
                    />
                    <Typography variant="h4" fontWeight={700}>
                      {selectedFeature.title}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  {selectedFeature.description}
                </Typography>

                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {selectedFeature.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          py: 0.5,
                          '&::marker': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {detail}
                      </Typography>
                    </motion.li>
                  ))}
                </Box>

                {/* Navigation */}
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={handlePrev} size="small">
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton onClick={handleNext} size="small">
                      <NavigateNextIcon />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {selectedIndex + 1} / {allFeatures.length}
                  </Typography>
                </Stack>
              </Stack>
            </MotionCard>
          </AnimatePresence>

          {/* Feature Grid */}
          <Box sx={{ flex: 1 }}>
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              {allFeatures.map((feature, index) => (
                <MotionBox
                  key={feature.title}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setSelectedIndex(index)}
                    sx={{
                      width: '100%',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: selectedIndex === index ? 'primary.main' : 'divider',
                      bgcolor: selectedIndex === index
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        background: feature.gradient,
                        color: 'white',
                        mb: 1.5,
                        display: 'flex',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ color: 'text.primary', mb: 0.5 }}
                    >
                      {feature.title}
                    </Typography>
                    <Chip
                      label={feature.category}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: alpha(categoryColors[feature.category], 0.15),
                        color: categoryColors[feature.category],
                      }}
                    />
                  </Button>
                </MotionBox>
              ))}
            </MotionBox>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
