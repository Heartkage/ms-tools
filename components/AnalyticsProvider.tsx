'use client';

import { useAnalytics } from '../lib/firebase/useAnalytics';

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAnalytics();
  return <>{children}</>;
} 