'use client';

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/api-services'

type AuthGuardProps = {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authFailed, setAuthFailed] = useState(false)
  const user = authService.getCurrentUserSync()

  // Listen for auth-failed events from API client
  useEffect(() => {
    const handleAuthFailed = () => {
      setAuthFailed(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-failed', handleAuthFailed)
      return () => {
        window.removeEventListener('auth-failed', handleAuthFailed)
      }
    }
  }, [])

  useEffect(() => {
    // If no user is logged in and we're not on the login page, or if auth failed
    if ((!user && pathname !== '/login') || authFailed) {
      router.push('/login')
      return
    }

    // If roles are specified, check if user has required role
    if (allowedRoles && !authService.hasPermission(allowedRoles)) {
      router.push('/dashboard')
    }
  }, [pathname, allowedRoles, user, router, authFailed]) // eslint-disable-line react-hooks/exhaustive-deps

  // If we're on the login page and user is logged in, redirect to dashboard
  if (user && pathname === '/login') {
    router.push('/dashboard')
    return null
  }

  // If we're checking roles and user doesn't have permission, don't render children
  if (allowedRoles && !authService.hasPermission(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
