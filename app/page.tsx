'use client';

import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Clear the Orbis party quest selection state when returning to home page
    localStorage.removeItem('orbis_pq_selection');
  }, []);
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
          {t('title')}
        </h1>
        <Navigation />
      </div>
    </main>
  );
} 