import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Container, Divider, Paper } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Layout
import DefaultLayout from 'src/layouts/DefaultLayout'

// Utils
import formater from 'src/utils/formatCurrency'

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

const OrderDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token')
      setToken(tok)
      if (tok == null) router.push('/pages/login')
    }
  }, [])

  useEffect(() => {
    if (token && id) {
      fetchOrderDetails()
    }
  }, [token, id])

  const fetchOrderDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${BASE_URL}/order/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Order data:', result) // Debug log

      // Check if data is wrapped in ResponseData
      const orderData = result.data ? result.data : result

      // Transform order data to match the expected structure
      const transformedOrder = {
        id: orderData._id,
        username: orderData.username,
        totalPrice: orderData.totalPrice,
        orderStatus: orderData.orderStatus,
        shippingAddress: orderData.shippingAddress,
        orderAt: orderData.orderAt,
        items: orderData.orderItems?.map(item => ({
          itemId: item.itemId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          images: [item.image] // Convert single image to array for consistency
        }))
      }

      setOrder(transformedOrder)
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color='primary' size={40} sx={{ mr: 2 }} />
        <Typography>Đang tải thông tin đơn hàng...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ mt: 30 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => router.push('/profile/order')}>
            Quay lại danh sách đơn hàng
          </Button>
        </Card>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container sx={{ mt: 30 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ mb: 2 }}>Không tìm thấy thông tin đơn hàng</Typography>
          <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => router.push('/profile/order')}>
            Quay lại danh sách đơn hàng
          </Button>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Grid container marginTop={30} spacing={4}>
        <Grid item xs={12}>
          <Link href='/profile/order' passHref>
            <Button variant='outlined' startIcon={<ArrowBackIcon />} component='a' sx={{ mb: 2 }}>
              Quay lại danh sách đơn hàng
            </Button>
          </Link>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Chi tiết đơn hàng #{order.id}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Thông tin đơn hàng
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Mã đơn hàng:</Typography>
                    <Typography>{order.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Ngày đặt:</Typography>
                    <Typography>
                      {order.orderAt
                        ? new Date(order.orderAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Trạng thái:</Typography>
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
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Thông tin giao hàng
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Địa chỉ:</Typography>
                    <Typography>{order.shippingAddress || 'Không có thông tin'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Người nhận:</Typography>
                    <Typography>{order.username || 'Không có thông tin'}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
              Sản phẩm đã đặt
            </Typography>

            <TableContainer component={Paper} variant='outlined'>
              <Table sx={{ minWidth: 650 }} aria-label='products table'>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align='center'>Đơn giá</TableCell>
                    <TableCell align='center'>Số lượng</TableCell>
                    <TableCell align='right'>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items &&
                    order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.images && item.images[0] && (
                              <Box
                                component='img'
                                src={item.images[0]}
                                alt={item.title || 'Sản phẩm'}
                                sx={{ width: 50, height: 50, objectFit: 'cover', mr: 2 }}
                              />
                            )}
                            <Box>
                              <Typography sx={{ fontWeight: 'medium' }}>
                                {item.title || 'Sản phẩm #' + item.itemId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align='center'>{formater.format(item.price)}</TableCell>
                        <TableCell align='center'>{item.quantity}</TableCell>
                        <TableCell align='right'>{formater.format(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#C92127' }}>
                Tổng tiền: {formater.format(order.totalPrice)}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

OrderDetail.getLayout = page => <DefaultLayout>{page}</DefaultLayout>
export default OrderDetail
