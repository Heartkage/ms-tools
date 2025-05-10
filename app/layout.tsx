import React from 'react'
import Providers from '../components/Providers'
import './globals.css'
import type { Metadata } from 'next'
import { notoSansTC } from './fonts'
import AnalyticsProvider from '../components/AnalyticsProvider'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'MapleStory Tool',
  description: 'A collection of tools for MapleStory',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSansTC.variable}>
      <body className={`${notoSansTC.className} antialiased`}>
        <Providers>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  )
} 