'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-interactive hover:bg-interactive-hover text-altText-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
    >
      {language === 'en' ? '中文' : 'English'}
    </button>
  );
};

export default LanguageSwitcher; 