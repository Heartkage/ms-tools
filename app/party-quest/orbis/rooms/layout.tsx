'use client';

import Link from 'next/link';
import { useLanguage } from '../../../../contexts/LanguageContext';
import Header from '../../../../components/Header';

export default function RoomLayout({ children }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-4 sm:p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <Header hasBackButton={true} />
        </div>
        {children}
      </div>
    </div>
  );
} 