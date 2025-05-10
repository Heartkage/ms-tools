'use client';

import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { roomConfig } from '../../constants';

export default function StorageRoom() {
  const { t } = useLanguage();
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Platform numbers in order
  const platformNumbers = [1, 8, 14, 12, 9, 6, 13, 11, 3, 2, 5, 7, 4, 15, 10];

  const copySequence = () => {
    const sequence = t('orbisPQ.rooms.storage.title') + ": 1 -> 10 -> 9 -> 13 -> 11 -> 6 -> 12 -> 2 -> 5 -> 15 -> 8 -> 4 -> 7 -> 3 -> 14";
    navigator.clipboard.writeText(sequence)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedNumber((prev) => {
        if (prev === 15) return 0;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNextNumber = (currentNumber: number) => {
    if (currentNumber === 15) return 1;
    return currentNumber + 1;
  };

  const getPlatformPosition = (number: number) => {
    const index = platformNumbers.indexOf(number);
    const isLeftColumn = index % 2 === 0;
    const position = Math.floor(index / 2);
    return { isLeftColumn, position };
  };

  const getArrowDirection = (currentNumber: number, nextNumber: number) => {
    if (currentNumber === 15) return 'End';
    
    const { isLeftColumn: currentIsLeft, position: currentPos } = getPlatformPosition(currentNumber);
    const { isLeftColumn: nextIsLeft, position: nextPos } = getPlatformPosition(nextNumber);
    
    if (currentIsLeft === nextIsLeft) {
      // Same column
      return nextPos > currentPos ? '↑' : '↓';
    } else {
      // Different columns
      if (nextPos > currentPos) {
        return nextIsLeft ? '↖' : '↗';
      } else if (nextPos < currentPos) {
        return nextIsLeft ? '↙' : '↘';
      } else {
        return nextIsLeft ? '←' : '→';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Storage Room Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 flex flex-col pb-32 overflow-hidden">
        {/* Background decor - moved to absolute positioning */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
        </div>
        
        {/* Skybox - moved to absolute positioning */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

        {/* Main Content Container - relative to ensure proper stacking */}
        <div className="relative z-10">
          {/* Title */}
          <div className="text-text-primary font-semibold text-center mb-4">
            <div className="text-2xl">{t('orbisPQ.rooms.storage.title')}</div>
            <div className="text-sm text-text-secondary mt-1">{t('orbisPQ.rooms.storage.huntMobs')}</div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copySequence}
            className={`ml-auto flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              copySuccess ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copySuccess ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-altText-primary text-xs font-semibold">{t('orbisPQ.rooms.common.copied')}</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="text-altText-primary text-xs font-semibold">{t('orbisPQ.rooms.storage.copySequence')}</span>
              </>
            )}
          </button>

          {/* Platform Grid */}
          <div className="relative flex justify-center space-x-12">
            {/* Left Column */}
            <div className="w-1/3 flex flex-col justify-start space-y-4 sm:space-y-8">
              {platformNumbers.map((num, index) => {
                if (index % 2 === 0) {
                  const isSelected = selectedNumber === num;
                  const nextNumber = getNextNumber(num);
                  const arrow = getArrowDirection(num, nextNumber);
                  
                  return (
                    <div key={index} className="relative flex flex-col items-center">
                      <div className={`mb-2 h-8 w-8 rounded-full flex items-center justify-center text-xl font-bold transition-colors duration-300 ${
                        isSelected 
                          ? 'bg-interactive text-white shadow-lg scale-110' 
                          : 'text-text-primary'
                      }`}>{num}</div>
                      <div className={`h-4 w-28 sm:h-6 sm:w-32 rounded-md shadow-md ${isSelected ? 'bg-interactive' : 'bg-platform'} flex items-center justify-center`}>
                        {isSelected && (
                          <span className="text-md sm:text-xl text-white-900 font-bold">
                            {arrow}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }).reverse()}
            </div>
            
            {/* Right Column */}
            <div className="w-1/3 flex flex-col justify-start space-y-4 sm:space-y-8 mt-9 sm:mt-10">
              {platformNumbers.map((num, index) => {
                if (index % 2 === 1) {
                  const isSelected = selectedNumber === num;
                  const nextNumber = getNextNumber(num);
                  const arrow = getArrowDirection(num, nextNumber);
                  
                  return (
                    <div key={index} className="relative flex flex-col items-center">
                      <div className={`mb-2 h-8 w-8 rounded-full flex items-center justify-center text-xl font-bold transition-colors duration-300 ${
                        isSelected 
                          ? 'bg-interactive text-white shadow-lg scale-110' 
                          : 'text-text-primary'
                      }`}>{num}</div>
                      <div className={`h-4 w-28 sm:h-6 sm:w-32 rounded-md shadow-md ${isSelected ? 'bg-interactive' : 'bg-platform'} flex items-center justify-center`}>
                        {isSelected && (
                          <span className="text-md sm:text-xl text-white-900 font-bold">
                            {arrow}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }).reverse()}
            </div>
          </div>
        </div>

        {/* Exit */}
        <Link 
          href="/party-quest/orbis"
          className="absolute bottom-0 left-1/3 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-door-exit to-door-exit-hover rounded-t-md flex items-center justify-center hover:from-door-exit-hover hover:to-door-exit-active transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span className="text-altText-primary font-semibold">{t('orbisPQ.rooms.common.exit')}</span>
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
            <li>{t('common.players')}: {roomConfig["storage"].players}</li>
            {roomConfig["storage"].jobs && (
              <li>{t('common.jobs')}: {roomConfig["storage"].jobs.map(job => t(job)).join(', ')}</li>
            )}
            {roomConfig["storage"].types && (
              <li>{t('common.types')}: {roomConfig["storage"].types.map(type => t(type)).join(', ')}</li>
            )}
            {roomConfig["storage"].skills && (
              <li>{t('common.skills')}: {roomConfig["storage"].skills.map(skill => t(skill)).join(', ')}</li>
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
            {t('orbisPQ.rooms.storage.tip')}
          </p>
        </div>
      </div>

    </div>
  );
} 