'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import Link from 'next/link';

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

type TechItem = {
  name: string;
  logo: React.ReactNode;
  description: string;
  color: string;
  url: string;
}

// Favicon-based logos using Google's favicon service
const TiptapLogo = () => (
  <img 
    src="https://www.google.com/s2/favicons?domain=tiptap.dev&sz=128" 
    alt="Tiptap" 
    width={48} 
    height={48}
    style={{ borderRadius: 8 }}
  />
);

const ExcalidrawLogo = () => (
  <img 
    src="https://www.google.com/s2/favicons?domain=excalidraw.com&sz=128" 
    alt="Excalidraw" 
    width={48} 
    height={48}
    style={{ borderRadius: 8 }}
  />
);

const CloudflareLogo = () => (
  <img 
    src="https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128" 
    alt="Cloudflare" 
    width={48} 
    height={48}
    style={{ borderRadius: 8 }}
  />
);

const technologies: TechItem[] = [
  {
    name: 'Tiptap',
    logo: <TiptapLogo />,
    description: 'Headless rich-text editor powering our content creation tools. Build training materials with real-time collaboration, process diagrams, and embedded documentation.',
    color: '#8B5CF6',
    url: 'https://tiptap.dev',
  },
  {
    name: 'Excalidraw',
    logo: <ExcalidrawLogo />,
    description: 'Virtual whiteboard for creating flowcharts, org charts, process diagrams, and visual training aids. Perfect for illustrating procedures and workflows.',
    color: '#6366F1',
    url: 'https://excalidraw.com',
  },
  {
    name: 'Cloudflare Stream',
    logo: <CloudflareLogo />,
    description: 'Enterprise-grade video infrastructure for training videos. Adaptive bitrate, global CDN delivery, and secure signed URLs protect your proprietary content.',
    color: '#F97316',
    url: 'https://www.cloudflare.com/products/cloudflare-stream/',
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

export default function TechStack() {
  const theme = useTheme();

  return (
    <Box
      id="tech-stack"
      sx={{
        py: { xs: 8, sm: 14 },
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.08)} 0%, transparent 100%)`
          : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 100%)`,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.03, 0.08, 0.03],
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            sx={{
              position: 'absolute',
              width: { xs: 200, md: 400 },
              height: { xs: 200, md: 400 },
              borderRadius: '50%',
              background: `radial-gradient(circle, ${technologies[i]?.color || theme.palette.primary.main} 0%, transparent 70%)`,
              filter: 'blur(60px)',
              top: `${(i * 20) % 80}%`,
              left: `${(i * 17) % 90}%`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}
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
            Built with the best
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #fff 0%, #94A3B8 100%)'
                : 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powered by Industry-Leading Technologies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            We chose each technology for a reason—performance, reliability, and the best possible experience for trainers and employees.
          </Typography>
        </MotionBox>

        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {technologies.map((tech) => (
            <MotionPaper
              key={tech.name}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 },
              }}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 3,
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid',
                borderColor: 'divider',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: tech.color,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  borderColor: alpha(tech.color, 0.5),
                  boxShadow: `0 20px 40px ${alpha(tech.color, 0.15)}`,
                  '&::before': {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => window.open(tech.url, '_blank', 'noopener,noreferrer')}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    color: tech.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha(tech.color, 0.1),
                  }}
                >
                  {tech.logo}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {tech.name}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  flexGrow: 1,
                }}
              >
                {tech.description}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Learn more →
              </Box>
            </MotionPaper>
          ))}
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{
            mt: 8,
            textAlign: 'center',
          }}
        >
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Explore our full technology stack and architecture →
            </Typography>
          </Link>
        </MotionBox>
      </Container>
    </Box>
  );
}
