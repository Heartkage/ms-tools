'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { roomConfig } from '../../constants';
import { copyToClipboard } from '../../../../../lib/utils/clipboard';

// Define pot states
type PotState = 'empty' | 'blackFlower' | 'pinkFlower' | 'bossPot' | 'obstacle';

// Define platform type
type Platform = {
  pots: PotState[];
};

export default function GardenRoom() {
  const { t, tHtml } = useLanguage();
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize platforms with empty pots
  const [platforms, setPlatforms] = useState<Platform[]>([
    { pots: ['empty', 'obstacle', 'obstacle'] }, // Left column, top platform
    { pots: ['empty', 'obstacle', 'empty'] }, // Left column, middle platform
    { pots: ['obstacle', 'empty', 'obstacle'] }, // Left column, bottom platform
    { pots: ['obstacle', 'empty', 'obstacle'] }, // Right column, top platform
    { pots: ['empty', 'empty', 'obstacle'] }, // Right column, middle platform
    { pots: ['empty', 'obstacle', 'empty'] }, // Right column, bottom platform
  ]);

  const handlePotClick = (platformIndex: number, potIndex: number) => {
    const currentState = platforms[platformIndex].pots[potIndex];
    
    // Only allow state changes for empty pots
    if (currentState === 'obstacle') {
      return;
    }

    // Create a new platforms array with the updated state
    const newPlatforms = [...platforms];
    let newPots = [...newPlatforms[platformIndex].pots];
    
    // Check if boss pot already exists
    const hasBossPot = platforms.some(platform => 
      platform.pots.some(pot => pot === 'bossPot')
    );
    
    // Cycle through states: empty -> boss -> empty
    switch (currentState) {
      case 'empty':
        if (hasBossPot) {
          newPlatforms.forEach((platform, platformIndex) => {
            newPlatforms[platformIndex].pots = platform.pots.map(pot => 
              pot === 'bossPot' ? 'empty' : pot
            );
          });
          newPots = newPlatforms[platformIndex].pots;
        }
        newPots[potIndex] = 'bossPot';
        break;
      case 'bossPot':
        newPots[potIndex] = 'empty';
        break;
      default:
        return;
    }
    
    newPlatforms[platformIndex] = { pots: newPots };
    setPlatforms(newPlatforms);
  };

  const getPotContent = (state: PotState) => {
    switch (state) {
      case 'empty':
        return null;
      case 'pinkFlower':
        return <span className="text-pink-500 text-2xl select-none pointer-events-none">🌷</span>;
      case 'blackFlower':
        return <span className="text-black text-2xl select-none pointer-events-none">🌻</span>;
      case 'bossPot':
        return <span className="text-yellow-500 text-2xl select-none pointer-events-none">🍃</span>;
      case 'obstacle':
        return <span className="text-red-600 font-bold text-3xl select-none pointer-events-none">×</span>;
    }
  };

  // Check if boss pot exists and get its position
  const getBossPotPosition = () => {
    for (let platformIndex = 0; platformIndex < platforms.length; platformIndex++) {
      const platform = platforms[platformIndex];
      const potIndex = platform.pots.findIndex(pot => pot === 'bossPot');
      if (potIndex !== -1) {
        const column = platformIndex < 3 ? 'left' : 'right';
        const row = platformIndex % 3;
        const rowName = row === 0 ? 'top' : row === 1 ? 'middle' : 'bottom';
        const potPosition = potIndex === 0 ? 'left' : potIndex === 1 ? 'middle' : 'right';
        return `${t(`pages.orbisPQ.rooms.garden.positions.${column}`)}-${t(`pages.orbisPQ.rooms.garden.positions.${rowName}`)}-${t(`pages.orbisPQ.rooms.garden.positions.${potPosition}`)}`;
      }
    }
    return '';
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(`${t('pages.orbisPQ.rooms.garden.bossPot')}: ${getBossPotPosition()}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const hasBossPot = platforms.some(platform => 
    platform.pots.some(pot => pot === 'bossPot')
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 pb-8 space-y-6">
      {/* Main Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border pt-4 px-4 flex flex-col space-y-8 overflow-hidden">
        {/* Skybox */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none rounded-lg"></div>

        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor animate-pulse"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Title */}
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-text-primary">{t('pages.orbisPQ.rooms.garden.title')}</h1>
          <div className="text-text-secondary font-semibold text-sm mt-2">{t('pages.orbisPQ.rooms.garden.huntBoss')}</div>
        </div>

        {/* Platforms Grid */}
        <div className="relative z-10 flex justify-center space-x-6 sm:space-x-28">
          {/* Left Column */}
          <div className="flex flex-col space-y-8">
            {platforms.slice(0, 3).map((platform, index) => (
              <div key={`left-${index}`} className="relative">
                {/* Platform */}
                <div className="absolute -bottom-4 left-0 right-0 h-2 bg-platform-active rounded-lg shadow-lg" />
                {/* Pots */}
                <div className="flex space-x-2 relative z-10">
                  {platform.pots.map((pot, potIndex) => (
                    <div
                      key={`left-${index}-${potIndex}`}
                      className={`w-8 h-8 sm:w-12 sm:h-12 bg-platform rounded-lg border border-platform-border shadow-md relative cursor-pointer
                        ${pot === 'empty' ? 'hover:bg-platform-hover' : ''}
                        transition-colors duration-200`}
                      onClick={() => handlePotClick(index, potIndex)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {getPotContent(pot)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8">
            {platforms.slice(3, 6).map((platform, index) => (
              <div key={`right-${index}`} className="relative">
                {/* Platform */}
                <div className="absolute -bottom-4 left-0 right-0 h-2 bg-platform-active rounded-lg shadow-lg" />
                {/* Pots */}
                <div className="flex space-x-2 relative z-10">
                  {platform.pots.map((pot, potIndex) => (
                    <div
                      key={`right-${index}-${potIndex}`}
                      className={`w-8 h-8 sm:w-12 sm:h-12 bg-platform rounded-lg border border-platform-border shadow-md relative cursor-pointer
                        ${pot === 'empty' ? 'hover:bg-platform-hover' : ''}
                        transition-colors duration-200`}
                      onClick={() => handlePotClick(index + 3, potIndex)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {getPotContent(pot)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Button */}
        {hasBossPot && (
          <div className="relative z-10 flex justify-center">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                copySuccess 
                  ? 'bg-status-success text-altText-primary' 
                  : 'bg-interactive hover:bg-interactive-hover text-altText-primary'
              }`}
            >
              {copySuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-altText-primary text-xs font-semibold">{t('pages.orbisPQ.rooms.common.copied')}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span className="text-altText-primary text-xs font-semibold">{t('pages.orbisPQ.rooms.garden.copy')}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Exit */}
        <Link 
          href="/party-quest/orbis"
          className="relative bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-door-exit to-door-exit-hover rounded-t-md flex flex-col items-center justify-center hover:from-door-exit-hover hover:to-door-exit-active transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 z-10"
        >
          <span className="text-altText-primary font-semibold">{t('pages.orbisPQ.rooms.common.exit')}</span>
        </Link>
      </div>

      {/* Info Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
          <ul className="list-disc list-inside space-y-1 font-semibold text-sm text-text-secondary">
            <li>{t('common.players')}: {roomConfig["garden"].players}</li>
            {roomConfig["garden"].jobs && (
              <li>{t('common.jobs')}: {roomConfig["garden"].jobs.map(job => t(job)).join(', ')}</li>
            )}
            {roomConfig["garden"].types && (
              <li>{t('common.types')}: {roomConfig["garden"].types.map(type => t(type)).join(', ')}</li>
            )}
            {roomConfig["garden"].skills && (
              <li>{t('common.skills')}: {roomConfig["garden"].skills.map(skill => t(skill)).join(', ')}</li>
            )}
          </ul>
        </div>
      </div>

      {/* Objective Section */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border p-4 border-room-border flex flex-col">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
        </div>
        
        {/* Skybox */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-text-primary font-semibold mb-2">{t('common.objective')}</div>
          <ul className="list-decimal list-inside space-y-1 font-semibold text-xs text-text-secondary">
            <li dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.garden.objective1')} />
            <li dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.garden.objective2')} />
            <li dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.garden.objective3')} />
            <li dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.garden.objective4')} />
            <li dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.garden.objective5')} />
          </ul>
        </div>
      </div>

      {/* Tips Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 overflow-hidden">
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
            {t('pages.orbisPQ.rooms.garden.tip')}
          </p>
        </div>
      </div>

    </div>
  );
} 