'use client';
import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useWarp } from '../../../components/shared-theme/WarpTransition';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const MotionBox = motion.create(Box);

// Floating particles for background - using deterministic values to avoid hydration mismatch
const particles = [
  { id: 0, size: 5, x: 12, y: 8, duration: 22, delay: 1 },
  { id: 1, size: 3, x: 85, y: 15, duration: 18, delay: 3 },
  { id: 2, size: 7, x: 45, y: 25, duration: 25, delay: 0 },
  { id: 3, size: 4, x: 72, y: 42, duration: 20, delay: 2 },
  { id: 4, size: 6, x: 28, y: 65, duration: 23, delay: 4 },
  { id: 5, size: 3, x: 92, y: 78, duration: 17, delay: 1 },
  { id: 6, size: 5, x: 8, y: 55, duration: 21, delay: 3 },
  { id: 7, size: 4, x: 55, y: 88, duration: 19, delay: 2 },
  { id: 8, size: 6, x: 38, y: 12, duration: 24, delay: 0 },
  { id: 9, size: 3, x: 68, y: 95, duration: 16, delay: 4 },
  { id: 10, size: 5, x: 15, y: 35, duration: 22, delay: 1 },
  { id: 11, size: 4, x: 82, y: 52, duration: 20, delay: 3 },
  { id: 12, size: 7, x: 48, y: 72, duration: 26, delay: 2 },
  { id: 13, size: 3, x: 25, y: 18, duration: 18, delay: 0 },
  { id: 14, size: 6, x: 95, y: 38, duration: 23, delay: 4 },
  { id: 15, size: 4, x: 5, y: 82, duration: 19, delay: 1 },
  { id: 16, size: 5, x: 62, y: 5, duration: 21, delay: 3 },
  { id: 17, size: 3, x: 35, y: 48, duration: 17, delay: 2 },
  { id: 18, size: 6, x: 78, y: 68, duration: 24, delay: 0 },
  { id: 19, size: 4, x: 18, y: 92, duration: 20, delay: 4 },
];

// Mock dashboard stats for the floating preview
const mockStats = [
  { label: 'Active Employees', value: '2,847', trend: '+12%', color: '#10B981' },
  { label: 'Courses Completed', value: '15,392', trend: '+8%', color: '#3B82F6' },
  { label: 'Certification Rate', value: '94%', trend: '+5%', color: '#8B5CF6' },
];

// Mock training programs
const mockClassrooms = [
  { name: 'Call Center Excellence', students: 126, color: '#667eea' },
  { name: 'Sales Fundamentals', students: 84, color: '#f093fb' },
  { name: 'Compliance Training', students: 215, color: '#4facfe' },
];

// Warp button component for navigation
function WarpButton({ href }: { href: string }) {
  const { warpTo } = useWarp();
  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => warpTo(href)}
      endIcon={<ArrowForwardRoundedIcon />}
      sx={{
        py: 1.5,
        px: 4,
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: `0 8px 24px ${alpha('#667eea', 0.4)}`,
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
          boxShadow: `0 12px 32px ${alpha('#667eea', 0.5)}`,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      Get Started Free
    </Button>
  );
}

export default function Hero() {
  const theme = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Box
      ref={containerRef}
      id="hero"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        pt: { xs: 12, sm: 16 },
        pb: { xs: 8, sm: 12 },
        // Space background for dark, sky/cloud for light
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #000000 0%, #020617 50%, #0a0a1a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
      }}
    >
      {/* Animated gradient background - nebula effects */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: theme.palette.mode === 'dark'
            ? `
              radial-gradient(ellipse 100% 80% at 50% -20%, ${alpha(theme.palette.primary.main, 0.35)} 0%, transparent 50%),
              radial-gradient(ellipse 60% 50% at 100% 30%, ${alpha('#8B5CF6', 0.25)} 0%, transparent 50%),
              radial-gradient(ellipse 60% 50% at 0% 70%, ${alpha('#EC4899', 0.2)} 0%, transparent 50%)
            `
            : `
              radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 100% 50%, ${alpha('#8B5CF6', 0.06)} 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 0% 80%, ${alpha('#EC4899', 0.05)} 0%, transparent 50%)
            `,
          zIndex: 0,
        }}
      />

      {/* Floating particles - twinkling stars */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {particles.map((particle) => (
          <MotionBox
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            sx={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.light, 0.4)
                : alpha(theme.palette.primary.main, 0.3),
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div style={{ y, opacity }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 6, lg: 8 }}
            alignItems="center"
          >
            {/* Left content */}
            <Box sx={{ flex: 1, maxWidth: { lg: '55%' } }}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Chip
                  icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
                  label="Your Private Internal Training Platform"
                  size="small"
                  sx={{
                    mb: 3,
                    py: 2,
                    px: 0.5,
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '& .MuiChip-icon': {
                      color: 'primary.main',
                    },
                  }}
                />
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #fff 0%, #94A3B8 50%, #fff 100%)'
                      : 'linear-gradient(135deg, #1E293B 0%, #475569 50%, #1E293B 100%)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s ease-in-out infinite',
                    '@keyframes shimmer': {
                      '0%, 100%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                    },
                  }}
                >
                  Your Organization's{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #EC4899 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Private Internal Training Platform
                  </Box>
                </Typography>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: 540,
                  }}
                >
                  AO Launchpad gives you complete control over your private internal training. 
                  Create proprietary courses, certifications, and assessments—all private 
                  to your organization with enterprise-grade security.
                </Typography>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <WarpButton href="/signup" />
                  <Link href="/about" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrowRoundedIcon />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </Stack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" gap={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessRoundedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Trusted by enterprises worldwide
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                          '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      99.9% uptime
                    </Typography>
                  </Stack>
                </Stack>
              </MotionBox>
            </Box>

            {/* Right content - Dashboard Preview */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, maxWidth: { lg: '45%' } }}>
              <MotionBox
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{ perspective: 1000 }}
              >
                {/* Mock Dashboard Container */}
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                      ? alpha('#fff', 0.1)
                      : alpha('#000', 0.08),
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha('#1E293B', 0.9)} 0%, ${alpha('#0F172A', 0.95)} 100%)`
                      : `linear-gradient(135deg, ${alpha('#fff', 0.95)} 0%, ${alpha('#F8FAFC', 0.98)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 25px 50px -12px ${alpha('#000', 0.5)}, 0 0 0 1px ${alpha('#fff', 0.05)}`
                      : `0 25px 50px -12px ${alpha('#000', 0.15)}, 0 0 0 1px ${alpha('#000', 0.02)}`,
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                    transformStyle: 'preserve-3d',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(-2deg) rotateX(1deg) translateY(-8px)',
                    },
                    transition: 'transform 0.5s ease',
                  }}
                >
                  {/* Window controls */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      p: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {['#EF4444', '#F59E0B', '#10B981'].map((color, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: color,
                        }}
                      />
                    ))}
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 2,
                        color: 'text.secondary',
                        fontFamily: 'monospace',
                      }}
                    >
                      AO Launchpad Dashboard
                    </Typography>
                  </Box>

                  {/* Dashboard content */}
                  <Box sx={{ p: 3 }}>
                    {/* Stats row */}
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      {mockStats.map((stat, i) => (
                        <MotionBox
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: alpha(stat.color, 0.05),
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {stat.label}
                          </Typography>
                          <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="h6" fontWeight={700}>
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: stat.color, fontWeight: 600 }}
                            >
                              {stat.trend}
                            </Typography>
                          </Stack>
                        </MotionBox>
                      ))}
                    </Stack>

                    {/* Training program cards */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      Training Programs
                    </Typography>
                    <Stack spacing={1.5}>
                      {mockClassrooms.map((classroom, i) => (
                        <MotionBox
                          key={classroom.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: alpha(classroom.color, 0.05),
                              borderColor: alpha(classroom.color, 0.3),
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${classroom.color} 0%, ${alpha(classroom.color, 0.7)} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <BusinessRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {classroom.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {classroom.students} employees enrolled
                            </Typography>
                          </Box>
                          <ArrowForwardRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        </MotionBox>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                {/* Floating decorative elements */}
                <MotionBox
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 10px 30px ${alpha('#667eea', 0.4)}`,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
                </MotionBox>
              </MotionBox>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
