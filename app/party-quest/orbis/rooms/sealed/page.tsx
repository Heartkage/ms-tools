'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';

export default function SealedRoom() {
  const { t } = useLanguage();
  const [codeInput, setCodeInput] = useState('');
  const [showError, setShowError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const inputRef = useRef(null);

  // Sealed Room answers configuration
  const sealedRoomConfig = {
    answers: {
      '0011': [2, 1, 1],
      '0101': [1, 2, 1],
      '0110': [1, 1, 2],
      '1011': [0, 2, 2],
      '1012': [0, 3, 1],
      '1021': [0, 1, 3],
      '1101': [2, 0, 2],
      '1102': [3, 0, 1],
      '1110': [2, 2, 0],
      '1120': [3, 1, 0],
      '1201': [1, 0, 3],
      '1210': [1, 3, 0],
      '2112': [0, 0, 4],
      '2120': [0, 4, 0],
      '2211': [4, 0, 0]
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    const platformNumbers = sealedRoomConfig.answers[codeInput];
    if (!platformNumbers) return;
    
    const answerString = platformNumbers.join('');
    const textToCopy = `Sealed Room: ${answerString}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Handle code input change
  const handleCodeInputChange = (e) => {
    const value = e.target.value;
    setShowError(false);
    if (/^[0-2]{0,4}$/.test(value)) {
      setCodeInput(value);
      if (value.length === 4) {
        // Close keyboard by blurring the input
        inputRef.current?.blur();
        // Show error if code is invalid
        if (!sealedRoomConfig.answers[value]) {
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      }
    }
  };

  // Get platform numbers - now a pure function
  const getPlatformNumbers = () => {
    if (!codeInput) return [null, null, null];
    return sealedRoomConfig.answers[codeInput] || [null, null, null];
  };

  const platformNumbers = getPlatformNumbers();
  const hasValidAnswer = platformNumbers[0] !== null;

  return (
    <div className="space-y-8">
      {/* Sealed Room Platform Container */}
      <div className="relative h-[300px] max-w-3xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border border-blue-200 p-4 flex items-end justify-center overflow-hidden">
        {/* Background decor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-blue-300"></div>
          <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-blue-300"></div>
          <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-blue-300"></div>
          <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-blue-300"></div>
        </div>
        
        {/* Skybox */}
        <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>
        
        {/* Title */}
        <div className="absolute flex top-4 flex-col items-top justify-top">
          <div className="text-text-primary font-semibold text-center">{t('orbisPQ.rooms.sealed.title')}</div>
          <h3 className="text-text-secondary text-center text-xs font-semibold mb-2">{t('orbisPQ.rooms.sealed.solvePuzzle')}</h3>
        </div>

        {/* Platform Stage */}
        <div className="relative w-full bottom-0 flex items-end justify-center space-x-4 sm:space-x-10">
          {/* Left Platform */}
          <div className="relative flex flex-col items-center">
            <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xl font-bold shadow-md text-altText-black">
              {platformNumbers[0] !== null ? platformNumbers[0] : ""}
            </div>
            <div className="relative">
              <div className="h-10 w-16 sm:w-28 md:w-32 bg-platform rounded-md shadow-md flex items-center justify-center">
                <span className="text-altText-black font-semibold">{t('orbisPQ.rooms.sealed.left')}</span>
              </div>
              <div className="h-5 w-6 mx-auto"></div>
            </div>
          </div>
          
          {/* Middle Platform */}
          <div className="relative flex flex-col items-center">
            <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xl font-bold shadow-md text-altText-black">
              {platformNumbers[1] !== null ? platformNumbers[1] : ""}
            </div>
            <div className="relative">
              <div className="h-10 w-20 sm:w-32 md:w-40 bg-platform rounded-md shadow-md flex items-center justify-center">
                <span className="text-altText-black font-semibold">{t('orbisPQ.rooms.sealed.middle')}</span>
              </div>
              <div className="h-28 w-8 mx-auto"></div>
            </div>
          </div>
          
          {/* Right Platform */}
          <div className="relative flex flex-col items-center">
            <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xl font-bold shadow-md text-altText-black">
              {platformNumbers[2] !== null ? platformNumbers[2] : ""}
            </div>
            <div className="relative">
              <div className="h-10 w-16 sm:w-28 md:w-32 bg-platform rounded-md shadow-md flex items-center justify-center">
                <span className="text-altText-black font-semibold">{t('orbisPQ.rooms.sealed.right')}</span>
              </div>
              <div className="h-5 w-6 mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-platform-active"></div>
        
      </div>
      
      {/* How to get 4 digits & enter code */}
      <div className="flex flex-wrap-reverse gap-6 max-w-3xl mx-auto">
        {/* Description Section */}
        <div className="basis-full md:basis-[48%] p-6 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-blue-200 relative">
          {/* Background decor */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-blue-300"></div>
            <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-blue-300"></div>
          </div>
          
          {/* Skybox */}
          <div className="absolute inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none rounded-lg"></div>

          <div className="relative z-10">
            <h3 className="text-base font-semibold text-text-primary mb-3">{t('orbisPQ.rooms.sealed.howToGetDigits')}</h3>
            <div className="space-y-2 text-xs font-semibold text-text-secondary">
              <p>{t('orbisPQ.rooms.sealed.step1')}</p>
              <p>{t('orbisPQ.rooms.sealed.step2')}</p>
              <p>{t('orbisPQ.rooms.sealed.step3')}</p>
              <p>{t('orbisPQ.rooms.sealed.step4')}</p>
            </div>
          </div>
        </div>

        {/* Code Input Section */}
        <div className="basis-full md:basis-[48%] p-6 bg-gradient-to-b from-room to-room-bottom rounded-lg border border-blue-200 relative">
          {/* Background decor */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-blue-300"></div>
            <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-blue-300"></div>
          </div>
          
          {/* Skybox */}
          <div className="absolute rounded-lg inset-0 bg-gradient-to-b from-decor-light to-room pointer-events-none"></div>

          {/* Title */}
          <div className="relative z-10 text-text-primary font-semibold mb-3">{t('orbisPQ.rooms.sealed.enterCode')}</div>
          
          {/* Input and Clear Button */}
          <div className="relative z-10 flex items-center space-x-4 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={codeInput}
              onChange={handleCodeInputChange}
              placeholder="0000"
              maxLength={4}
              className={`w-32 sm:w-40 px-4 py-2 text-xl font-mono tracking-widest text-center rounded-md border-2 ${showError ? 'border-red-500 bg-red-50' : 'border-blue-300'} focus:border-blue-500 focus:outline-none transition-colors text-gray-900`}
            />
            <button 
              onClick={() => {setCodeInput(''); setShowError(false);}}
              className="px-4 py-2 bg-blue-300 hover:bg-blue-400 text-blue-800 rounded-md transition-colors flex-shrink-0"
            >
              {t('orbisPQ.rooms.sealed.clear')}
            </button>
          </div>

          {/* Instructions */}
          <div className={`relative z-10 text-sm text-blue-600 mb-4 transition-opacity duration-300 ${showError ? 'opacity-0' : 'opacity-100'}`}>
            {t('orbisPQ.rooms.sealed.enterCodeHint')}
          </div>

          {/* Result and Copy Button */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
            {hasValidAnswer && (
              <>
                <div className="w-32 sm:w-40 h-12 bg-green-100 rounded-md border-2 border-blue-300 flex items-center justify-center text-xl font-mono tracking-widest text-gray-900">
                  {platformNumbers.join('')}
                </div>
                
                {/* Copy to clipboard button */}
                <button 
                  onClick={copyToClipboard}
                  className={`px-4 py-2 flex items-center justify-center rounded-md transition-colors text-sm flex-shrink-0 ${
                    copySuccess 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-300 hover:bg-blue-400 text-blue-800'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('orbisPQ.rooms.common.copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      {t('orbisPQ.rooms.sealed.copyAnswer')}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          {/* Error message */}
          <div className={`relative z-10 text-sm font-medium text-red-600 transition-all duration-300 ${showError ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} overflow-hidden`}>
            {t('orbisPQ.rooms.sealed.invalidCode')}
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="relative max-w-3xl mx-auto bg-gradient-to-b from-room to-room-bottom rounded-lg border p-6 border-room-border flex flex-col">
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
          <div className="text-text-primary font-semibold mb-2">{t('common.recommend')}</div>
          <ul className="list-disc list-inside space-y-1 font-semibold text-xs text-text-secondary">
            <li>{t('orbisPQ.rooms.sealed.requirement1')}</li>
            <li>{t('orbisPQ.rooms.sealed.requirement2')}</li>
          </ul>
        </div>
      </div>

    </div>
  );
}