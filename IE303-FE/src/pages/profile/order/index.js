// ** React Imports
import { useState, useEffect } from 'react'
import router from 'next/router'
import Link from 'next/link'
// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
// ** Icons Imports
import Grid from '@mui/material/Grid'
import DefaultLayout from 'src/layouts/DefaultLayout'
// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import formater from 'src/utils/formatCurrency'
import { Card, Container, Typography, Chip, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'

const BASE_URL = 'http://127.0.0.1:8080/api'

// Helper function to get status color
const getStatusColor = status => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
    case 'ĐANG XỬ LÝ':
      return '#FFA726' // Orange
    case 'COMPLETED':
    case 'ĐÃ GIAO':
      return '#66BB6A' // Green
    case 'CANCELLED':
    case 'ĐÃ HỦY':
      return '#F44336' // Red
    case 'SHIPPING':
    case 'ĐANG GIAO':
      return '#29B6F6' // Blue
    default:
      return '#9E9E9E' // Grey
  }
}

// Helper function to get formatted status label
const getStatusLabel = status => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
    case 'ĐANG XỬ LÝ':
      return 'Đang xử lý'
    case 'COMPLETED':
    case 'ĐÃ GIAO':
      return 'Đã giao'
    case 'CANCELLED':
    case 'ĐÃ HỦY':
      return 'Đã hủy'
    case 'SHIPPING':
    case 'ĐANG GIAO':
      return 'Đang giao'
    default:
      return status || 'Không xác định'
  }
}

const ProfileOrder = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)

  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#C92127'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        router.push('/')
      }
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token')
      setToken(tok)
      if (tok == null) router.push('/pages/login')
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchUserOrders()
    }
  }, [token])

  const fetchUserOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use the new API endpoint
      const response = await fetch(`${BASE_URL}/user/order`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Check if data has a data property (ResponseData wrapper)
      const ordersList = data.data ? data.data : data

      // Ensure we always have an array and sort by date (newest first)
      const ordersArray = Array.isArray(ordersList) ? ordersList : []

      // Sort orders by orderAt date (newest first)
      const sortedOrders = ordersArray.sort((a, b) => {
        const dateA = new Date(a.orderAt || 0)
        const dateB = new Date(b.orderAt || 0)
        return dateB - dateA
      })

      setOrders(sortedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color='primary' size={40} sx={{ mr: 2 }} />
        <Typography>Đang tải dữ liệu đơn hàng...</Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Grid container marginTop={30}>
        <Grid item xs={12} sm={3} bgcolor='white' borderRight={'red'}>
          <Link href='/profile'>
            <Box sx={{ cursor: 'pointer' }} padding={5}>
              <Typography>Tài khoản</Typography>
            </Box>
          </Link>
          <Link href='/profile/order'>
            <Box sx={{ cursor: 'pointer', borderLeft: '3px solid #C92127' }} padding={5}>
              <Typography fontWeight='bold'>Đơn hàng</Typography>
            </Box>
          </Link>
          <Box sx={{ cursor: 'pointer', color: '#C92127' }} padding={5} onClick={handleLogout}>
            <Typography>Đăng xuất</Typography>
          </Box>
        </Grid>
        <Grid item sm={1}></Grid>
        <Grid item xs={12} sm={8}>
          <TableContainer>
            <Card>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant='h6'>Lịch sử đơn hàng</Typography>
              </Box>

              {error ? (
                <Box p={4} textAlign='center'>
                  <Typography color='error' sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      color: '#C92127',
                      display: 'inline-block',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'rgba(201, 33, 39, 0.1)' }
                    }}
                    onClick={fetchUserOrders}
                  >
                    <Typography>Thử lại</Typography>
                  </Box>
                </Box>
              ) : orders.length === 0 ? (
                <Box p={4} textAlign='center'>
                  <Typography color='text.secondary'>Bạn chưa có đơn hàng nào</Typography>
                </Box>
              ) : (
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                        Ngày đặt
                      </TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                        Trạng thái
                      </TableCell>
                      <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        Tổng tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow
                        key={order.id}
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          },
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                      >
                        <TableCell component='th' scope='row' sx={{ fontWeight: 500 }}>
                          #{order.id}
                        </TableCell>
                        <TableCell align='center'>
                          {order.orderAt
                            ? new Date(order.orderAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            : 'N/A'}
                        </TableCell>
                        <TableCell align='center'>
                          <Box
                            sx={{
                              display: 'inline-block',
                              bgcolor: `${getStatusColor(order.orderStatus)}20`,
                              color: getStatusColor(order.orderStatus),
                              px: 2,
                              py: 0.5,
                              borderRadius: '16px',
                              fontWeight: 'medium',
                              fontSize: '0.8125rem'
                            }}
                          >
                            {getStatusLabel(order.orderStatus)}
                          </Box>
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold', color: '#C92127' }}>
                          {formater.format(order.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  )
}

ProfileOrder.getLayout = page => <DefaultLayout> {page} </DefaultLayout>
export default ProfileOrder
