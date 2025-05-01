import React from 'react';
import Navigation from '../../components/Navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  
  return (
    <main className="min-h-screen p-8">
      <LanguageSwitcher />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t('title')}
        </h1>
        <Navigation />
      </div>
    </main>
  );
} 