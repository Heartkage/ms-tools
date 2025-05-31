'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { roomConfig } from '../../constants';
import { copyToClipboard } from '../../../../../lib/utils/clipboard';

export default function OnTheWayUp() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [toggleStates, setToggleStates] = useState<number[][][]>([
    // First section - 4x4 grid
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Second section - 4x4 grid
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Third section - 4x4 grid
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Fourth section - 4x4 grid
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ]);

  // Load from localStorage after component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('orbis_pq_selection');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setToggleStates(parsedState);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever toggleStates changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('orbis_pq_selection', JSON.stringify(toggleStates));
    }
  }, [toggleStates, isLoading]);

  const [copySuccess, setCopySuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const generateAnswer = () => {
    let result = "up: ";
    let foundSelection = false;

    // Start from section 4 and go backwards
    for (let sectionIndex = 3; sectionIndex >= 0; sectionIndex--) {
      const section = toggleStates[sectionIndex];
      let sectionHasSelection = false;
      let sectionNumbers: number[] = [];
      let foundUnselectedRow = false;

      // Check each row from bottom to top
      for (let rowIndex = section.length - 1; rowIndex >= 0; rowIndex--) {
        const row = section[rowIndex];
        const selectedIndex = row.findIndex(state => state === 1);
        
        if (selectedIndex !== -1 && !foundUnselectedRow) {
          sectionHasSelection = true;
          const isRightStart = sectionIndex % 2 === 1;
          const platformNumber = isRightStart 
            ? 4 - selectedIndex  // For sections 2 and 4 (right start): 4,3,2,1
            : selectedIndex + 1; // For sections 1 and 3 (left start): 1,2,3,4
          sectionNumbers.push(platformNumber);
        } else if (selectedIndex === -1) {
          foundUnselectedRow = true;
        }
      }

      if (sectionHasSelection) {
        foundSelection = true;
        result += sectionNumbers.join('') + ' ';
        
        // Do not continue if we found an unselected row
        if (foundUnselectedRow) {
          break;
        }
      } else {
        // If we found a selection before but this section is empty, stop
        break;
      }
    }

    return result.trim();
  };

  const handleCopyToClipboard = async () => {
    const result = generateAnswer();
    try {
      await copyToClipboard(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleToggle = (sectionIndex: number, rowIndex: number, platformIndex: number) => {
    setToggleStates(prev => {
      const newStates = [...prev];
      newStates[sectionIndex] = newStates[sectionIndex].map((row, i) => {
        if (i === rowIndex) {
          // If clicking the same platform that's already selected, toggle it off
          if (row[platformIndex] === 1) {
            return row.map(() => 0);
          }
          // Otherwise, select the new platform and unselect others
          return row.map((_, j) => j === platformIndex ? 1 : 0);
        }
        return row;
      });
      return newStates;
    });
  };

  const handleResetSection = (sectionIndex: number) => {
    setToggleStates(prev => {
      const newStates = [...prev];
      newStates[sectionIndex] = newStates[sectionIndex].map(row => row.map(() => 0));
      return newStates;
    });
  };

  const handleClearAll = () => {
    setToggleStates(prev => prev.map(section => 
      section.map(row => row.map(() => 0))
    ));
    setShowConfirmDialog(false);
  };

  // Check if any section has the first row selected
  const hasFirstRowSelected = toggleStates[3][toggleStates[3].length - 1].some(state => state === 1);
  const hasLastRowSelected = toggleStates[0].every(row => row.some(state => state === 1));

  // Check if any platform is selected
  const hasAnySelection = toggleStates.some(section => 
    section.some(row => row.some(state => state === 1))
  );

  return (
    <div className="min-h-screen space-y-8">
      {/* Main Container */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-room-border p-4 flex flex-col space-y-8 pb-0 overflow-hidden">
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
        <div className="relative z-10 text-center font-semibold">
          <h1 className="text-2xl text-text-primary">{t('orbisPQ.rooms.onTheWayUp.title')}</h1>
          <h3 className="text-sm text-text-secondary mt-1">{t('orbisPQ.rooms.onTheWayUp.jumpToHighest')}</h3>
        </div>

        {/* Hint Section */}
        {hasLastRowSelected && (
          <div className="relative flex items-center justify-center z-10 bg-decor rounded-lg border border-room-border p-3 sm:p-4">
            <div className="text-xs sm:text-sm md:text-sm text-text-primary font-semibold">{t('orbisPQ.rooms.onTheWayUp.tip')}</div>
          </div>
        )}

        {/* Platform Sections */}
        <div className="relative z-10 space-y-8">
          {toggleStates.map((section, sectionIndex) => {
            const isRightStart = sectionIndex % 2 === 1;
            return (
              <div key={sectionIndex} className="flex flex-col space-y-4">
                <div className="relative flex space-x-4 items-center justify-center">
                  {isRightStart && section.some(row => row.some(state => state === 1)) && (
                    <button
                      onClick={() => handleResetSection(sectionIndex)}
                      className="relative max-w-20 top-0 px-2 sm:px-3 py-1 bg-gray-600 text-white text-[8px] sm:text-xs md:text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      {t('orbisPQ.rooms.onTheWayUp.resetSection')}
                    </button>
                  )}
                  
                  <div className="flex flex-col space-y-4 items-center">
                    {section.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-center">
                        <div className={`flex ${'flex-row'} gap-4`}>
                          {row.map((state, platformIndex) => {
                            const platformNumber = isRightStart 
                              ? 4 - platformIndex
                              : platformIndex + 1;
                            return (
                              <button
                                key={platformIndex}
                                onClick={() => handleToggle(sectionIndex, rowIndex, platformIndex)}
                                className={`w-10 sm:w-16 md:w-20 h-6 rounded-lg transition-colors duration-300 ${
                                  state === 1 
                                    ? 'bg-yellow-400' 
                                    : 'bg-gray-400'
                                }`}
                              >
                                <span className="flex items-center justify-center text-xs font-bold text-gray-700">
                                  {platformNumber}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isRightStart && section.some(row => row.some(state => state === 1)) && (
                    <button
                      onClick={() => handleResetSection(sectionIndex)}
                      className="relative max-w-20 top-0 px-2 sm:px-3 py-1 bg-gray-600 text-white text-[8px] sm:text-xs md:text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      {t('orbisPQ.rooms.onTheWayUp.resetSection')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Context Display and Copy Button */}
        {hasFirstRowSelected && (
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-text-primary font-mono text-xs sm:text-sm md:text-base bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded">
                {generateAnswer()}
              </div>
              <button
                onClick={handleCopyToClipboard}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 flex items-center justify-center rounded-md transition-colors text-xs sm:text-sm ${
                  copySuccess 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('orbisPQ.rooms.common.copied')}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {t('orbisPQ.rooms.onTheWayUp.copyAnswer')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Clear All Button */}
        {hasAnySelection && (
          <div className="relative flex flex-col items-center items-center">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="z-10 px-4 py-2 bg-red-600 text-white text-xs sm:text-sm rounded hover:bg-red-700 transition-colors"
            >
              {t('orbisPQ.rooms.onTheWayUp.clearAll')}
            </button>
          </div>
        )}

        {/* Exit */}
        <Link 
          href="/party-quest/orbis"
          className="relative z-20 w-24 h-28 bg-gradient-to-b from-door-exit to-door-exit-hover rounded-t-md flex flex-col items-center justify-center hover:from-door-exit-hover hover:to-door-exit-active transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl mx-auto transform hover:scale-105"
        >
          <span className="text-altText-primary font-semibold">{t('orbisPQ.rooms.common.exit')}</span>
          <span className="text-altText-secondary text-xxs text-center font-semibold mt-1">{t('orbisPQ.rooms.common.transferWarning')}</span>
        </Link>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('orbisPQ.rooms.onTheWayUp.confirmClear')}</h3>
            <p className="text-gray-600 mb-6">{t('orbisPQ.rooms.onTheWayUp.confirmMessage')}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {t('orbisPQ.rooms.onTheWayUp.cancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t('orbisPQ.rooms.onTheWayUp.clearAll')}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="text-text-primary font-semibold text-sm sm:text-base">{t('common.recommend')}</div>
          <ul className="list-disc list-inside space-y-1 font-semibold text-xs sm:text-sm text-text-secondary">
            <li>{t('common.players')}: {roomConfig["onTheWayUp"].players}</li>
            {roomConfig["onTheWayUp"].jobs && (
              <li>{t('common.jobs')}: {roomConfig["onTheWayUp"].jobs.map(job => t(job)).join(', ')}</li>
            )}
            {roomConfig["onTheWayUp"].types && (
              <li>{t('common.types')}: {roomConfig["onTheWayUp"].types.map(type => t(type)).join(', ')}</li>
            )}
            {roomConfig["onTheWayUp"].skills && (
              <li>{t('common.skills')}: {roomConfig["onTheWayUp"].skills.map(skill => t(skill)).join(', ')}</li>
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
          <ul className="list-disc list-inside space-y-1 font-semibold text-xs text-text-secondary">
            <li>{t('orbisPQ.rooms.onTheWayUp.requirement1')}</li>
            <li>{t('orbisPQ.rooms.onTheWayUp.requirement2')}</li>
            <li>{t('orbisPQ.rooms.onTheWayUp.requirement3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 