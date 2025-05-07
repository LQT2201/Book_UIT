import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SearchIcon from '@mui/icons-material/Search'
import LoginIcon from '@mui/icons-material/Login'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import LogoutIcon from '@mui/icons-material/Logout'
import { Container, Grid, Link, Button, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #CDCFD0',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: 'white'
  },
  marginRight: theme.spacing(10),
  width: '90%',
  height: '40px',
  lineHeight: '40px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: '#C92127',
  width: '72px',
  height: '30px',
  border: '2px solid #C92127',
  borderRadius: '8px'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#545759',
  width: '90%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width')
  }
}))

export default function SearchAppBar() {
  const [search, setSearch] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    handleMenuClose()
    router.push('/')
  }

  return (
    <AppBar sx={{ background: '#004153' }}>
      <Container maxWidth='lg'>
        <Toolbar>
          <Grid container alignItems='center'>
            <Grid item md={3}>
              <Link href='/'>
                <Box width='220px'>
                  <Box
                    component='img'
                    width='220px'
                    src='https://res.cloudinary.com/dgtac4atn/image/upload/v1745692578/vc4ja59zmughcdtzxb8s.jpg'
                  />
                </Box>
              </Link>
            </Grid>
            <Grid item md={6}>
              <Search>
                <StyledInputBase
                  placeholder='Tìm kiếm ...'
                  onChange={e => setSearch(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      router.push(`/search${search ? `?keyword=${search}` : ''}`)
                    }
                  }}
                />
                <SearchIconWrapper>
                  <Link href={`/search${search ? `?keyword=${search}` : ''}`}>
                    <IconButton color='white'>
                      <SearchIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Link>
                </SearchIconWrapper>
              </Search>
            </Grid>
            <Grid item md={1} />
            <Grid item md={2} textAlign='center' flexDirection='row' display='flex' justifyContent='space-between'>
              <Link href='/cart'>
                <Box flexDirection='column' display='flex'>
                  <IconButton sx={{ padding: '0px' }}>
                    <ShoppingCartOutlinedIcon sx={{ color: '#fff' }} />
                  </IconButton>
                  <Typography component='span' sx={{ fontSize: '13px', lineHeight: '18px', color: '#fff' }}>
                    Giỏ hàng
                  </Typography>
                </Box>
              </Link>

              {isLoggedIn ? (
                <>
                  <Box flexDirection='column' display='flex'>
                    <IconButton
                      sx={{ padding: '0px' }}
                      onClick={handleMenuOpen}
                      aria-controls='account-menu'
                      aria-haspopup='true'
                    >
                      <AccountBoxOutlinedIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <Typography component='span' sx={{ fontSize: '13px', lineHeight: '18px', color: '#fff' }}>
                      Tài khoản
                    </Typography>
                    <Menu
                      id='account-menu'
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleMenuClose()
                          router.push('/profile')
                        }}
                      >
                        <AccountBoxOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
                        Hồ sơ
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize='small' sx={{ mr: 1 }} />
                        Đăng xuất
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link href='/pages/login' underline='none'>
                    <Box flexDirection='column' display='flex' alignItems='center'>
                      <IconButton sx={{ padding: '0px', color: '#fff' }}>
                        <LoginIcon />
                      </IconButton>
                      <Typography component='span' sx={{ fontSize: '13px', lineHeight: '18px', color: '#fff' }}>
                        Đăng nhập
                      </Typography>
                    </Box>
                  </Link>
                  {/* <Link href='/pages/register' underline='none'>
                    <Box flexDirection='column' display='flex' alignItems='center'>
                      <IconButton sx={{ padding: '0px' }}>
                        <HowToRegIcon />
                      </IconButton>
                      <Typography component='span' sx={{ fontSize: '13px', lineHeight: '18px', color: '#7A7E7F' }}>
                        Đăng ký
                      </Typography>
                    </Box>
                  </Link> */}
                </Box>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
