import { Card, CardContent, CardHeader, Grid, Typography, Button } from '@mui/material'
import React from 'react'
import Link from '@mui/material/Link'
import TableUsers from './TableUsers'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Swal from 'sweetalert2'

const Users = () => {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      try {
        const resp = await fetch('http://127.0.0.1:8080/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (resp.ok) {
          const data = await resp.json()
          setUsers(data)
        } else {
          Swal.fire('Lỗi', 'Không thể tải danh sách người dùng', 'error')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        Swal.fire('Lỗi', 'Đã xảy ra lỗi khi tải danh sách người dùng', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async userId => {
    const token = localStorage.getItem('token')
    try {
      const resp = await fetch(`http://127.0.0.1:8080/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (resp.ok) {
        Swal.fire('Thành công', 'Xóa người dùng thành công', 'success')
        setUsers(users.filter(user => user.id !== userId))
      } else {
        Swal.fire('Lỗi', 'Không thể xóa người dùng', 'error')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng', 'error')
    }
  }

  if (loading) {
    return <Typography>Đang tải...</Typography>
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Danh sách người dùng'
            action={
              <Link href='/admin/users/add'>
                <Button variant='contained' startIcon={<AddBoxIcon />}>
                  Thêm người dùng
                </Button>
              </Link>
            }
          />
          <CardContent>
            <TableUsers rows={users} onDelete={handleDeleteUser} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Users
