'use client';

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ScrollSimulator() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          {t('pages.backToHome')}
        </Link>
        <h1 className="text-4xl font-bold mb-8">{t('pages.scroll.title')}</h1>
        {/* Simulator content will be added here */}
      </div>
    </main>
  )
} 