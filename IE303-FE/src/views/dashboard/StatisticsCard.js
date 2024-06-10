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

const BASE_URL = 'http://127.0.0.1:8080/api' // Ensure this is correctly set

const StatisticsCard = () => {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [maxTotalPrice, setMaxTotalPrice] = useState(0)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchOrders = fetch(`${BASE_URL}/order`).then(resp => resp.json())
        const fetchUsers = fetch(`${BASE_URL}/user`).then(resp => resp.json())
        const [fetchOrder, fetchUser] = await Promise.all([fetchOrders, fetchUsers])

        console.log('Fetched orders:', fetchOrder)
        console.log('Fetched users:', fetchUser)

        setOrders(fetchOrder)
        setUsers(fetchUser)
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

    if (users.length > 0) {
      const userCount = users.filter(user => user.role === 'USER').length
      console.log('Calculated userCount:', userCount)
      setUserCount(userCount)
    }
  }, [orders, users])

  const salesData = [
    {
      stats: `$${maxTotalPrice}`, // Chuyển đổi maxTotalPrice thành dạng hiển thị tiền tệ
      title: 'Best Sales',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: `${userCount}`,
      title: 'Users',
      color: 'success',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '1.54k',
      color: 'warning',
      title: 'Products',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '$88k',
      color: 'info',
      title: 'Revenue',
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
