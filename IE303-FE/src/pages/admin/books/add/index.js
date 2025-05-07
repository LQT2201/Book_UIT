import { forwardRef, useState, useEffect } from 'react'
import {
  Grid,
  Select,
  Button,
  MenuItem,
  TextField,
  FormLabel,
  FormControl,
  CardContent,
  Typography,
  Box
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

CustomInput.displayName = 'CustomInput'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0)
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0)
}))

const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  fontSize: '16px'
}))

const BASE_URL = 'http://127.0.0.1:8080/api'

const AddBook = () => {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [files, setFiles] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          Swal.fire('Lỗi', 'Vui lòng đăng nhập lại', 'error')
          router.push('/login')
          return
        }

        const response = await fetch(`${BASE_URL}/genre`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Genres data:', result) // Debug log

        if (result.success) {
          setGenres(result.data)
        } else {
          console.error('Invalid genres data format:', result)
          Swal.fire('Lỗi', result.message || 'Định dạng dữ liệu thể loại không hợp lệ', 'error')
        }
      } catch (error) {
        console.error('Error fetching genres:', error)
        Swal.fire('Lỗi', 'Không thể tải danh sách thể loại', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [router])

  const fileOnChange = event => {
    const { files } = event.target
    if (files && files.length > 0) {
      const imgs = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(imgs)
      setFiles(Array.from(files))
    }
  }

  const postData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      Swal.fire('Lỗi', 'Vui lòng đăng nhập lại', 'error')
      router.push('/login')
      return
    }

    const formData = new FormData(document.getElementById('book-form'))

    // Log form data để debug
    console.log('Form data before submit:')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    try {
      const response = await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        Swal.fire('Thành công', result.message || 'Thêm sách thành công', 'success')
        router.push('/admin/books')
      } else {
        Swal.fire('Lỗi', result.message || 'Thêm sách thất bại', 'error')
      }
    } catch (error) {
      console.error('Error adding book:', error)
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error')
    }
  }

  if (loading) {
    return <Typography>Đang tải...</Typography>
  }

  return (
    <CardContent>
      <form id='book-form' encType='multipart/form-data'>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <FormLabel>Tên sách</FormLabel>
            <StyledTextField name='title' required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Tác giả</FormLabel>
            <StyledTextField name='author' required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Thể loại</FormLabel>
            <FormControl fullWidth>
              <StyledSelect id='genre' name='genre' defaultValue='' required>
                <MenuItem value='' disabled>
                  Chọn thể loại
                </MenuItem>
                {genres && genres.length > 0 ? (
                  genres.map(genre => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có thể loại</MenuItem>
                )}
              </StyledSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Mô tả sách</FormLabel>
            <StyledTextField name='description' required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Số lượng trong kho</FormLabel>
            <StyledTextField type='number' name='stock' required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Giá Sale</FormLabel>
            <StyledTextField type='number' name='salePrice' required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Giá sách</FormLabel>
            <StyledTextField type='number' name='price' required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Nhà xuất bản</FormLabel>
            <StyledTextField name='publisher' required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Số trang</FormLabel>
            <StyledTextField type='number' name='pages' required inputProps={{ min: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>soldQty</FormLabel>
            <StyledTextField type='number' name='soldQty' required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <FormLabel>Ngày xuất bản</FormLabel>
            <StyledInput type='date' name='publishDate' defaultValue={new Date().toISOString().slice(0, 10)} required />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            {images.map((img, index) => (
              <ImgStyled key={index} src={img} alt={`Preview ${index + 1}`} />
            ))}
            <Box>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Thêm ảnh
                <input
                  hidden
                  type='file'
                  onChange={fileOnChange}
                  accept='image/png, image/jpeg'
                  id='account-settings-upload-image'
                  name='images'
                  multiple
                />
              </ButtonStyled>
              <Typography variant='body2' sx={{ marginTop: 5 }}>
                Chỉ cho phép PNG hoặc JPEG. Kích thước tối đa 800K.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={postData}>
              Thêm sách
            </Button>
            <Button
              type='reset'
              variant='outlined'
              color='secondary'
              onClick={e => {
                document.getElementById('book-form').reset()
                setImages([])
                setFiles([])
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default AddBook
