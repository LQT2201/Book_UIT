// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import CardContent from '@mui/material/CardContent'
// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import DefaultLayout from 'src/layouts/DefaultLayout'
// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material'
import Swal from 'sweetalert2'

const BASE_URL = 'http://127.0.0.1:8080/api'

const Profile = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

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

  const handlePasswordChange = async () => {
    if (!password || password.length < 6) {
      Swal.fire('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự', 'error')
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/user/profile/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          newPassword: password
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update password')
      }

      Swal.fire('Thành công', 'Đổi mật khẩu thành công', 'success')
      setPassword('')
    } catch (error) {
      console.error(error)
      Swal.fire('Lỗi', 'Có lỗi xảy ra khi cập nhật mật khẩu', 'error')
    }
  }

  const handleProfileUpdate = async () => {
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${BASE_URL}/user/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setSuccess(true)
      Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success')
    } catch (error) {
      setError('Error updating profile: ' + error.message)
      Swal.fire('Lỗi', 'Cập nhật thông tin thất bại', 'error')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token')
      if (tok == null) router.push('/pages/login')
      setToken(tok)
      const fetchUser = async () => {
        try {
          const response = await fetch(`${BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tok}`
            }
          })
          if (!response.ok) {
            throw new Error('Failed to fetch profile')
          }
          const userData = await response.json()
          setUser(userData)
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || ''
          })
          setIsLoading(false)
        } catch (error) {
          console.error(error)
          Swal.fire('Lỗi', 'Không thể tải thông tin người dùng', 'error')
        }
      }
      fetchUser()
    }
  }, [])

  if (isLoading) return <p>Đang tải</p>

  return (
    <Container sx={{ marginTop: 5 }}>
      <Grid container marginTop={30}>
        <Grid item xs={12} sm={4} bgcolor='white'>
          <Link href='/profile'>
            <Box sx={{ cursor: 'pointer' }} padding={5}>
              <Typography>Tài khoản</Typography>
            </Box>
          </Link>
          <Link href='/profile/order'>
            <Box sx={{ cursor: 'pointer' }} padding={5}>
              Đơn hàng
            </Box>
          </Link>
          <Box sx={{ cursor: 'pointer', color: '#C92127' }} padding={5} onClick={handleLogout}>
            <Typography>Đăng xuất</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <form>
                <Grid container spacing={7}>
                  <Grid item xs={12} sm={6}>
                    <TextField disabled fullWidth label='Username' value={user?.username || ''} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Mật khẩu mới'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Họ và tên'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Số điện thoại'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Địa chỉ'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      sx={{ marginRight: 3.5, bgcolor: '#C92127', '&:hover': { bgcolor: '#A61B1B' } }}
                      onClick={handleProfileUpdate}
                    >
                      Cập nhật thông tin
                    </Button>
                    <Button
                      variant='contained'
                      sx={{ marginRight: 3.5, bgcolor: '#C92127', '&:hover': { bgcolor: '#A61B1B' } }}
                      onClick={handlePasswordChange}
                    >
                      Đổi mật khẩu
                    </Button>
                    <Button
                      type='reset'
                      variant='outlined'
                      color='error'
                      onClick={() => {
                        setPassword('')
                        setFormData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phoneNumber: user?.phoneNumber || '',
                          address: user?.address || ''
                        })
                      }}
                    >
                      Đặt lại
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

Profile.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default Profile
