import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import Link from '@mui/material/Link'
import TableOrders from './TableOrders'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Swal from 'sweetalert2'
import withAdminAuth from 'src/middleware/adminAuth'
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  AccessTime as PendingIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    paid: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://127.0.0.1:8080/api/order', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || []
        setOrders(data)

        // Calculate statistics
        const newStats = {
          total: data.length,
          pending: data.filter(order => order.orderStatus === 'Chưa cập nhật').length,
          processing: data.filter(order => order.orderStatus === 'Đang xử lý').length,
          shipping: data.filter(order => order.orderStatus === 'Đang giao').length,
          delivered: data.filter(order => order.orderStatus === 'Đã giao').length,
          cancelled: data.filter(order => order.orderStatus === 'Đã hủy').length,
          paid: data.filter(order => order.orderStatus === 'Đã thanh toán').length
        }
        setStats(newStats)
      } else {
        Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng', 'error')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi tải danh sách đơn hàng', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = async orderId => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/order/${orderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data) {
          // Ensure all required fields are present
          const orderData = {
            ...result.data,
            orderAt: result.data.orderAt || new Date(),
            totalPrice: result.data.totalPrice || 0,
            orderStatus: result.data.orderStatus || 'Chưa cập nhật',
            shippingAddress: result.data.shippingAddress || 'Không có địa chỉ',
            orderItems: result.data.orderItems || []
          }
          setSelectedOrder(orderData)
        } else {
          Swal.fire('Lỗi', 'Không tìm thấy thông tin đơn hàng', 'error')
        }
      } else {
        Swal.fire('Lỗi', 'Không thể tải thông tin đơn hàng', 'error')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi tải thông tin đơn hàng', 'error')
    }
  }

  const handleDeleteOrder = async orderId => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/order/delete/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        Swal.fire('Thành công', 'Xóa đơn hàng thành công', 'success')
        setOrders(orders.filter(order => order.id !== orderId))
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null)
        }
      } else {
        Swal.fire('Lỗi', 'Không thể xóa đơn hàng', 'error')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi xóa đơn hàng', 'error')
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/order/${orderId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStatus)
      })

      if (response.ok) {
        Swal.fire('Thành công', 'Cập nhật trạng thái đơn hàng thành công', 'success')
        fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          handleViewOrder(orderId)
        }
      } else {
        Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng', 'error')
    }
  }

  if (loading) {
    return <Typography>Đang tải...</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Quản lý đơn hàng' />
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <ShoppingCartIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.total}</Typography>
                    <Typography variant='body2'>Tổng đơn hàng</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <PendingIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.pending + stats.processing}</Typography>
                    <Typography variant='body2'>Đang chờ xử lý</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <ShippingIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.shipping}</Typography>
                    <Typography variant='body2'>Đang giao hàng</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.delivered}</Typography>
                    <Typography variant='body2'>Đã giao hàng</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <CancelIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.cancelled}</Typography>
                    <Typography variant='body2'>Đơn hàng đã hủy</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <PaymentIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant='h6'>{stats.paid}</Typography>
                    <Typography variant='body2'>Đã thanh toán</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {selectedOrder && (
              <Card sx={{ mb: 4 }}>
                <CardHeader
                  title={`Chi tiết đơn hàng #${selectedOrder.id}`}
                  action={
                    <Button variant='outlined' color='primary' onClick={() => setSelectedOrder(null)}>
                      Đóng
                    </Button>
                  }
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='subtitle1' gutterBottom>
                        <strong>Thông tin đơn hàng:</strong>
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography>
                          <strong>Mã đơn hàng:</strong> {selectedOrder.id}
                        </Typography>
                        <Typography>
                          <strong>Người đặt:</strong> {selectedOrder.username}
                        </Typography>
                        <Typography>
                          <strong>Ngày đặt:</strong>{' '}
                          {new Date(selectedOrder.orderAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        <Typography>
                          <strong>Trạng thái:</strong>{' '}
                          <Chip
                            label={selectedOrder.orderStatus}
                            color={
                              selectedOrder.orderStatus === 'Đã hủy'
                                ? 'error'
                                : selectedOrder.orderStatus === 'Đã giao' ||
                                  selectedOrder.orderStatus === 'Đã thanh toán'
                                ? 'success'
                                : selectedOrder.orderStatus === 'Đang giao'
                                ? 'info'
                                : selectedOrder.orderStatus === 'Đang xử lý'
                                ? 'warning'
                                : 'default'
                            }
                            size='small'
                          />
                        </Typography>
                        <Typography>
                          <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
                        </Typography>
                        <Typography>
                          <strong>Tổng tiền:</strong>{' '}
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(selectedOrder.totalPrice)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='subtitle1' gutterBottom>
                        <strong>Chi tiết sản phẩm:</strong>
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Mã sản phẩm</TableCell>
                              <TableCell>Số lượng</TableCell>
                              <TableCell>Đơn giá</TableCell>
                              <TableCell>Thành tiền</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedOrder.orderItems &&
                              selectedOrder.orderItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.itemId}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(item.price || 0)}
                                  </TableCell>
                                  <TableCell>
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format((item.price || 0) * (item.quantity || 0))}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Đang xử lý')}
                          disabled={selectedOrder.orderStatus === 'Đang xử lý'}
                        >
                          Xử lý
                        </Button>
                        <Button
                          variant='contained'
                          color='info'
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Đang giao')}
                          disabled={selectedOrder.orderStatus === 'Đang giao'}
                        >
                          Giao hàng
                        </Button>
                        <Button
                          variant='contained'
                          color='success'
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Đã giao')}
                          disabled={selectedOrder.orderStatus === 'Đã giao'}
                        >
                          Hoàn thành
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Đã hủy')}
                          disabled={selectedOrder.orderStatus === 'Đã hủy'}
                        >
                          Hủy đơn
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            <TableOrders rows={orders} onDelete={handleDeleteOrder} onView={handleViewOrder} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAdminAuth(Orders)
