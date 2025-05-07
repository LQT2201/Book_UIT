import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Divider,
  Paper
} from '@mui/material'
import { useEffect, useState } from 'react'
import DefaultLayout from 'src/layouts/DefaultLayout'
import formater from 'src/utils/formatCurrency'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const BASE_URL = 'http://127.0.0.1:8080/api'

const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

const CartPage = () => {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
        console.log('Failed to fetch cart, status:', response.status)
        setCart([])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart([])
    } finally {
      setIsLoading(false)
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

  if (isLoading) {
    return (
      <Container
        sx={{ marginTop: '120px', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant='h6'>Đang tải giỏ hàng...</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ marginTop: '100px', marginBottom: '50px', minHeight: '60vh' }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600, color: '#333' }}>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#C92127' }} />
        Giỏ hàng của bạn
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
                Giỏ hàng của bạn đang trống
              </Typography>
              <Link href='/search'>
                <Button
                  variant='contained'
                  sx={{
                    bgcolor: '#C92127',
                    '&:hover': { bgcolor: '#a51c21' }
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </Paper>
          ) : (
            cart.map((item, i) => (
              <Card key={i} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box display='flex' p={3}>
                    <Box sx={{ width: 120, height: 120, flexShrink: 0, mr: 3 }}>
                      <Box
                        component='img'
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 1
                        }}
                        src={item.image}
                        alt={item.title}
                      />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                          Mã sản phẩm: {item.itemId}
                        </Typography>
                      </Box>

                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='h6' color='#C92127' fontWeight={700}>
                          {formater.format(item.price)}
                        </Typography>

                        <Box display='flex' alignItems='center'>
                          <IconButton
                            size='small'
                            onClick={() => decrementQuantity(item.itemId)}
                            sx={{ bgcolor: '#f0f0f0', mr: 1 }}
                          >
                            <RemoveIcon fontSize='small' />
                          </IconButton>

                          <TextField
                            size='small'
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item.itemId, e.target.value)}
                            inputProps={{
                              min: 1,
                              style: { textAlign: 'center', width: '40px' }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#e0e0e0'
                                }
                              }
                            }}
                          />

                          <IconButton
                            size='small'
                            onClick={() => incrementQuantity(item.itemId)}
                            sx={{ bgcolor: '#f0f0f0', ml: 1 }}
                          >
                            <AddIcon fontSize='small' />
                          </IconButton>

                          <IconButton color='error' onClick={() => handleRemoveItem(item.itemId)} sx={{ ml: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
              <Typography variant='h6' fontWeight={600}>
                Tóm tắt đơn hàng
              </Typography>
            </Box>

            <Box p={3}>
              <Box display='flex' justifyContent='space-between' mb={2}>
                <Typography color='text.secondary'>Số lượng sản phẩm:</Typography>
                <Typography fontWeight={500}>
                  {Array.isArray(cart) ? cart.reduce((acc, curr) => acc + (parseInt(curr?.quantity) || 0), 0) : 0}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display='flex' justifyContent='space-between' mb={1}>
                <Typography fontWeight={600}>Tổng tiền:</Typography>
                <Typography fontWeight={700} color='#C92127' fontSize='1.2rem'>
                  {formater.format(
                    Array.isArray(cart)
                      ? cart.reduce((acc, curr) => acc + (parseInt(curr?.quantity) || 0) * (curr?.price || 0), 0)
                      : 0
                  )}
                </Typography>
              </Box>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3, fontSize: '0.8rem' }}>
                * Đã bao gồm thuế VAT
              </Typography>

              <Link
                href={Array.isArray(cart) && cart.length > 0 ? '/checkout' : '#'}
                style={{ textDecoration: 'none' }}
              >
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
                  disabled={!Array.isArray(cart) || cart.length === 0}
                  onClick={e => {
                    if (!Array.isArray(cart) || cart.length === 0) {
                      e.preventDefault()
                    }
                  }}
                >
                  Thanh Toán
                </Button>
              </Link>

              <Link href='/search' style={{ textDecoration: 'none' }}>
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
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

CartPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default CartPage
