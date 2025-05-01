'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = () => {
  const { t } = useLanguage();

  return (
    <nav className="w-full max-w-4xl mx-auto mt-8">
      <div className="space-y-6">
        {/* Party Quest Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">{t('navigation.partyQuest.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <Link href="/party-quest/kerning" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors">
              {t('navigation.partyQuest.kerning')}
            </Link>
            <Link href="/party-quest/ludibrium"
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors">
              {t('navigation.partyQuest.ludibrium')}
            </Link> */}
            <Link href="/party-quest/orbis"
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors">
              {t('navigation.partyQuest.orbis')}
            </Link>
          </div>
        </div>

        {/* Scroll Section */}
        {/* <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">{t('navigation.scroll.title')}</h2>
          <div>
            <Link href="/scroll"
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg inline-block transition-colors">
              {t('navigation.scroll.calculator')}
            </Link>
          </div>
        </div> */}
      </div>
    </nav>
  );
};

export default Navigation; 