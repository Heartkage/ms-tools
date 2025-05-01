'use client';

import { useLanguage } from '../../../../../contexts/LanguageContext';
import Link from 'next/link';
import { useState } from 'react';
import { roomConfig } from '../../constants';

export default function LoungeRoom() {
  const { t } = useLanguage();
  const [toggleStates, setToggleStates] = useState<number[][]>([
    [0, 0, 0, 0], // First row
    [0, 0, 0, 0], // Second row
  ]);

  const handleToggle = (rowIndex: number, toggleIndex: number) => {
    setToggleStates(prev => {
      const newStates = [...prev];
      newStates[rowIndex] = newStates[rowIndex].map((_, i) => i === toggleIndex ? (newStates[rowIndex][i] === 1 ? 0 : 1) : 0);
      return newStates;
    });
  };

  return (
    <div className="min-h-screen pt-2 px-8">
      {/* Lounge Room Container */}
      <div className="relative max-w-xl bg-gradient-to-b from-black/0 to-black/10 pb-8 mx-auto flex flex-col space-y-10 shadow-xl -mt-6">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor animate-pulse"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Title */}
        <div className="relative z-0">
          <h1 className="text-white/90 font-bold text-3xl text-center mb-2">{t('orbisPQ.rooms.lounge.title')}</h1>
          <h3 className="text-white/60 text-sm text-center mb-2">{t('orbisPQ.rooms.lounge.collect40Pieces')}</h3>
          <div className="h-1 w-3/4 bg-room mx-auto rounded-full"></div>
        </div>

        {/* Room 303 */}
        <div className="relative z-20 transform hover:scale-[1.02] transition-transform duration-300">
          {/* Roof semicircle */}
          <div className="mx-auto transform w-24 h-12 bg-door-dark rounded-t-full pt-2"></div>
          <div className="w-24 h-24 bg-gradient-to-b from-door-dark to-door-dark-bottom flex flex-col items-center justify-top mx-auto p-2">
            <h3 className="text-altText-primary font-semibold text-sm text-center">{t('orbisPQ.rooms.lounge.room303')}</h3>
            <div className="text-center mt-2 space-y-1">
              <p className="text-altText-secondary text-xs">0/10 {t('orbisPQ.rooms.lounge.pieces')}</p>
            </div>
          </div>
          <div className="h-1 w-2/3 bg-room-floor mx-auto rounded-full"></div>
        </div>

        {/* Room 302 */}
        <div className="relative z-20 transform hover:scale-[1.02] transition-transform duration-300">
          {/* Roof semicircle */}
          <div className="mx-auto transform w-24 h-12 bg-door-dark rounded-t-full pt-2"></div>
          <div className="w-24 h-24 bg-gradient-to-b from-door-dark to-door-dark-bottom flex flex-col items-center justify-top mx-auto">
            <h3 className="text-altText-primary font-semibold text-sm text-center">{t('orbisPQ.rooms.lounge.room302')}</h3>
            <div className="text-center mt-2 space-y-1">
              <p className="text-altText-secondary text-xs">0/10 {t('orbisPQ.rooms.lounge.pieces')}</p>
              <p className="text-altText-tertiary text-xxs">({t('orbisPQ.rooms.lounge.weaponAttack')})</p>
            </div>
          </div>
          <div className="h-1 w-2/3 bg-room-floor mx-auto rounded-full"></div>
        </div>

        {/* Toggle Section */}
        <div className="relative z-20 rounded-lg hidden">
          <div className="space-y-2">
            {toggleStates.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-center">
                <div className="flex flex-row gap-6">
                  {row.map((state, toggleIndex) => {
                    const platformNumber = 4 - toggleIndex;
                    return (
                      <button
                        key={toggleIndex}
                        onClick={() => handleToggle(rowIndex, toggleIndex)}
                        className={`w-14 h-6 rounded-md transition-all duration-300 ${
                          state === 1 
                            ? 'bg-blue-700 text-white shadow-lg' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        <span className="text-sm font-medium">{platformNumber}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room 301 */}
        <div className="relative z-20 transform hover:scale-[1.02] transition-transform duration-300">
          {/* Roof semicircle */}
          <div className="mx-auto transform w-24 h-12 bg-door-dark rounded-t-full pt-2"></div>
          <div className="w-24 h-24 bg-gradient-to-b from-door-dark to-door-dark-bottom flex flex-col items-center justify-top mx-auto">
            <h3 className="text-altText-primary font-semibold text-sm text-center">{t('orbisPQ.rooms.lounge.room301')}</h3>
            <div className="text-center mt-2 space-y-1">
              <p className="text-altText-secondary text-xs">0/10 {t('orbisPQ.rooms.lounge.pieces')}</p>
              <p className="text-altText-tertiary text-xxs">({t('orbisPQ.rooms.lounge.magicAttack')})</p>
            </div>
          </div>
          <div className="h-1 w-2/3 bg-room-floor mx-auto rounded-full"></div>
        </div>

        {/* Jump Requirement */}
        <div className="relative z-20 text-center">
          <p className="text-status-hint font-semibold text-md">{t('orbisPQ.rooms.lounge.jumpRequirement')}</p>
        </div>

        {/* Exit */}
        <div className="relative z-20 overflow-hidden">
          <Link 
            href="/party-quest/orbis"
            className="relative w-24 h-32 bg-gradient-to-b from-door-exit to-door-exit-hover rounded-t-md flex flex-col items-center justify-center hover:from-door-exit-hover hover:to-door-exit-active transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl mx-auto transform hover:scale-105"
          >
            <span className="text-altText-primary font-semibold">{t('orbisPQ.rooms.common.exit')}</span>
          </Link>
          <div className="relative z-30 h-1 w-2/3 bg-room-floor mx-auto rounded-full"></div>
        </div>

        {/* Room 304 - Dark Room */}
        <div className="relative z-20 transform hover:scale-[1.02] transition-transform duration-300 pt-6">
          <Link href="lounge/room/304">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-door-dark to-door-dark-bottom flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-altText-tertiary hover:shadow-md">
                <span className="text-altText-primary font-bold text-sm">{t('orbisPQ.rooms.lounge.room304')}</span>
                <span className="text-altText-secondary text-xs mt-1 text-center">0/10 {t('orbisPQ.rooms.lounge.pieces')}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Info Container */}
      <div className="relative max-w-lg mx-auto mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
            <li>{t('common.players')}: {roomConfig["lounge"].players}</li>
            {roomConfig["lounge"].jobs && (
              <li>{t('common.jobs')}: {roomConfig["lounge"].jobs.map(job => t(job)).join(', ')}</li>
            )}
            {roomConfig["lounge"].types && (
              <li>{t('common.types')}: {roomConfig["lounge"].types.map(type => t(type)).join(', ')}</li>
            )}
            {roomConfig["lounge"].skills && (
              <li>{t('common.skills')}: {roomConfig["lounge"].skills.map(skill => t(skill)).join(', ')}</li>
            )}
          </ul>
        </div>
      </div>

      {/* Tips Container */}
      <div className="relative max-w-lg mx-auto mt-8 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
          <p className="text-status-warning text-xs">
            {t('orbisPQ.rooms.lounge.tip')}
          </p>
        </div>
      </div>

    </div>
  );
} 