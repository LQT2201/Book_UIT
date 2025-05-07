import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import formater from 'src/utils/formatCurrency'
import DefaultLayout from 'src/layouts/DefaultLayout'
import {
  TextField,
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Breadcrumbs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material'
import Link from 'next/link'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PaymentIcon from '@mui/icons-material/Payment'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ReceiptIcon from '@mui/icons-material/Receipt'
import Swal from 'sweetalert2'

const BASE_URL = 'http://127.0.0.1:8080/api'

const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

export default function Checkout() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const calculateTotal = () => {
    if (!Array.isArray(cart) || cart.length === 0) return 0
    return cart.reduce((acc, curr) => acc + (parseInt(curr?.quantity) || 0) * (curr?.price || 0), 0)
  }

  const updateCart = async newCart => {
    try {
      const response = await fetch(`${BASE_URL}/user/cart`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCart)
      })

      if (!response.ok) {
        throw new Error('Lỗi cập nhật giỏ hàng')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${BASE_URL}/user/cart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCart(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch cart, status:', response.status)
        setCart([])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        if (userData.address) {
          setAddress(userData.address)
        }
      } else {
        console.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = getToken()
      if (!tok) {
        router.push('/pages/login')
        return
      }
      setToken(tok)
    }
  }, [router])

  useEffect(() => {
    if (token) {
      fetchCart()
      fetchUserInfo()
    }
  }, [token])

  const handleQuantityChange = async (itemId, newQuantity) => {
    // Prevent negative or zero quantity
    if (newQuantity < 1) newQuantity = 1

    try {
      const updatedCart = cart.map(item => {
        if (item.itemId === itemId) {
          return { ...item, quantity: parseInt(newQuantity) || 1 }
        }
        return item
      })

      await updateCart(updatedCart)
      setCart(updatedCart)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const incrementQuantity = async itemId => {
    const item = cart.find(i => i.itemId === itemId)
    if (item) {
      await handleQuantityChange(itemId, item.quantity + 1)
    }
  }

  const decrementQuantity = async itemId => {
    const item = cart.find(i => i.itemId === itemId)
    if (item && item.quantity > 1) {
      await handleQuantityChange(itemId, item.quantity - 1)
    }
  }

  const handleRemoveItem = async itemId => {
    try {
      const updatedCart = cart.filter(item => item.itemId !== itemId)
      await updateCart(updatedCart)
      setCart(updatedCart)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handlePaymentMethodChange = event => {
    setPaymentMethod(event.target.value)
  }

  const handleCheckout = async () => {
    if (!address) {
      Swal.fire('Vui lòng nhập địa chỉ giao hàng', '', 'warning')
      return
    }

    if (cart.length === 0) {
      Swal.fire('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng', 'warning')
      return
    }

    try {
      let response

      const orderData = {
        username: user?.username || '',
        items: cart,
        status: 'PENDING',
        shippingAddress: address
      }

      switch (paymentMethod) {
        case 'COD':
          response = await fetch(`${BASE_URL}/order/checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          })

          if (response.ok) {
            Swal.fire('Đặt hàng thành công', '', 'success')
            router.push('/')
          } else {
            Swal.fire('Đặt hàng thất bại', '', 'error')
          }
          break

        case 'ONLINE':
          response = await fetch(`${BASE_URL}/payment/vn-pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          })

          if (response.ok) {
            const data = await response.json()
            if (data.paymentUrl) {
              window.location.href = data.paymentUrl
            } else {
              Swal.fire('Tạo thanh toán thất bại', 'Không thể tạo URL thanh toán', 'error')
            }
          } else {
            Swal.fire('Đặt hàng thất bại', '', 'error')
          }
          break

        default:
          Swal.fire('Phương thức thanh toán không hợp lệ', '', 'error')
          break
      }
    } catch (error) {
      console.error('Checkout error:', error)
      Swal.fire('Lỗi hệ thống', 'Vui lòng thử lại sau', 'error')
    }
  }

  if (isLoading) {
    return (
      <Container
        sx={{ marginTop: '120px', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant='h6'>Đang tải thông tin thanh toán...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ marginTop: '100px', marginBottom: '50px', minHeight: '60vh' }}>
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 4 }}>
        <Link href='/' passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Trang chủ
        </Link>
        <Link href='/cart' passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Giỏ hàng
        </Link>
        <Typography color='text.primary'>Thanh toán</Typography>
      </Breadcrumbs>

      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600, color: '#333' }}>
        <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#C92127' }} />
        Thanh toán
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Shipping Information */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ mr: 1, color: '#C92127' }} />
              Thông tin giao hàng
            </Typography>

            <TextField
              label='Địa chỉ giao hàng'
              variant='outlined'
              fullWidth
              value={address}
              onChange={e => setAddress(e.target.value)}
              sx={{ mb: 2 }}
              required
              placeholder='Nhập địa chỉ giao hàng chi tiết'
            />
          </Paper>

          {/* Payment Method */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ mr: 1, color: '#C92127' }} />
              Phương thức thanh toán
            </Typography>

            <FormControl fullWidth>
              <InputLabel id='payment-method-label'>Chọn phương thức thanh toán</InputLabel>
              <Select
                labelId='payment-method-label'
                id='payment-method'
                value={paymentMethod}
                label='Chọn phương thức thanh toán'
                onChange={handlePaymentMethodChange}
              >
                <MenuItem value='COD'>Thanh toán khi nhận hàng (COD)</MenuItem>
                <MenuItem value='ONLINE'>Thanh toán trực tuyến (VNPay)</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Order Items */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Chi tiết đơn hàng
            </Typography>

            {cart.length === 0 ? (
              <Box textAlign='center' py={3}>
                <Typography variant='body1' color='text.secondary'>
                  Không có sản phẩm trong giỏ hàng
                </Typography>
                <Button
                  component={Link}
                  href='/search'
                  variant='contained'
                  sx={{ mt: 2, bgcolor: '#C92127', '&:hover': { bgcolor: '#a51c21' } }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            ) : (
              <>
                {cart.map((item, index) => (
                  <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box display='flex' alignItems='center'>
                        <Box
                          component='img'
                          src={item.image}
                          alt={item.title}
                          sx={{ width: 80, height: 80, objectFit: 'contain', mr: 2 }}
                        />

                        <Box flex={1}>
                          <Typography variant='subtitle2' fontWeight={600} mb={0.5}>
                            {item.title}
                          </Typography>

                          <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Typography variant='body2' color='#C92127' fontWeight={600}>
                              {formater.format(item.price)}
                            </Typography>

                            <Box display='flex' alignItems='center'>
                              <IconButton
                                size='small'
                                onClick={() => decrementQuantity(item.itemId)}
                                sx={{ bgcolor: '#f5f5f5', width: 24, height: 24, mr: 1 }}
                              >
                                <RemoveIcon fontSize='small' />
                              </IconButton>

                              <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</Typography>

                              <IconButton
                                size='small'
                                onClick={() => incrementQuantity(item.itemId)}
                                sx={{ bgcolor: '#f5f5f5', width: 24, height: 24, ml: 1 }}
                              >
                                <AddIcon fontSize='small' />
                              </IconButton>

                              <IconButton
                                size='small'
                                color='error'
                                onClick={() => handleRemoveItem(item.itemId)}
                                sx={{ ml: 1 }}
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 2, position: 'sticky', top: '120px' }}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
              <Typography variant='h6' fontWeight={600}>
                Tóm tắt đơn hàng
              </Typography>
            </Box>

            <Box p={3}>
              <Box display='flex' justifyContent='space-between' mb={2}>
                <Typography color='text.secondary'>Tạm tính:</Typography>
                <Typography>{formater.format(calculateTotal())}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' mb={2}>
                <Typography color='text.secondary'>Phí vận chuyển:</Typography>
                <Typography>{formater.format(0)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display='flex' justifyContent='space-between' mb={3}>
                <Typography fontWeight={600}>Tổng cộng:</Typography>
                <Typography fontWeight={700} color='#C92127' fontSize='1.2rem'>
                  {formater.format(calculateTotal())}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  bgcolor: '#C92127',
                  color: 'white',
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#a51c21' },
                  '&.Mui-disabled': {
                    bgcolor: '#f5f5f5',
                    color: '#bdbdbd'
                  }
                }}
                disabled={cart.length === 0 || !address}
                onClick={handleCheckout}
              >
                Xác nhận đặt hàng
              </Button>

              <Link href='/cart' style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant='outlined'
                  size='large'
                  sx={{
                    mt: 2,
                    color: '#333',
                    borderColor: '#e0e0e0',
                    '&:hover': {
                      borderColor: '#C92127',
                      bgcolor: 'rgba(201, 33, 39, 0.04)'
                    }
                  }}
                >
                  Quay lại giỏ hàng
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

Checkout.getLayout = page => <DefaultLayout>{page}</DefaultLayout>
