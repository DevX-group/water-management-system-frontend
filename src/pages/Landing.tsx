import React from 'react';
import '@/index.css';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#e0f0ff] dark:bg-background text-foreground selection:bg-blue-500/20 transition-colors duration-500">
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
};

export default Landing;