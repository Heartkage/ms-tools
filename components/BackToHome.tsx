'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const BackToHome = () => {
  const { t } = useLanguage();

  return (
    <Link href="/" className="text-blue-500 hover:text-blue-600 inline-block text-sm sm:text-base">
      {t('pages.backToHome')}
    </Link>
  );
};

export default BackToHome; 