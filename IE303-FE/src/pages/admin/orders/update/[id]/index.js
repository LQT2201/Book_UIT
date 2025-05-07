import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  CardContent,
  styled,
  Typography,
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material'
import withAdminAuth from 'src/middleware/adminAuth'
import Swal from 'sweetalert2'

const BASE_URL = 'http://127.0.0.1:8080/api'

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

// Function to clean order status (remove quotes if present)
const cleanOrderStatus = status => {
  if (!status) return 'Chưa cập nhật'

  // Remove quotes if present
  if (typeof status === 'string' && status.startsWith('"') && status.endsWith('"')) {
    return status.slice(1, -1)
  }
  return status
}

// Function to format date
const formatDate = dateString => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return dateString
  }
}

// Function to format shipping address
const formatShippingAddress = address => {
  if (!address) return 'Không có địa chỉ'

  // Check if address is a JSON string
  if (address.startsWith('{') && address.endsWith('}')) {
    try {
      const parsedAddress = JSON.parse(address)
      // Check for different possible structures
      if (parsedAddress.shippingAddress) {
        return parsedAddress.shippingAddress
      } else if (parsedAddress.address) {
        return parsedAddress.address
      }
      return address // Return original if no known properties are found
    } catch (error) {
      return address // Return original if parsing fails
    }
  }

  return address
}

const UpdateOrder = () => {
  const [order, setOrder] = useState(null)
  const [orderStatus, setOrderStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const adminToken = localStorage.getItem('adminToken')
        const response = await fetch(`${BASE_URL}/order/${router.query.id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch order')

        const data = await response.json()
        setOrder(data)
        // Clean the status before setting it
        setOrderStatus(cleanOrderStatus(data.orderStatus))
        setError(null)
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    if (router.query.id) {
      fetchOrder()
    }
  }, [router.query.id])

  const handleStatusChange = event => {
    setOrderStatus(event.target.value)
  }

  const handleUpdate = async () => {
    const adminToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${BASE_URL}/order/${router.query.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderStatus })
      })

      if (response.ok) {
        Swal.fire('Đã cập nhật', 'Trạng thái đơn hàng đã được cập nhật thành công', 'success')
        router.back()
      } else {
        const errorData = await response.text()
        Swal.fire('Lỗi', `Không thể cập nhật trạng thái đơn hàng: ${errorData}`, 'error')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.', 'error')
    }
  }

  if (loading) {
    return (
      <CardContent>
        <Typography>Đang tải thông tin đơn hàng...</Typography>
      </CardContent>
    )
  }

  if (error) {
    return (
      <CardContent>
        <Typography color='error'>{error}</Typography>
        <Button variant='outlined' onClick={() => router.back()} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </CardContent>
    )
  }

  if (!order) {
    return (
      <CardContent>
        <Typography>Không tìm thấy thông tin đơn hàng</Typography>
        <Button variant='outlined' onClick={() => router.back()} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </CardContent>
    )
  }

  return (
    <CardContent>
      <Typography variant='h5' component='h1' gutterBottom>
        Chi tiết đơn hàng
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' fontWeight='bold'>
              Mã đơn hàng:
            </Typography>
            <Typography variant='body1' gutterBottom>
              {order.id}
            </Typography>

            <Typography variant='subtitle1' fontWeight='bold'>
              Khách hàng:
            </Typography>
            <Typography variant='body1' gutterBottom>
              {order.username}
            </Typography>

            <Typography variant='subtitle1' fontWeight='bold'>
              Địa chỉ giao hàng:
            </Typography>
            <Typography variant='body1' gutterBottom>
              {formatShippingAddress(order.shippingAddress)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' fontWeight='bold'>
              Ngày đặt hàng:
            </Typography>
            <Typography variant='body1' gutterBottom>
              {formatDate(order.orderAt)}
            </Typography>

            <Typography variant='subtitle1' fontWeight='bold'>
              Tổng tiền:
            </Typography>
            <Typography variant='body1' gutterBottom>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
            </Typography>

            <Typography variant='subtitle1' fontWeight='bold'>
              Trạng thái hiện tại:
            </Typography>
            <Chip
              label={orderStatus}
              color={
                orderStatus.toLowerCase().includes('đã hủy')
                  ? 'error'
                  : orderStatus.toLowerCase().includes('đã giao') || orderStatus.toLowerCase().includes('thanh toán')
                  ? 'success'
                  : orderStatus.toLowerCase().includes('đang giao')
                  ? 'info'
                  : orderStatus.toLowerCase().includes('đang xử lý')
                  ? 'warning'
                  : 'default'
              }
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {order.orderItems && order.orderItems.length > 0 && order.orderItems[0].itemId && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Sản phẩm trong đơn hàng
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align='center'>Hình ảnh</TableCell>
                  <TableCell align='right'>Đơn giá</TableCell>
                  <TableCell align='right'>Số lượng</TableCell>
                  <TableCell align='right'>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.title || 'Không có tên'}</TableCell>
                    <TableCell align='center'>
                      {item.image ? (
                        <Box
                          component='img'
                          src={item.image}
                          alt={item.title}
                          sx={{ width: 50, height: 50, objectFit: 'contain' }}
                        />
                      ) : (
                        'Không có ảnh'
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {item.price
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)
                        : 'Không có giá'}
                    </TableCell>
                    <TableCell align='right'>{item.quantity || 0}</TableCell>
                    <TableCell align='right'>
                      {item.price && item.quantity
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            item.price * item.quantity
                          )
                        : 'Không có dữ liệu'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Cập nhật trạng thái đơn hàng
        </Typography>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='order-status-select-label'>Trạng thái đơn hàng</InputLabel>
                <Select
                  labelId='order-status-select-label'
                  id='order-status-select'
                  value={orderStatus}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label='Trạng thái đơn hàng' />}
                >
                  <MenuItem value='Chưa cập nhật'>Chưa cập nhật</MenuItem>
                  <MenuItem value='Đang xử lý'>Đang xử lý</MenuItem>
                  <MenuItem value='Đang giao'>Đang giao</MenuItem>
                  <MenuItem value='Đã giao'>Đã giao</MenuItem>
                  <MenuItem value='Đã hủy'>Đã hủy</MenuItem>
                  <MenuItem value='Đã thanh toán'>Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' sx={{ marginRight: 2 }} onClick={handleUpdate}>
                Cập nhật
              </Button>
              <Button variant='outlined' onClick={() => router.back()}>
                Quay lại
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </CardContent>
  )
}

export default withAdminAuth(UpdateOrder)
