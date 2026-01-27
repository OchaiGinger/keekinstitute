'use client'

import { ReactNode, useMemo } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!url) {
      console.error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
      // Return a dummy client to prevent crashes - the app should still load
      return null as any
    }
    return new ConvexReactClient(url)
  }, [])

  if (!convex) {
    return children
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}