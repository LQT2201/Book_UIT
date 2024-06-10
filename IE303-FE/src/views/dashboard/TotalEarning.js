// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import React, { useState, useEffect } from 'react'

const BASE_URL = 'http://127.0.0.1:8080/api'

const TotalEarning = () => {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [canceledCount, setCanceledCount] = useState(0)
  const [deliveredCount, setDeliveredCount] = useState(0)
  const [shippingCount, setShippingCount] = useState(0)
  const sum = canceledCount + deliveredCount + shippingCount

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const fetchOrder = await response.json()

        console.log('Fetched orders:', fetchOrder)
        setOrders(fetchOrder)

        const totalPrices = fetchOrder.map(order =>
          typeof order.totalPrice === 'object'
            ? parseFloat(order.totalPrice.$numberDecimal)
            : parseFloat(order.totalPrice)
        )

        // Sử dụng reduce để tính tổng
        const totalAmount = totalPrices.reduce((acc, price) => acc + price, 0)

        // Set giá trị tổng vào state total
        setTotal(totalAmount)
        const canceled = fetchOrder.filter(order => order.orderStatus === '"Đã hủy"').length
        const delivered = fetchOrder.filter(order => order.orderStatus === '"Đã nhận"').length
        const shipping = fetchOrder.filter(order => order.orderStatus === '"Đang giao"').length

        setCanceledCount(canceled)
        setDeliveredCount(delivered)
        setShippingCount(shipping)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrders()
  }, [])

  const data = [
    {
      progress: (deliveredCount / sum) * 100,
      imgHeight: 20,
      title: 'DELIVERED',
      color: 'primary',
      amount: `${deliveredCount}`,
      imgSrc: '/images/cards/logo-zipcar.png'
    },
    {
      progress: (shippingCount / sum) * 100,
      color: 'info',
      imgHeight: 27,
      title: 'SHIPPING',
      amount: `${shippingCount}`,
      imgSrc: '/images/cards/logo-bitbank.png'
    },
    {
      progress: (canceledCount / sum) * 100,
      imgHeight: 20,
      title: 'CANCELED',
      color: 'secondary',
      amount: `${canceledCount}`,
      imgSrc: '/images/cards/logo-aviato.png'
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Detail Orders'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
            ${total}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
              10%
            </Typography>
          </Box>
        </Box>

        {data.map((item, index) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== data.length - 1 ? { mb: 8.5 } : {})
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                }}
              >
                <img src={item.imgSrc} alt={item.title} height={item.imgHeight} />
              </Avatar>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    {item.amount}
                  </Typography>
                  <LinearProgress color={item.color} value={item.progress} variant='determinate' />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TotalEarning
