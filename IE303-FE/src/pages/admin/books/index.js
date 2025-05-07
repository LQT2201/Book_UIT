import { Card, CardHeader, Button, Typography, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import TableBooks from './TableBooks'
import withAdminAuth from 'src/middleware/adminAuth'

const BASE_URL = 'http://127.0.0.1:8080/api'

const Books = () => {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire('Lỗi', 'Vui lòng đăng nhập lại', 'error')
        router.push('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/book`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          Swal.fire('Lỗi', 'Phiên đăng nhập hết hạn', 'error')
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data) // Debug log

      // Kiểm tra nếu data là mảng
      if (Array.isArray(data)) {
        setBooks(data)
      } else {
        console.error('Invalid data format:', data)
        Swal.fire('Lỗi', 'Định dạng dữ liệu không hợp lệ', 'error')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire('Lỗi', 'Vui lòng đăng nhập lại', 'error')
        router.push('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/book/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          Swal.fire('Lỗi', 'Phiên đăng nhập hết hạn', 'error')
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        Swal.fire('Thành công', result.message || 'Xóa sách thành công', 'success')
        fetchBooks() // Refresh the list
      } else {
        Swal.fire('Lỗi', result.message || 'Xóa sách thất bại', 'error')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title='Đang tải...' />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Quản lý sách'
        action={
          <Button variant='contained' onClick={() => router.push('/admin/books/add')}>
            Thêm sách
          </Button>
        }
      />
      {books.length === 0 ? (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography>Không có sách nào</Typography>
        </Box>
      ) : (
        <TableBooks rows={books} onDelete={handleDelete} />
      )}
    </Card>
  )
}

export default withAdminAuth(Books)
