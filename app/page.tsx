'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  const { t, language } = useLanguage();

  useEffect(() => {
    // Clear the Orbis party quest selection state when returning to home page
    localStorage.removeItem('orbis_pq_selection');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-28 min-h-[100vh] flex flex-col items-center justify-top">
        <div className="flex flex-col items-center justify-center text-center space-y-12 w-[90%]">
          <div>
            <h3 className="text-5xl font-bold text-altText-primary mb-2">{t('title')}</h3>
            <p className="text-xl text-altText-secondary mb-6 max-w-xl mx-auto">{t('description')}</p>
          </div>

          {/* Party Quest Section */}
          <div className="w-full max-w-2xl flex flex-col items-center space-y-4 border-b border-white/10 pb-12">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 7a3 3 0 116 0 3 3 0 01-6 0zM7 14a6 6 0 00-6 6h12a6 6 0 00-6-6z"/>
                  <path d="M15 7a3 3 0 116 0 3 3 0 01-6 0zM18 14a6 6 0 00-6 6h12a6 6 0 00-6-6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">{t('navigation.partyQuest.title')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full justify-center">
              <Link href="/party-quest/ludibrium" className="flex flex-col items-center px-4 py-4 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-semibold shadow transition-all text-center border border-yellow-300">
                <span className="text-lg font-bold mb-1">{t('navigation.partyQuest.ludibrium')}</span>
                <span className="text-xs font-medium">{t('navigation.partyQuest.ludibriumLevel')}</span>
              </Link>
              <Link href="/party-quest/orbis" className="flex flex-col items-center px-4 py-4 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition-all text-center border border-blue-300">
                <span className="text-lg font-bold mb-1">{t('navigation.partyQuest.orbis')}</span>
                <span className="text-xs font-medium">{t('navigation.partyQuest.orbisLevel')}</span>
              </Link>
            </div>
          </div>

          {/* Tools Section */}
          <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">{t('navigation.tools.title')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full justify-center">
              <Link href="/rjtool" className="flex flex-col items-center px-4 py-4 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold shadow transition-all text-center border border-purple-300">
                <span className="text-lg font-bold mb-1">{t('navigation.tools.rjtool')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:flex flex-wrap justify-center gap-4 sm:gap-32"> 
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t('navigation.contact.title')}</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-300">{t('navigation.contact.email')}: <a href="mailto:heartkage@gmail.com" className="underline hover:text-blue-500 transition-colors">heartkage@gmail.com</a></li>
                <li className="text-gray-300">{t('navigation.contact.form')}: <a href={language === 'zh' ? 'https://forms.gle/hFTrDyRgRDfDvrU79' : 'https://forms.gle/wj9Jw8DGQkV7LonX9'} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">{t('navigation.contact.suggestions')}</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t('navigation.otherLinks')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-300 hover:text-blue-500 transition-colors">{t('privacy.title')}</Link></li>
                {/* <li><Link href="/terms" className="text-gray-300 hover:text-blue-500 transition-colors">Terms of Service</Link></li> */}
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/10 mt-7 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 MSTools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 