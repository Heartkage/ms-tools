'use client';

import Link from 'next/link';
import { useLanguage } from '../../../../contexts/LanguageContext';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';

export default function RoomLayout({ children }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="../" className="text-blue-500 hover:text-blue-600 inline-block text-sm sm:text-base">
            {t('orbisPQ.rooms.common.goback')}
          </Link>
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </div>
  );
} 