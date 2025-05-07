import { Card, CardContent, CardHeader, Grid, Typography, Button, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import TableGenres from './TableGenres'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CategoryIcon from '@mui/icons-material/Category'
import Swal from 'sweetalert2'
import withAdminAuth from 'src/middleware/adminAuth'
import { useRouter } from 'next/router'

const BASE_URL = 'http://127.0.0.1:8080/api'

const Genres = () => {
  const router = useRouter()
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${BASE_URL}/genre`)
      const result = await response.json()

      if (result.success) {
        setGenres(result.data)
      } else {
        Swal.fire('Lỗi', result.message || 'Không thể tải danh sách thể loại', 'error')
      }
    } catch (error) {
      console.error('Error fetching genres:', error)
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const handleDelete = async id => {
    Swal.fire('Lỗi', 'Không thể xóa thể loại do có sách thuộc thể loại này', 'error')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Quản lý thể loại'
            action={
              <Button variant='contained' startIcon={<AddBoxIcon />} onClick={() => router.push('/admin/genres/add')}>
                Thêm thể loại
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: 'primary.light',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CategoryIcon sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant='h6'>{genres.length}</Typography>
                      <Typography variant='body2'>Tổng số thể loại</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {genres.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography>Không có thể loại nào</Typography>
              </Box>
            ) : (
              <TableGenres rows={genres} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAdminAuth(Genres)
