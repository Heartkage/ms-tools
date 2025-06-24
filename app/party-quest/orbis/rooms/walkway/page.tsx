'use client';

import { useLanguage } from '../../../../../contexts/LanguageContext';
import Link from 'next/link';
import { roomConfig } from '../../constants';

export default function WalkwayRoom() {
  const { t } = useLanguage();

  return (
    <div className="">
      {/* Walkway Room Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border pt-4 px-4 flex flex-col overflow-hidden">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
        </div>
        
        {/* Skybox */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

        {/* Title */}
        <div className="relative z-10 text-text-primary font-semibold text-center mb-8">
          <div className="text-2xl">{t('pages.orbisPQ.rooms.walkway.title')}</div>
          <div className="text-sm text-text-secondary mt-1">{t('pages.orbisPQ.rooms.walkway.collectPieces')}</div>
        </div>

        {/* Platform Grid */}
        <div className="relative flex justify-center space-x-8 sm:space-x-32 z-10">
          {/* Left Column */}
          <div className="flex flex-col space-y-8">
            {[5, 3, 7].map((number, index) => (
              <div key={`left-${index}`} className="relative">
                <div className="h-8 w-8 text-text-primary flex items-center justify-center text-lg font-bold mb-2 mx-auto">
                  {number}
                </div>
                <div className="h-6 w-28 sm:w-48 bg-platform rounded-md shadow-lg"></div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8">
            {[5, 5, 5].map((number, index) => (
              <div key={`right-${index}`} className="relative">
                <div className="h-8 w-8 text-text-primary flex items-center justify-center text-lg font-bold mb-2 mx-auto">
                  {number}
                </div>
                <div className="h-6 w-28 sm:w-48 bg-platform rounded-md shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Exit */}
        <Link 
          href="/party-quest/orbis"
          className="relative mt-10 w-24 h-24 left-1/2 -translate-x-1/2 bg-gradient-to-b from-door-exit to-door-exit-hover rounded-t-md flex flex-col items-center justify-center hover:from-door-exit-hover hover:to-door-exit-active transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 z-10"
        >
          <span className="text-altText-primary font-semibold">{t('pages.orbisPQ.rooms.common.exit')}</span>
          <span className="text-altText-secondary text-xxs text-center font-semibold mt-1">{t('pages.orbisPQ.rooms.common.transferWarning')}</span>
        </Link>
      </div>

      {/* Info Container */}
      <div className="relative max-w-2xl mx-auto mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
        </div>
        
        {/* Skybox */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="text-text-primary font-semibold">{t('common.recommend')}</div>
          <ul className="list-disc list-inside space-y-1 font-semibold text-xs text-text-secondary">
            <li>{t('common.players')}: {roomConfig["walkway"].players}</li>
            {roomConfig["walkway"].jobs && (
              <li>{t('common.jobsOrType')}: {roomConfig["walkway"].jobs.map(job => t(job)).join(', ')}</li>
            )}
            {roomConfig["walkway"].types && (
              <li>{t('common.types')}: {roomConfig["walkway"].types.map(type => t(type)).join(', ')}</li>
            )}
            {roomConfig["walkway"].skills && (
              <li>{t('common.skills')}: {roomConfig["walkway"].skills.map(skill => t(skill)).join(', ')}</li>
            )}
          </ul>
        </div>
      </div>

      {/* Tips Container */}
      <div className="relative max-w-2xl mx-auto mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
        </div>
        
        {/* Skybox */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

        <div className="relative z-10">
          <p className="text-status-warning font-semibold text-xs">
            {t('pages.orbisPQ.rooms.walkway.tip')}
          </p>
        </div>
      </div>
    </div>
  );
} 