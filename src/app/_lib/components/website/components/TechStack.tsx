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

interface TechItem {
  name: string;
  logo: React.ReactNode;
  description: string;
  color: string;
  url: string;
}

// SVG Logo components
const TiptapLogo = () => (
  <svg width="48" height="48" viewBox="0 0 512 512" fill="currentColor">
    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208-93.31 208-208 208zm-80-240h64v144c0 8.844 7.156 16 16 16s16-7.156 16-16V224h64c8.844 0 16-7.156 16-16s-7.156-16-16-16H176c-8.844 0-16 7.156-16 16s7.156 16 16 16z"/>
  </svg>
);

const ExcalidrawLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="currentColor" fillOpacity="0.1"/>
    <path d="M30 70L50 30L70 70H30Z" stroke="currentColor" strokeWidth="4" fill="none"/>
    <circle cx="50" cy="45" r="8" fill="currentColor"/>
  </svg>
);

const PDFjsLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.04C12.95,9 12.03,12.16 12.03,12.16C12.42,13.65 14.05,14.72 14.05,14.72C14.55,14.57 17.4,14.24 17,15.72C16.57,17.2 13.5,15.81 13.5,15.81C11.55,15.95 10.09,16.47 10.09,16.47C8.96,18.58 7.64,19.5 7.1,18.61C6.43,17.5 9.23,16.07 9.23,16.07C10.68,13.72 10.92,12.31 10.92,12.31Z"/>
  </svg>
);

const CloudflareLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 15.75h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5zM19.5 12a3.75 3.75 0 00-3.375-3.728A4.5 4.5 0 007.5 9c0 .19.012.378.035.563A3 3 0 006 15h12a3 3 0 001.5-5.625z"/>
  </svg>
);

const MUILogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.55 0 1-.45 1-1s-.45-1-1-1h-1V9c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H8c-1.1 0-2 .9-2 2v2H3c-.55 0-1 .45-1 1s.45 1 1 1zm7-8h4v2h-4V5zm-2 4h12v11H6V9h2z"/>
  </svg>
);

const NextJSLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z"/>
  </svg>
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
    name: 'PDF.js',
    logo: <PDFjsLogo />,
    description: 'Mozilla\'s PDF renderer enables in-browser document viewing with navigation, zoom, and seamless integration with training materials and policy documents.',
    color: '#EF4444',
    url: 'https://mozilla.github.io/pdf.js/',
  },
  {
    name: 'Cloudflare Stream',
    logo: <CloudflareLogo />,
    description: 'Enterprise-grade video infrastructure for training videos. Adaptive bitrate, global CDN delivery, and secure signed URLs protect your proprietary content.',
    color: '#F97316',
    url: 'https://www.cloudflare.com/products/cloudflare-stream/',
  },
  {
    name: 'Material UI',
    logo: <MUILogo />,
    description: 'Google\'s Material Design system provides accessible, consistent UI components. Dark mode, responsive layouts, and beautiful dashboards for administrators.',
    color: '#0284C7',
    url: 'https://mui.com',
  },
  {
    name: 'Next.js',
    logo: <NextJSLogo />,
    description: 'React framework with server-side rendering and optimized builds. Fast page loads and secure architecture for enterprise deployments.',
    color: '#171717',
    url: 'https://nextjs.org',
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
