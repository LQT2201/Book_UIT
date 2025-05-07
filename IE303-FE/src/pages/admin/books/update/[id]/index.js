import { forwardRef, useState, useEffect } from 'react'
import {
  Grid,
  Button,
  MenuItem,
  TextField,
  CardContent,
  FormControl,
  Select,
  Typography,
  Box,
  FormLabel
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

const UpdateBook = () => {
  const router = useRouter()
  const [book, setBook] = useState(null)
  const [images, setImages] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          Swal.fire('Lỗi', 'Vui lòng đăng nhập lại', 'error')
          router.push('/login')
          return
        }

        const [bookResponse, genresResponse] = await Promise.all([
          fetch(`${BASE_URL}/book/${router.query.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${BASE_URL}/genre`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ])

        if (!bookResponse.ok || !genresResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const [bookData, genresResult] = await Promise.all([bookResponse.json(), genresResponse.json()])

        console.log('Book data:', bookData)
        console.log('Genres data:', genresResult)

        if (genresResult.success) {
          setGenres(genresResult.data)
        } else {
          console.error('Invalid genres data format:', genresResult)
          Swal.fire('Lỗi', genresResult.message || 'Định dạng dữ liệu thể loại không hợp lệ', 'error')
        }

        setBook(bookData)
        setImages(bookData.images || [])
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        Swal.fire('Lỗi', 'Không thể tải thông tin sách', 'error')
        setLoading(false)
      }
    }
    if (router.query.id) fetchData()
  }, [router.query.id])

  const fileOnChange = async file => {
    const { files } = file.target
    if (files && files.length !== 0) {
      const readFile = file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      }
      const imgs = await Promise.all(Array.from(files).map(file => readFile(file)))
      setImages(imgs)
    }
  }

  const postData = async () => {
    const token = localStorage.getItem('token')
    const formData = new FormData(document.getElementById('book-form'))

    // Add images to formData
    images.forEach((img, index) => {
      if (img.startsWith('data:')) {
        // Convert base64 to blob
        const byteString = atob(img.split(',')[1])
        const mimeString = img.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: mimeString })
        formData.append('images', blob)
      }
    })

    try {
      const response = await fetch(`${BASE_URL}/book/${book.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        Swal.fire({
          title: 'Thành công',
          text: result.message || 'Cập nhật sách thành công',
          icon: 'success'
        }).then(() => {
          router.push('/admin/books')
        })
      } else {
        Swal.fire({
          title: 'Lỗi',
          text: result.message || 'Cập nhật thất bại',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating book:', error)
      Swal.fire({
        title: 'Lỗi',
        text: 'Đã xảy ra lỗi khi cập nhật sách',
        icon: 'error'
      })
    }
  }

  if (loading) {
    return <Typography>Đang tải...</Typography>
  }

  if (!book) {
    return <Typography>Không tìm thấy thông tin sách</Typography>
  }

  return (
    <CardContent>
      <form id='book-form' encType='multipart/form-data'>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <FormLabel>Tên sách</FormLabel>
            <StyledTextField name='title' defaultValue={book.title} required />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <FormControl fullWidth>
              <FormLabel>Tác giả</FormLabel>
              <StyledTextField name='author' defaultValue={book.author} required />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <FormLabel>Thể loại</FormLabel>
              <StyledSelect name='genre' defaultValue={book.genre?.id || ''} required>
                {genres.map(genre => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Mô tả sách</FormLabel>
            <StyledTextField name='description' defaultValue={book.description} multiline rows={4} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Số lượng kho</FormLabel>
            <StyledTextField type='number' name='stock' defaultValue={book.stock} required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Giá sách</FormLabel>
            <StyledTextField type='number' name='price' defaultValue={book.price} required inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormLabel>Giá sách sale</FormLabel>
            <StyledTextField
              type='number'
              name='salePrice'
              defaultValue={book.salePrice}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <StyledTextField
              name='publisher'
              label='Nhà xuất bản'
              placeholder='Nhà xuất bản'
              defaultValue={book.publisher}
              required
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <FormLabel>Số trang</FormLabel>
            <StyledTextField type='number' name='pages' defaultValue={book.pages} required inputProps={{ min: 1 }} />
          </Grid> */}
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
            <Typography variant='h6'>Hình ảnh hiện tại:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
              {images.map((img, index) => (
                <ImgStyled key={index} src={img} alt={`Book image ${index + 1}`} />
              ))}
            </Box>
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
              Cập nhật
            </Button>
            <Button
              type='reset'
              variant='outlined'
              color='secondary'
              onClick={() => {
                document.getElementById('book-form').reset()
                setImages(book.images || [])
              }}
            >
              Đặt lại
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default UpdateBook
