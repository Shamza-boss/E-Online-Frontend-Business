'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import TechStack from '../components/TechStack';
import Highlights from '../components/Highlights';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import AppTheme from '../../shared-theme/AppTheme';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Features />
        <Divider />
        <TechStack />
        <Highlights />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
