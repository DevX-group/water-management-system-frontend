import React from 'react';
import '@/index.css';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#e0f0ff] dark:bg-background text-foreground selection:bg-blue-500/20 transition-colors duration-500 relative">
      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher variant="outline" size="sm" className="shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-md" />
      </div>

      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
};

export default Landing;