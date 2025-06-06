'use client';

import { useLanguage } from '../../../../../contexts/LanguageContext';
import { roomConfig } from '../../constants';

export default function OrbisPQEntrance() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-altText-primary mb-2">
          {t('pages.orbisPQ.rooms.entrance.title')}
        </h1>
        <h2 className="text-sm font-bold text-altText-secondary">
          {t('pages.orbisPQ.rooms.entrance.collectClouds')}
        </h2>
      </div>

      {/* Info Container */}
      <div className="relative max-w-4xl w-full mx-auto px-4">
        <div className="relative mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
            <div className="text-text-primary font-semibold text-sm sm:text-base">{t('common.recommend')}</div>
            <ul className="list-disc list-inside space-y-1 font-semibold text-xs sm:text-sm text-text-secondary">
              <li>{t('common.players')}: {roomConfig["entrance"].players}</li>
              {roomConfig["entrance"].jobs && (
                <li>{t('common.jobs')}: {roomConfig["entrance"].jobs.map(job => t(job)).join(', ')}</li>
              )}
              {roomConfig["entrance"].types && (
                <li>{t('common.types')}: {roomConfig["entrance"].types.map(type => t(type)).join(', ')}</li>
              )}
              {roomConfig["entrance"].skills && (
                <li>{t('common.skills')}: {roomConfig["entrance"].skills.map(skill => t(skill)).join(', ')}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Tips Container */}
      <div className="relative max-w-4xl w-full mx-auto px-4">
        <div className="relative mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
            <p className="text-status-warning font-semibold text-sm">
              {t('pages.orbisPQ.rooms.entrance.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 