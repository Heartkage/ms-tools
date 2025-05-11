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
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSansTC.variable}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png" />
      </head>
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