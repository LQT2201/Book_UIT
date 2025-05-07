import { useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLoadingSkeleton from 'src/components/AdminLoadingSkeleton'

const AdminIndex = () => {
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const isAdmin = localStorage.getItem('isAdmin')

    if (!adminToken || isAdmin !== 'true') {
      // Redirect to admin login if not authenticated
      router.push('/admin/login')
    } else {
      // Redirect to admin orders page if authenticated
      router.push('/admin/orders')
    }
  }, [router])

  return <AdminLoadingSkeleton />
}

export default AdminIndex
