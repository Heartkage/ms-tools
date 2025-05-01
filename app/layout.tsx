import React from 'react'
import Providers from '../components/Providers'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 