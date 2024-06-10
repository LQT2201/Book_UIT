import React, { useState, useEffect } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

const BASE_URL = 'http://127.0.0.1:8080/api'

const StatisticsCard = () => {
  const [orders, setOrders] = useState({})
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [maxTotalPrice, setMaxTotalPrice] = useState(0)
  const [totalStock, setTotalStock] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchData = async () => {
      try {
        const fetchOrders = fetch(`${BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(resp => resp.json())
        const fetchBooks = fetch(`${BASE_URL}/book`).then(resp => resp.json())
        const fetchUsers = fetch(`${BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(resp => resp.json())
        const [fetchOrder, fetchBook, fetchUserResponse] = await Promise.all([fetchOrders, fetchBooks, fetchUsers])

        setOrders(fetchOrder)
        setBooks(fetchBook)
        setUsers(fetchUserResponse)
        setOrderCount(fetchOrder.length)
        console.log(users)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData().catch(error => {
      console.log(error)
    })
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const totalPrices = orders.map(order =>
        typeof order.totalPrice === 'object'
          ? parseFloat(order.totalPrice.$numberDecimal)
          : parseFloat(order.totalPrice)
      )
      const maxPrice = Math.max(...totalPrices)
      console.log('Calculated maxTotalPrice:', maxPrice)
      setMaxTotalPrice(maxPrice)
    }

    if (books.length > 0) {
      const totalStock = books.reduce((acc, book) => acc + (book.stock || 0), 0)
      console.log('Calculated totalStock:', totalStock)
      setTotalStock(totalStock)
    }

    if (users.length > 0) {
      const adminUsers = users.filter(user => user.role === 'USER')
      console.log('Admin users:', adminUsers)
      setUserCount(adminUsers.length)
    }
  }, [orders, books, users])

  const salesData = [
    {
      stats: `${orderCount}`, // Chuyển đổi maxTotalPrice thành dạng hiển thị tiền tệ
      title: 'Sum Orders',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: `${userCount}`,
      title: 'Account Users',
      color: 'success',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: `${totalStock}`,
      title: 'Total Stock',
      color: 'warning',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    },

    {
      stats: `$${maxTotalPrice}`,
      color: 'info',
      title: 'Best sale',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    }
  ]

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title='Statistics Card'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Statistics
            </Box>{' '}
            😎
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
