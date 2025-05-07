import { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const AddUser = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: 'USER'
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://127.0.0.1:8080/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        Swal.fire('Thành công', 'Thêm người dùng thành công', 'success')
        router.push('/admin/users')
      } else {
        const error = await response.json()
        Swal.fire('Lỗi', error.message || 'Không thể thêm người dùng', 'error')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi thêm người dùng', 'error')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Thêm người dùng mới' />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Tên đăng nhập'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Mật khẩu'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Họ và tên'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Số điện thoại'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Địa chỉ'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Vai trò</InputLabel>
                    <Select name='role' value={formData.role} onChange={handleChange} label='Vai trò' required>
                      <MenuItem value='USER'>Người dùng</MenuItem>
                      <MenuItem value='ADMIN'>Quản trị viên</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                    Thêm người dùng
                  </Button>
                  <Button variant='outlined' color='secondary' onClick={() => router.push('/admin/users')}>
                    Hủy
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AddUser
