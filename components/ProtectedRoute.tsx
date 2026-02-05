// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { authSelector } from '@/redux/reducers'

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()
  
  // This is checking your Redux state - same as React!
  const { user, loading } = useSelector(authSelector)
  const isAuthenticated = !!user // if user exists, they're logged in

  useEffect(() => {
    // If done loading and no user → redirect to /auth
    if (!loading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, loading, router])

  // Show loading while checking
  if (loading) {
    return <div>Loading...</div>
  }

  // Don't show anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, show the page
  return <>{children}</>
}