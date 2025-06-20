'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { roomConfig } from '../../constants';
import { copyToClipboard } from '../../../../../lib/utils/clipboard';

interface DayInfo {
  color: string;
  type: string;
  colorNameKey: string;
}

type Server = {
  name: string;
  timezone: string;
  displayName: string;
};

const SERVERS: Record<string, Server> = {
  NA: { name: 'NA', timezone: 'America/Jamaica', displayName: 'Artale (NA)' },
  ASIA: { name: 'TW', timezone: 'America/Jamaica', displayName: 'Artale (TW)' },
  KR: { name: 'KR', timezone: 'Asia/Seoul', displayName: 'Artale (KR)' }
};

const DAY_COLORS: Record<string, DayInfo> = {
  Monday:    { color: 'rgb(203, 136, 33)',    type: 'cute',      colorNameKey: 'pages.orbisPQ.colors.orange' },      // Orange
  Tuesday:   { color: 'rgb(229, 210, 62)',    type: 'scary',     colorNameKey: 'pages.orbisPQ.colors.yellow' },     // Yellow
  Wednesday: { color: 'rgb(163, 85, 200)',  type: 'fun',       colorNameKey: 'pages.orbisPQ.colors.purple' },       // Purple
  Thursday:  { color: 'rgb(9, 9, 175)',      type: 'sad',       colorNameKey: 'pages.orbisPQ.colors.darkBlue' },       // Dark Blue
  Friday:    { color: 'rgb(25, 142, 212)',  type: 'cold',      colorNameKey: 'pages.orbisPQ.colors.lightBlue' },      // Light Blue
  Saturday:  { color: 'rgb(50, 144, 21)',    type: 'tight',     colorNameKey: 'pages.orbisPQ.colors.green' },     // Green
  Sunday:    { color: 'rgb(204, 19, 23)',      type: 'operatic',   colorNameKey: 'pages.orbisPQ.colors.red' }   // Red
};

export default function Lobby() {
  const { t, tHtml } = useLanguage();
  const [currentTime, setCurrentTime] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [nextDayTime, setNextDayTime] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [timezone, setTimezone] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(SERVERS.NA);
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Test Time
      // now.setDate(now.getDate() + 7);

      const localTimeOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formattedLocalTime = new Intl.DateTimeFormat('en-US', localTimeOptions).format(now);
      setLocalTime(formattedLocalTime);
      
      // Format time in selected server's timezone
      const timeOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: selectedServer.timezone
      };
      
      const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
      setCurrentTime(formattedTime);
      
      // Get current day in selected server's timezone
      const dayOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        timeZone: selectedServer.timezone
      };
      const day = new Intl.DateTimeFormat('en-US', dayOptions).format(now);
      setCurrentDay(day);

      // Calculate when server time changes to next day, converted to user's timezone
      const serverNextDay = new Date(now);
      if (selectedServer.name === 'NA') {
        serverNextDay.setUTCHours(5, 0, 0, 0); // Set to 00:00 Jamaica Time (05:00 UTC)
      } else if (selectedServer.name === 'TW') {
        serverNextDay.setUTCHours(16, 0, 0, 0); // Set to 00:00 Asia Time (16:00 UTC)
      } else if (selectedServer.name === 'KR') {
        serverNextDay.setUTCHours(15, 0, 0, 0); // Set to 00:00 Korea Time (15:00 UTC)
      }
      
      if (serverNextDay <= now) {
        serverNextDay.setUTCDate(serverNextDay.getUTCDate() + 1);
      }
      
      const nextDayOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      const formattedNextDay = new Intl.DateTimeFormat('en-US', nextDayOptions).format(serverNextDay);
      const [date, time] = formattedNextDay.split(', ');
      const [month, dayOfMonth, year] = date.split('/');
      setNextDayTime(`${year}/${month}/${dayOfMonth} ${time}`);

      // Get timezone offset
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = now.getTimezoneOffset();
      const hours = Math.abs(Math.floor(offset / 60));
      const minutes = Math.abs(offset % 60);
      const sign = offset <= 0 ? '+' : '-';
      setTimezone(`${timeZone}, UTC${sign}${hours}${minutes ? `:${minutes}` : ''}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [selectedServer]);

  const currentDayInfo: DayInfo = DAY_COLORS[currentDay] || { 
    color: 'rgb(128, 128, 128)', 
    type: 'Unknown',
    colorNameKey: 'Unknown'
  };

  const handleCircleClick = async () => {
    const colorName = t(currentDayInfo.colorNameKey);
    const textToCopy = `${t('pages.orbisPQ.rooms.lobby.title')}: ${colorName}`;
    try {
      await copyToClipboard(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Container */}
      <div className="relative max-w-4xl w-full mx-auto px-4">
        {/* Title */}
        <div className="mt-8 sm:mt-4 mb-8 text-center">
          <div className="text-altText-primary text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            {t('pages.orbisPQ.rooms.lobby.title')}
          </div>
          <div className="text-altText-secondary text-xs sm:text-sm font-semibold">
            {t('pages.orbisPQ.rooms.lobby.collectCD', { color: t(currentDayInfo.colorNameKey) })}
          </div>
        </div>

        {/* Server Selection Button */}
        <div className="absolute top-0 right-0">
          <div className="relative">
            <button
              onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
              className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-interactive rounded-lg hover:bg-interactive-hover transition-colors duration-200"
            >
              <span className="text-altText-primary font-semibold text-xxs sm:text-sm">{t(`pages.orbisPQ.rooms.lobby.servers.${selectedServer.name.toLowerCase()}`)}</span>
              <svg
                className={`w-2 h-2 sm:w-4 sm:h-4 transform transition-transform duration-200 ${isServerMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isServerMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-room-floor rounded-lg shadow-lg border border-room-border overflow-hidden z-50">
                {Object.values(SERVERS).map((server) => (
                  <button
                    key={server.name}
                    onClick={() => {
                      setSelectedServer(server);
                      setIsServerMenuOpen(false);
                    }}
                    className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left hover:bg-interactive transition-colors duration-200 ${
                      selectedServer.name === server.name ? 'bg-interactive text-altText-primary' : 'text-altText-secondary'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{t(`pages.orbisPQ.rooms.lobby.servers.${server.name.toLowerCase()}`)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CD Circle */}
        <div 
          className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6 group cursor-pointer mx-auto"
          onClick={handleCircleClick}
        >
          <div 
            className="absolute inset-0 rounded-full border-8 transition-all duration-500 group-hover:scale-105"
            style={{ 
              borderColor: currentDayInfo.color,
              boxShadow: `0 0 30px ${currentDayInfo.color}, inset 0 0 20px ${currentDayInfo.color}`,
              background: `rgba(${currentDayInfo.color.replace('rgb(', '').replace(')', '')}, 0.4)`
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-altText-primary">{t(`pages.orbisPQ.weekdays.${currentDay.toLowerCase()}`)}</span>
            <span className="text-lg sm:text-xl text-altText-secondary mt-2">{t(`pages.orbisPQ.dayTypes.${currentDayInfo.type}`)}</span>
            <span className="text-xs text-altText-tertiary mt-1">{t('pages.orbisPQ.rooms.lobby.clickTip')}</span>
            {copySuccess && (
              <div className="absolute bottom-4 text-status-success text-xs sm:text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
                {t('pages.orbisPQ.rooms.common.copied')}
              </div>
            )}
          </div>
        </div>

        {/* Clock Display */}
        <div className="text-center mb-6">
          <div className="text-xl sm:text-2xl font-mono mb-2 text-altText-primary tracking-wider">
            {currentTime} 
          </div>
          <div className="text-xs sm:text-sm text-altText-secondary">
            <span dangerouslySetInnerHTML={tHtml('pages.orbisPQ.rooms.lobby.serverTime', { server: selectedServer.displayName })} /> <span>({selectedServer.name === 'NA' ? 'EST/UTC-5' : selectedServer.name === 'TW' ? 'EST/UTC-5' : 'KST/UTC+9'})</span>
          </div>
        </div>

        {/* Next Day Time */}
        <div className="text-base sm:text-lg text-center space-y-1 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
            <div className="text-altText-secondary text-[10px] sm:text-xs">{t('pages.orbisPQ.rooms.lobby.localTime')}</div>
            <div className="text-altText-primary text-sm sm:text-base">{localTime}</div>
            <div className="text-[10px] sm:text-xs text-altText-tertiary">{timezone}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
            <div className="text-altText-secondary text-[10px] sm:text-xs">{t('pages.orbisPQ.rooms.lobby.nextDayChange')}</div>
            <div className="text-altText-primary text-sm sm:text-base">{nextDayTime}</div>
            <div className="text-[10px] sm:text-xs text-altText-tertiary">{timezone}</div>
          </div>
        </div>

        {/* Day Boxes */}
        <div className="grid grid-cols-7 gap-2 max-w-4xl mx-auto px-4">
          {Object.entries(DAY_COLORS).map(([day, info]) => (
            <div
              key={day}
              className="flex flex-col items-center justify-top p-3 sm:p-4 rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: info.color,
                boxShadow: `0 0 15px ${info.color}`,
              }}
            >
              <span className="text-white font-semibold text-xs sm:text-lg">{t(`pages.orbisPQ.weekdays.${day.toLowerCase()}`)}</span>
              <span className="text-white/90 text-xxs sm:text-sm mt-1">{t(`pages.orbisPQ.dayTypes.${info.type}`)}</span>
            </div>
          ))}
        </div>
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
              <li>{t('common.players')}: {roomConfig["lobby"].players}</li>
              {roomConfig["lobby"].jobs && (
                <li>{t('common.jobs')}: {roomConfig["lobby"].jobs.map(job => t(job)).join(', ')}</li>
              )}
              {roomConfig["lobby"].types && (
                <li>{t('common.types')}: {roomConfig["lobby"].types.map(type => t(type)).join(', ')}</li>
              )}
              {roomConfig["lobby"].skills && (
                <li>{t('common.skills')}: {roomConfig["lobby"].skills.map(skill => t(skill)).join(', ')}</li>
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
            <p className="text-status-warning font-semibold text-xs">
              {t('pages.orbisPQ.rooms.lobby.tip')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
} 