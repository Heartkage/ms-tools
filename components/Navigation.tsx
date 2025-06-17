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
            <div className="flex flex-col items-center">
              <span className="text-altText-primary text-sm text-bold mb-1">{t('navigation.partyQuest.ludibriumLevel')}</span>
              <Link href="/party-quest/ludibrium"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors w-full">
                {t('navigation.partyQuest.ludibrium')}
              </Link>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-altText-primary text-sm text-bold mb-1">{t('navigation.partyQuest.orbisLevel')}</span>
              <Link href="/party-quest/orbis"
                className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors w-full">
                {t('navigation.partyQuest.orbis')}
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-altText-primary text-sm text-bold mb-1">{t('navigation.partyQuest.rjLevel')}</span>
              <Link href="/party-quest/rj"
                className="bg-purple-400 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors w-full">
                {t('navigation.partyQuest.rj')}
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">{t('navigation.tools.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/rjtool"
              className="bg-purple-400 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors">
              {t('navigation.tools.rjtool')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 