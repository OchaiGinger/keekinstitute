'use client'

import { ReactNode } from 'react'

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Return children without Convex provider to prevent client-side crashes
  // Server components can still use getConvexClient() for data fetching
  return <>{children}</>
}