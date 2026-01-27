'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexUrl) {
    console.warn('NEXT_PUBLIC_CONVEX_URL not set')
    return <>{children}</>
  }

  const convex = new ConvexReactClient(convexUrl)

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}