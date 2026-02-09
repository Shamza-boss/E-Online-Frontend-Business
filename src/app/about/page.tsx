'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import AppTheme from '../_lib/components/shared-theme/AppTheme';
import AppAppBar from '../_lib/components/website/components/AppAppBar';
import Footer from '../_lib/components/website/components/Footer';

// Icons
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

interface TechDecision {
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  whyWeChoseIt: string[];
  alternatives: string;
  gradient: string;
}

const techDecisions: TechDecision[] = [
  {
    name: 'Next.js 14',
    category: 'Framework',
    icon: <CodeRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'React framework with server-side rendering, edge functions, and optimized builds.',
    whyWeChoseIt: [
      'Server Components reduce client-side JavaScript for faster page loads',
      'App Router provides intuitive file-based routing',
      'Built-in image and font optimization',
      'Edge runtime enables global low-latency responses',
      'Excellent TypeScript support out of the box',
    ],
    alternatives: 'Considered Remix, Astro, and traditional React SPA',
    gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
  },
  {
    name: 'Tiptap Editor',
    category: 'Rich Text',
    icon: <BrushRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Headless, framework-agnostic rich-text editor built on ProseMirror.',
    whyWeChoseIt: [
      'Fully extensible with custom nodes and marks',
      'Real-time collaboration ready with Y.js support',
      'Custom Excalidraw node for embedded diagrams',
      'Document linking for training materials',
      'Clean content output for consistent formatting',
    ],
    alternatives: 'Considered Slate.js, Quill, and Draft.js',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  },
  {
    name: 'Excalidraw',
    category: 'Whiteboard',
    icon: <BrushRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Virtual whiteboard for professional diagrams and process flows.',
    whyWeChoseIt: [
      'Clean aesthetic perfect for business documentation',
      'Infinite canvas for complex process diagrams',
      'Easy embedding as a custom Tiptap node',
      'Active open-source community',
      'Excellent dark mode support',
    ],
    alternatives: 'Considered TLDraw, Miro embeds, and custom canvas',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  },
  {
    name: 'PDF.js',
    category: 'Document Viewer',
    icon: <StorageRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Mozilla\'s JavaScript library for parsing and rendering PDFs in the browser.',
    whyWeChoseIt: [
      'No server-side processing required',
      'Page-by-page rendering for smooth performance',
      'Text layer access for highlighting and search',
      'Document outline extraction for navigation',
      'Custom bookmark integration with our notes system',
    ],
    alternatives: 'Considered iframe embeds, Google Docs viewer, and server-side conversion',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
  },
  {
    name: 'Cloudflare Stream',
    category: 'Video Infrastructure',
    icon: <CloudRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Enterprise-grade video streaming with global CDN delivery.',
    whyWeChoseIt: [
      'Adaptive bitrate streaming for all connection speeds',
      'Global CDN ensures fast delivery for remote workers',
      'Signed URLs protect proprietary training content',
      'Simple API for direct uploads',
      'Built-in analytics and processing',
    ],
    alternatives: 'Considered Mux, AWS MediaConvert, and self-hosted solutions',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
  },
  {
    name: 'Material UI',
    category: 'Component Library',
    icon: <BrushRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Google\'s Material Design implemented as React components.',
    whyWeChoseIt: [
      'Comprehensive component library reduces development time',
      'Built-in accessibility (a11y) compliance',
      'Powerful theming system with dark mode support',
      'MUI X provides advanced data grids and charts',
      'Consistent design language across the entire platform',
    ],
    alternatives: 'Considered Chakra UI, Radix, and Tailwind + Headless UI',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
  },
  {
    name: 'NextAuth.js',
    category: 'Authentication',
    icon: <SecurityRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Complete authentication solution for Next.js applications.',
    whyWeChoseIt: [
      'Built specifically for Next.js with App Router support',
      'Multiple auth providers (credentials, OAuth, etc.)',
      'Session management with JWT and database strategies',
      'Easy integration with our role-based access control',
      'Passkey/WebAuthn support for modern authentication',
    ],
    alternatives: 'Considered Clerk, Auth0, and custom JWT implementation',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  },
  {
    name: 'Railway + Cloudflare',
    category: 'Infrastructure',
    icon: <StorageRoundedIcon sx={{ fontSize: 40 }} />,
    description: 'Modern deployment platform with edge caching.',
    whyWeChoseIt: [
      'Railway provides simple container deployments',
      'PostgreSQL database with automatic backups',
      'Cloudflare CDN for static assets and edge caching',
      'Easy environment variable management',
      'Cost-effective scaling for educational workloads',
    ],
    alternatives: 'Considered Vercel, AWS, and DigitalOcean',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
  },
];

const architectureHighlights = [
  {
    icon: <SpeedRoundedIcon />,
    title: 'Performance First',
    description: 'Server components, edge caching, and optimized builds ensure sub-second page loads.',
  },
  {
    icon: <SecurityRoundedIcon />,
    title: 'Security by Design',
    description: 'Role-based access control, encrypted data, and secure authentication at every layer.',
  },
  {
    icon: <CloudRoundedIcon />,
    title: 'Global Scale',
    description: 'CDN-backed delivery means fast experiences for users anywhere in the world.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function AboutPage(props: { disableCustomTheme?: boolean }) {
  const theme = useTheme();

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      
      <Box
        sx={{
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 16 },
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg">
          {/* Back button */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ mb: 4, color: 'text.secondary' }}
              >
                Back to Home
              </Button>
            </Link>
          </MotionBox>

          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ mb: { xs: 6, sm: 10 }, maxWidth: 800 }}
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
              Our Technology Stack
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
              }}
            >
              Built with Purpose, Powered by the Best
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Every technology choice we made was deliberate. We selected tools that prioritize 
              performance, security, and long-term maintainability—because building 
              a private internal training platform demands nothing less.
            </Typography>
          </MotionBox>

          {/* Architecture highlights */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: { xs: 8, sm: 12 },
            }}
          >
            {architectureHighlights.map((highlight) => (
              <MotionBox key={highlight.title} variants={itemVariants}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      {highlight.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {highlight.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {highlight.description}
                  </Typography>
                </Paper>
              </MotionBox>
            ))}
          </MotionBox>

          <Divider sx={{ mb: { xs: 6, sm: 10 } }} />

          {/* Technology decisions */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ mb: 6 }}
          >
            <Typography
              component="h2"
              variant="h4"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Technology Decisions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
              A deep dive into the tools and libraries that power AO Launchpad, 
              and why we chose them over alternatives.
            </Typography>
          </MotionBox>

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {techDecisions.map((tech, index) => (
              <MotionPaper
                key={tech.name}
                variants={itemVariants}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    background: tech.gradient,
                  },
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={{ xs: 3, md: 4 }}
                >
                  {/* Left side - Tech info */}
                  <Box sx={{ flex: '0 0 280px' }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          background: tech.gradient,
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        {tech.icon}
                      </Box>
                      <Box>
                        <Chip
                          label={tech.category}
                          size="small"
                          sx={{
                            mb: 0.5,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        <Typography variant="h5" fontWeight={700}>
                          {tech.name}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tech.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      <strong>Alternatives considered:</strong> {tech.alternatives}
                    </Typography>
                  </Box>

                  {/* Right side - Why we chose it */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      Why We Chose It
                    </Typography>
                    <Stack spacing={1.5}>
                      {tech.whyWeChoseIt.map((reason, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                          <CheckCircleRoundedIcon
                            sx={{
                              color: 'success.main',
                              fontSize: 20,
                              mt: 0.25,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {reason}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </MotionPaper>
            ))}
          </MotionBox>

          {/* CTA Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              mt: { xs: 10, sm: 14 },
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Ready to Transform Your Workforce Training?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Join the growing number of organizations using AO Launchpad to 
              deliver effective employee training and professional development.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/#features" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5 }}>
                  Explore Features
                </Button>
              </Link>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      <Divider />
      <Footer />
    </AppTheme>
  );
}
