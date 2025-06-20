'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <Header hasBackButton={true} />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-8">{t('privacy.title')}</h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.section1.title')}</h2>
                <p className="mb-3">
                  {t('privacy.section1.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{t('privacy.section1.languagePreference')}</strong></li>
                  <li><strong>{t('privacy.section1.data')}</strong></li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.section2.title')}</h2>
                <p className="mb-3">{t('privacy.section2.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('privacy.section2.providing')}</li>
                  <li>{t('privacy.section2.improving')}</li>
                  <li>{t('privacy.section2.responding')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.section3.title')}</h2>
                <p className="mb-3">
                  {t('privacy.section3.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('privacy.section3.localStorage')}</li>
                  <li>{t('privacy.section3.noServerStorage')}</li>
                  <li>{t('privacy.section3.clearData')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.section4.title')}</h2>
                <p className="mb-3">
                  {t('privacy.section4.description')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.section5.title')}</h2>
                <p className="mb-3">
                  {t('privacy.section5.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li className="text-gray-300">{t('privacy.section5.email')} <a href="mailto:heartkage@gmail.com" className="text-blue-400 hover:text-blue-300 underline">heartkage@gmail.com</a></li>
                  <li className="text-gray-300">{t('privacy.section5.feedbackForm')} <a href={language === 'zh' ? 'https://forms.gle/hFTrDyRgRDfDvrU79' : 'https://forms.gle/wj9Jw8DGQkV7LonX9'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">{t('privacy.section5.submitFeedback')}</a></li>
                </ul>
              </section>

              <div className="border-t border-white/10 pt-6 mt-8">
                <p className="text-sm text-gray-400">
                  <strong>{t('privacy.lastUpdated')}</strong> June 20, 2025
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link 
                href="/" 
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t('privacy.backToHome')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 