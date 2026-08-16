import React from 'react';
import '@/index.css';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-100/60 to-cyan-50/50 selection:bg-blue-500/20 text-slate-900 transition-colors duration-500">
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
};

export default Landing;