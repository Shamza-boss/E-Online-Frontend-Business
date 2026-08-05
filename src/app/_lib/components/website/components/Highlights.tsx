'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

type HighlightItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const highlights: HighlightItem[] = [
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Complete Privacy & Security',
    description:
      'Your training content stays private to your organization. Enterprise-grade encryption, secure authentication, and role-based access control at every level.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: <SpeedRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Blazing Fast Performance',
    description:
      'Built on Next.js with server-side rendering, edge functions, and Cloudflare CDN. Pages load instantly for employees anywhere in the world.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <DevicesRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Train from Any Device',
    description:
      'Responsive design that adapts beautifully to desktops, tablets, and phones. Employees can complete training from the office or on the go.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <TuneRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Adapts to Your Structure',
    description:
      'From startups to enterprises—AO Launchpad adapts to your org chart with customizable departments, teams, roles, and training tracks.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <SupportAgentRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Dedicated Support',
    description:
      'We partner with your L&D team from day one. Setup, content migration, admin training—we\'re invested in your success.',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Built to Scale',
    description:
      'Start with 50 employees or 50,000. Our infrastructure handles growth seamlessly with Railway and Cloudflare powering every request.',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Highlights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="highlights"
      sx={{
        py: { xs: 10, sm: 16 },
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)'
          : 'linear-gradient(180deg, #1E293B 0%, #334155 100%)',
      }}
    >
      {/* Animated background mesh */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background: `
            radial-gradient(circle at 20% 80%, ${alpha('#667eea', 0.15)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha('#EC4899', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${alpha('#8B5CF6', 0.1)} 0%, transparent 40%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Grid lines */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${alpha('#fff', 0.02)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha('#fff', 0.02)} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, sm: 10 },
          }}
        >
          <Typography
            component="span"
            variant="overline"
            sx={{
              color: alpha('#fff', 0.7),
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block',
            }}
          >
            Why Choose AO Launchpad
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#fff',
            }}
          >
            Built for Enterprise Training
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.7),
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Every decision we made—from the technologies we chose to the features we built—was
            designed to give L&D teams and employees the best possible training experience.
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
          {highlights.map((item) => (
            <MotionCard
              key={item.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 },
              }}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
                background: alpha('#fff', 0.03),
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha('#fff', 0.2),
                  background: alpha('#fff', 0.05),
                  '& .highlight-icon': {
                    transform: 'scale(1.1)',
                  },
                  '& .highlight-glow': {
                    opacity: 0.15,
                  },
                },
              }}
            >
              {/* Background glow on hover */}
              <Box
                className="highlight-glow"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: item.gradient,
                  opacity: 0,
                  filter: 'blur(40px)',
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              />

              <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  className="highlight-icon"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: item.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#fff', 0.7),
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </Typography>
              </Stack>
            </MotionCard>
          ))}
        </MotionBox>
      </Container>
    </Box>
  );
}
