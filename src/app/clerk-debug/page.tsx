'use client'

import { useEffect, useState } from 'react'

export default function ClerkDebugPage() {
  const [clerkData, setClerkData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testClerkKey = async () => {
      try {
        const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        console.log('Publishable Key:', pubKey)

        if (!pubKey) {
          setError('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set')
          setLoading(false)
          return
        }

        // Try to fetch from Clerk API
        const response = await fetch(
          'https://quick-ringtail-57.clerk.accounts.dev/v1/client',
          {
            headers: {
              Authorization: `Bearer ${pubKey}`,
            },
          }
        )

        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Response data:', data)

        if (response.ok) {
          setClerkData(data)
          setError('')
        } else {
          setError(`Clerk API Error: ${response.status} - ${JSON.stringify(data)}`)
        }
      } catch (err) {
        console.error('Error:', err)
        setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    testClerkKey()
  }, [])

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Clerk Credentials Debug</h1>

      <div className="bg-blue-100 p-4 rounded">
        <p className="font-bold">Status: {loading ? 'Testing...' : 'Done'}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 p-4 rounded">
          <p className="font-bold text-red-600">Error:</p>
          <code className="text-sm whitespace-pre-wrap break-all">{error}</code>
        </div>
      )}

      {clerkData && (
        <div className="bg-green-100 border border-green-400 p-4 rounded">
          <p className="font-bold text-green-600">Success!</p>
          <code className="text-sm">{JSON.stringify(clerkData, null, 2)}</code>
        </div>
      )}

      <div className="bg-yellow-100 p-4 rounded">
        <p className="font-bold">What to do:</p>
        <ul className="list-disc list-inside space-y-2">
          {error && (
            <>
              <li>Your Clerk credentials might be invalid or expired</li>
              <li>Check your Clerk dashboard for the correct keys</li>
              <li>Verify the publishable key matches your Clerk instance</li>
              <li>Make sure you're not using test keys with a production instance</li>
            </>
          )}
          {clerkData && (
            <li>Your Clerk credentials are valid!</li>
          )}
          {loading && <li>Testing connection to Clerk...</li>}
        </ul>
      </div>
    </div>
  )
}
