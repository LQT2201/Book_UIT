import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AdminLoadingSkeleton from 'src/components/AdminLoadingSkeleton'

// Admin authentication HOC
const withAdminAuth = WrappedComponent => {
  const WithAdminAuth = props => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // Check for admin token in localStorage
      const adminToken = localStorage.getItem('adminToken')
      const isAdmin = localStorage.getItem('isAdmin')

      if (!adminToken || isAdmin !== 'true') {
        // Redirect to admin login if not authenticated
        router.push('/admin/login')
      } else {
        // Optionally verify token with backend
        verifyAdminToken(adminToken)
      }
    }, [router])

    const verifyAdminToken = async token => {
      try {
        // You can implement a token verification endpoint on your backend
        // For now, we'll just set authenticated to true
        setIsAuthenticated(true)
        setLoading(false)
      } catch (error) {
        console.error('Token verification failed:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('isAdmin')
        router.push('/admin/login')
      }
    }

    // Show loading component while checking authentication
    if (loading) {
      return <AdminLoadingSkeleton />
    }

    // If authenticated, render the protected component
    return isAuthenticated ? <WrappedComponent {...props} /> : null
  }

  // Copy getInitialProps if it exists
  if (WrappedComponent.getInitialProps) {
    WithAdminAuth.getInitialProps = WrappedComponent.getInitialProps
  }

  return WithAdminAuth
}

export default withAdminAuth
