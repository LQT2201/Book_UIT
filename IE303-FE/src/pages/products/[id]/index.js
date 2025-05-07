import { Container, Grid, Box, Button, Typography, Rating, CardMedia } from '@mui/material'
import Icon from '@mdi/react'
import { mdiCartOutline } from '@mdi/js'
import Card from '@mui/material/Card'
import Swal from 'sweetalert2'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useState, useEffect } from 'react'
import Book from 'src/components/Book'
import DefaultLayout from 'src/layouts/DefaultLayout'
import formater from 'src/utils/formatCurrency'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Breadcrumbs from '@mui/material/Breadcrumbs'

const BASE_URL = 'http://127.0.0.1:8080/api'

const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

const ProductDetail = params => {
  const router = useRouter()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [recommendations, setRecommendations] = useState([])

  const updateCart = (token, newCart) => {
    try {
      console.log(newCart, 'cart')
      return fetch(`${BASE_URL}/user/cart`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCart)
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật giỏ hàng thất bại')
          return response.json()
        })
        .catch(error => {
          console.error('Update cart error:', error)
          throw error
        })
    } catch (error) {
      console.error('Cart update error:', error)
      throw error
    }
  }

  const getCart = token => {
    try {
      return fetch(`${BASE_URL}/user/cart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) throw new Error('Lấy giỏ hàng thất bại')
          return response.json()
        })
        .then(data => {
          // Ensure we have an array of items
          if (!Array.isArray(data)) {
            console.warn('Cart data is not an array, using empty array instead', data)
            return []
          }
          return data
        })
        .catch(error => {
          console.error('Get cart error:', error)
          throw error
        })
    } catch (error) {
      console.error('Cart fetch error:', error)
      throw error
    }
  }

  const upsert = cart => {
    try {
      if (!book || !book.id) throw new Error('Thông tin sách không hợp lệ')

      const itemIndex = cart.findIndex(item => item.itemId === book.id)
      if (itemIndex > -1) {
        cart[itemIndex].quantity += 1
      } else {
        cart.push({
          itemId: book.id,
          quantity: 1,
          title: book.title,
          image: book.images && book.images.length > 0 ? book.images[0] : '',
          price: book.price
        })
      }
      return cart
    } catch (error) {
      console.error('Cart update error:', error)
      throw error
    }
  }

  const buyNow = async () => {
    const token = getToken()
    if (!token) {
      router.push('/pages/login')
      return
    }
    try {
      const cart = await getCart(token)
      const updatedCart = upsert([...cart])
      await updateCart(token, updatedCart)
      router.push('/checkout')
    } catch (error) {
      console.error('Buy now error:', error)
      Swal.fire('Lỗi', 'Không thể mua ngay. Vui lòng thử lại sau.', 'error')
    }
  }

  const addToCart = async () => {
    const token = getToken()
    if (!token) {
      router.push('/pages/login')
      return
    }
    try {
      const cart = await getCart(token)
      const updatedCart = upsert([...cart])
      await updateCart(token, updatedCart)
      Swal.fire('Thêm vào giỏ hàng', 'Sản phẩm đã được thêm vào giỏ hàng', 'success')
    } catch (error) {
      console.error('Add to cart error:', error)
      Swal.fire('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.', 'error')
    }
  }
  const [author, setAuthor] = useState(null)

  const fetchBookData = async () => {
    if (!router.query.id) return

    setIsLoading(true)
    setError(false)

    try {
      // Fetch book data
      const bookResponse = await fetch(`${BASE_URL}/book/${router.query.id}`)
      if (!bookResponse.ok) throw new Error('Không tìm thấy sách')

      const bookData = await bookResponse.json()
      if (!bookData || !bookData.id) throw new Error('Dữ liệu sách không hợp lệ')
      setBook(bookData)

      try {
        // Fetch related books
        const relatedBooksResponse = await fetch(`${BASE_URL}/book?genre=${encodeURIComponent(bookData.genre)}`)
        if (!relatedBooksResponse.ok) throw new Error('Lấy sách liên quan thất bại')

        const relatedBooksData = await relatedBooksResponse.json()
        setRelatedBooks(Array.isArray(relatedBooksData) ? relatedBooksData : [])
      } catch (relatedError) {
        console.error('Fetch related books error:', relatedError)
        setRelatedBooks([]) // Set empty array to prevent mapping errors
      }

      // Uncomment if implementing author fetching
      // try {
      //   const authorsResponse = await fetch(`${BASE_URL}/author`)
      //   if (!authorsResponse.ok) throw new Error('Lấy thông tin tác giả thất bại')
      //
      //   const authors = await authorsResponse.json()
      //   if (authors && Array.isArray(authors)) {
      //     const authorData = authors.find(a => a && a.name === bookData.author)
      //     setAuthor(authorData || null)
      //   }
      // } catch (authorError) {
      //   console.error('Fetch author error:', authorError)
      //   setAuthor(null)
      // }

      // Uncomment if implementing recommendations
      // try {
      //   const recommendationsResponse = await fetch(
      //     `${BASE_URL}/recommend?numberOfRecommendations=3`,
      //     {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(bookData),
      //     }
      //   )
      //   if (!recommendationsResponse.ok) throw new Error('Lấy gợi ý sách thất bại')
      //
      //   const recommendationsData = await recommendationsResponse.json()
      //   setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : [])
      // } catch (recommendError) {
      //   console.error('Fetch recommendations error:', recommendError)
      //   setRecommendations([])
      // }

      setIsLoading(false)
    } catch (error) {
      console.error('Fetch book data error:', error)
      setError(true)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookData()
  }, [router.query.id])

  if (error) {
    return <p>Không tìm thấy sản phẩm</p>
  }

  if (isLoading) {
    return <p>Đang tải</p>
  }

  return (
    <Container maxWidth='lg'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ marginY: '10px' }}>
        <Link underline='hover' color='inherit' href='/'>
          Trang chủ
        </Link>
        <Link underline='hover' color='inherit' href='/search'>
          Sản phẩm
        </Link>
        <Typography color='text.primary'>{book.title}</Typography>
      </Breadcrumbs>
      <Grid container sx={{ backgroundColor: '#ffffff' }}>
        <Grid item md={5} padding={5}>
          <Box>
            <Box sx={{ width: '400px', height: '400px' }} marginBottom={5}>
              <img width={400} height={400} src={book.images[0]} />
            </Box>
            <Box>
              <Carousel responsive={responsive}>
                {book.images.map(img => (
                  <img key={img} height='150' src={img} />
                ))}
              </Carousel>
            </Box>
          </Box>
        </Grid>
        <Grid item md={7}>
          <Box>
            <Typography lineHeight={2.5} color='#C92127' fontSize={27} fontWeight={700}>
              {book.title}
            </Typography>
          </Box>
          <Box>
            <Grid item md={6}>
              <Link href={`/author/${author ? author.id : ''}`}>
                <p>Tác giả {`${book.author}`}</p>
              </Link>
            </Grid>
            <Grid item md={6}>
              <p>Nhà xuất bản: {book.publisher}</p>
            </Grid>
          </Box>
          <Box>Thông tin: {book.description}</Box>
          <Box display='flex'>
            <Typography color='#C92127' fontWeight={600} fontSize={24}>
              {formater.format(book.price)}
            </Typography>
            <Typography
              sx={{ textDecoration: 'line-through' }}
              component='span'
              color='#888888'
              fontSize={20}
              fontWeight={400}
              marginLeft={10}
              alignItems={'center'}
              textAlign={'center'}
              display={'flex'}
            ></Typography>
            <Box sx={{ display: 'flex' }} fontWeight={600} marginLeft={3}>
              Số lượng: {book.stock}
            </Box>
          </Box>
          <Box display={'flex'} sx={{ marginTop: 5, marginBottom: 5 }}>
            <Grid item md={6}>
              <Button
                sx={{
                  color: '#C92127',
                  background: '#fff',
                  border: '2px solid #C92127',
                  width: 220,
                  height: 44
                }}
                onClick={addToCart}
              >
                <Icon path={mdiCartOutline} size={1} />
                Thêm vào giỏ hàng
              </Button>
            </Grid>
            <Grid item md={6}>
              <Button
                sx={{
                  color: '#fff',
                  background: '#C92127',
                  width: 220,
                  height: 44,
                  transition: 'background-color 0.3s ease',
                  ':hover': {
                    cursor: 'pointer',
                    background: '#f55207'
                  }
                }}
                onClick={buyNow}
              >
                Mua ngay
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{ backgroundColor: '#ffffff', marginTop: 10 }}>
        <Typography fontSize={20} fontWeight={600} padding={5}>
          Sản phẩm liên quan
        </Typography>
        <Grid container marginTop={5}>
          {relatedBooks.map(relatedBook => (
            <Grid item md={2.4} key={relatedBook.id}>
              <Book book={relatedBook} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid container sx={{ backgroundColor: '#ffffff', marginTop: 10 }}>
        <Typography fontSize={20} fontWeight={600} padding={5}>
          Gợi ý sản phẩm
        </Typography>
        <Grid container marginTop={5}>
          {recommendations.map(recommendedBook => (
            <Grid item md={2.4} key={recommendedBook.id}>
              <Book book={recommendedBook} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

ProductDetail.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default ProductDetail
