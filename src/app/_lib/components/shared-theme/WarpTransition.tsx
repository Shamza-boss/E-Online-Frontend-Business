'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type WarpContextType = {
  warpTo: (href: string, opts?: { direction?: 'right' | 'default' }) => void;
  isWarping: boolean;
}

const WarpContext = createContext<WarpContextType | null>(null);

export function useWarp() {
  const context = useContext(WarpContext);
  if (!context) {
    throw new Error('useWarp must be used within WarpTransitionProvider');
  }
  return context;
}

// Generate random stars for the warp effect
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 0.3,
  }));
}

const stars = generateStars(60);

export function WarpTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isWarping, setIsWarping] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'warp-out' | 'warp-in'>('idle');
  const [direction, setDirection] = useState<'right' | 'default'>('default');

  const warpTo = useCallback((href: string, opts?: { direction?: 'right' | 'default' }) => {
    if (isWarping) return;
    setIsWarping(true);
    setDirection(opts?.direction || 'default');
    setPhase('warp-out');
    setTimeout(() => {
      router.push(href as unknown as any);
      setPhase('warp-in');
      setTimeout(() => {
        setPhase('idle');
        setIsWarping(false);
        setDirection('default');
      }, 400);
    }, 500);
  }, [router, isWarping]);

  return (
    <WarpContext.Provider value={{ warpTo, isWarping }}>
      {children}
      
      {/* Warp overlay */}
      {phase !== 'idle' && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Dark overlay with zoom blur */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: isDark ? '#000' : '#fff',
              animation: phase === 'warp-out' 
                ? 'warpFadeIn 0.5s ease-out forwards'
                : 'warpFadeOut 0.4s ease-in forwards',
              '@keyframes warpFadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
              },
              '@keyframes warpFadeOut': {
                '0%': { opacity: 1 },
                '100%': { opacity: 0 },
              },
            }}
          />

          {/* Radial light burst from center */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200vmax',
              height: '200vmax',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, transparent 50%)`,
              animation: phase === 'warp-out'
                ? 'burstExpand 0.5s ease-out forwards'
                : 'burstContract 0.4s ease-in forwards',
              '@keyframes burstExpand': {
                '0%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(0)',
                },
                '50%': {
                  opacity: 1,
                },
                '100%': { 
                  opacity: 0.3,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
              },
              '@keyframes burstContract': {
                '0%': { 
                  opacity: 0.3,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
                '100%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(0)',
                },
              },
            }}
          />

          {/* Streaking stars */}
          {stars.map((star) => (
            <Box
              key={star.id}
              sx={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                borderRadius: '50%',
                backgroundColor: isDark ? '#fff' : theme.palette.primary.main,
                boxShadow: isDark 
                  ? `0 0 ${star.size * 2}px ${star.size}px rgba(255,255,255,0.5)`
                  : `0 0 ${star.size * 2}px ${star.size}px ${alpha(theme.palette.primary.main, 0.5)}`,
                animation: phase === 'warp-out'
                  ? direction === 'right'
                    ? `starStreakRight 0.5s ease-in forwards`
                    : `starStreak 0.5s ease-in forwards`
                  : direction === 'right'
                    ? `starUnstreakRight 0.4s ease-out forwards`
                    : `starUnstreak 0.4s ease-out forwards`,
                animationDelay: `${star.delay}s`,
                '@keyframes starStreak': {
                  '0%': { 
                    opacity: 1,
                    transform: 'translateX(0) scaleX(1)',
                  },
                  '100%': { 
                    opacity: 0,
                    transform: `translateX(${(star.x - 50) * 3}vw) scaleX(20)`,
                  },
                },
                '@keyframes starUnstreak': {
                  '0%': { 
                    opacity: 0,
                    transform: `translateX(${(star.x - 50) * -3}vw) scaleX(20)`,
                  },
                  '100%': { 
                    opacity: 1,
                    transform: 'translateX(0) scaleX(1)',
                  },
                },
                '@keyframes starStreakRight': {
                  '0%': { opacity: 1, transform: 'translateX(0) scaleX(1)' },
                  '100%': { opacity: 0, transform: `translateX(60vw) scaleX(20)` },
                },
                '@keyframes starUnstreakRight': {
                  '0%': { opacity: 0, transform: `translateX(-60vw) scaleX(20)` },
                  '100%': { opacity: 1, transform: 'translateX(0) scaleX(1)' },
                },
              }}
            />
          ))}

          {/* Center glow pulse */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 100,
              height: 100,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.8)} 0%, transparent 70%)`,
              filter: 'blur(20px)',
              animation: phase === 'warp-out'
                ? 'centerPulse 0.5s ease-out forwards'
                : 'centerPulseReverse 0.4s ease-in forwards',
              '@keyframes centerPulse': {
                '0%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(0)',
                },
                '50%': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(3)',
                },
                '100%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(10)',
                },
              },
              '@keyframes centerPulseReverse': {
                '0%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(10)',
                },
                '50%': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(3)',
                },
                '100%': { 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(0)',
                },
              },
            }}
          />
        </Box>
      )}
    </WarpContext.Provider>
  );
}

// WarpLink component for easy use
type WarpLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function WarpLink({ href, children, onClick, ...props }: WarpLinkProps) {
  const { warpTo } = useWarp();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    warpTo(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
