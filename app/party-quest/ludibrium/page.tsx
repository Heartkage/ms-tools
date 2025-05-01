import React from 'react'
import Link from 'next/link'

export default function LudibriumPQ() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Ludibrium Party Quest</h1>
        {/* Calculator content will be added here */}
      </div>
    </main>
  )
} 