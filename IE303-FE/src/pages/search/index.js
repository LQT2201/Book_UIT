import { Container, Grid, Box, Typography, Divider, Chip, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DefaultLayout from 'src/layouts/DefaultLayout'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Book from 'src/components/Book'
import { useRouter } from 'next/router'
import CloseIcon from '@mui/icons-material/Close'

const BASE_URL = 'http://127.0.0.1:8080/api'
const SORT = {
  PRICE_ASC: '{"sort": "ASC", "by": "price"}',
  PRICE_DESC: '{"sort": "DESC", "by": "price"}',
  DATE_ASC: '{"sort": "ASC", "by": "publishDate"}',
  DATE_DESC: '{"sort": "DESC", "by": "publishDate"}',
  TITLE_ASC: '{"sort": "ASC", "by": "title"}',
  TITLE_DESC: '{"sort": "DESC", "by": "title"}'
}

const SearchPage = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${BASE_URL}/genre`)
        if (!response.ok) {
          throw new Error('Failed to fetch genres')
        }
        const data = await response.json()
        setGenres(data)
      } catch (error) {
        console.error('Error fetching genres:', error)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    if (!router.isReady) return

    const { keyword, genre, sort, by } = router.query
    let query = '?'

    if (keyword) query = `${query}&keyword=${encodeURIComponent(keyword)}`
    if (genre) {
      if (typeof genre === 'string') {
        query = `${query}&genre=${encodeURIComponent(genre)}`
        setSelectedGenres([genre])
      } else {
        query = `${query}&genre=${genre.map(g => encodeURIComponent(g)).join('&genre=')}`
        setSelectedGenres(genre)
      }
    }
    if (sort) query = `${query}&sort=${encodeURIComponent(sort)}`
    if (by) query = `${query}&by=${encodeURIComponent(by)}`

    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${BASE_URL}/book/search${query}`)
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('Error fetching books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [router.isReady, router.query])

  const handleGenreChange = (genreName, checked) => {
    setSelectedGenres(prev => {
      const newGenres = checked ? [...prev, genreName] : prev.filter(val => val !== genreName)

      router.replace({
        query: {
          ...router.query,
          genre: newGenres.length > 0 ? newGenres : undefined
        }
      })

      return newGenres
    })
  }

  const removeGenre = genreToRemove => {
    setSelectedGenres(prev => {
      const newGenres = prev.filter(genre => genre !== genreToRemove)
      router.replace({
        query: {
          ...router.query,
          genre: newGenres.length > 0 ? newGenres : undefined
        }
      })
      return newGenres
    })
  }

  const handleSortChange = event => {
    const { sort, by } = JSON.parse(event.target.value)
    setValue(event.target.value)
    router.replace({
      query: {
        ...router.query,
        sort,
        by
      }
    })
  }

  return (
    <Box bgcolor='#F0F0F0'>
      <Container maxWidth='lg' sx={{ bgcolor: 'transparent' }}>
        <Grid container spacing={2}>
          <Grid item md={3}>
            <Paper elevation={0} sx={{ bgcolor: 'white', mb: 2 }}>
              <Box padding={3}>
                <Typography fontSize={23} fontWeight={700} color='#C92127'>
                  Lọc theo
                </Typography>
                <Divider />
              </Box>
              <Box padding={3}>
                <Typography fontSize={16} fontWeight={700} mb={2}>
                  Danh mục
                </Typography>
                <FormGroup>
                  {genres.map(genre => (
                    <FormControlLabel
                      key={genre.id}
                      control={
                        <Checkbox
                          checked={selectedGenres.includes(genre.name)}
                          onChange={e => handleGenreChange(genre.name, e.target.checked)}
                          sx={{
                            color: '#C92127',
                            '&.Mui-checked': {
                              color: '#C92127'
                            }
                          }}
                        />
                      }
                      label={genre.name}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '14px',
                          color: '#333'
                        }
                      }}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={9}>
            <Paper elevation={0} sx={{ bgcolor: 'white', p: 3 }}>
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
                <Box>
                  <Typography variant='h6' color='textPrimary' gutterBottom>
                    {loading ? 'Đang tìm kiếm...' : `Kết quả tìm kiếm (${books.length} sách)`}
                  </Typography>
                  {selectedGenres.length > 0 && (
                    <Box display='flex' gap={1} flexWrap='wrap' mt={1}>
                      {selectedGenres.map(genre => (
                        <Chip
                          key={genre}
                          label={genre}
                          onDelete={() => removeGenre(genre)}
                          deleteIcon={<CloseIcon />}
                          sx={{
                            bgcolor: '#FFF0F0',
                            color: '#C92127',
                            '& .MuiChip-deleteIcon': {
                              color: '#C92127',
                              '&:hover': {
                                color: '#A61B1B'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                <FormControl sx={{ minWidth: 200 }} size='small'>
                  <InputLabel id='select-small-label'>Sắp xếp theo</InputLabel>
                  <Select
                    labelId='select-small-label'
                    id='select-small'
                    value={value}
                    label='Sắp xếp theo'
                    onChange={handleSortChange}
                  >
                    <MenuItem value={SORT.PRICE_ASC}>Giá tăng dần</MenuItem>
                    <MenuItem value={SORT.PRICE_DESC}>Giá giảm dần</MenuItem>
                    <MenuItem value={SORT.DATE_DESC}>Mới nhất</MenuItem>
                    <MenuItem value={SORT.DATE_ASC}>Cũ nhất</MenuItem>
                    <MenuItem value={SORT.TITLE_ASC}>Tên A-Z</MenuItem>
                    <MenuItem value={SORT.TITLE_DESC}>Tên Z-A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Grid container spacing={3}>
                {books.length > 0 ? (
                  books.map(book => (
                    <Grid item md={3} key={book._id}>
                      <Book book={book} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
                      <Typography color='textSecondary'>
                        {loading ? 'Đang tìm kiếm...' : 'Không tìm thấy sách phù hợp'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

SearchPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default SearchPage
