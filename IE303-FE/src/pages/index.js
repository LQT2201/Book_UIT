import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import DefaultLayout from 'src/layouts/DefaultLayout'
import Banner from 'src/layouts/components/Banner'
import Category from 'src/components/Category'
import LatestBook from 'src/components/LatestBook'
import { useRouter } from 'next/router'

const BASE_URL = 'http://127.0.0.1:8080/api'

const HomePage = () => {
  const [genres, setGenres] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genresResponse = await fetch(`${BASE_URL}/genre`)
        const genresData = await genresResponse.json()

        // Fetch books
        const booksResponse = await fetch(`${BASE_URL}/book`)
        const booksData = await booksResponse.json()

        // Log responses for debugging
        console.log('Genres response:', genresData)
        console.log('Books response:', booksData)

        // Set data with proper error handling
        if (genresData && Array.isArray(genresData)) {
          setGenres(genresData)
        } else if (genresData && genresData.data && Array.isArray(genresData.data)) {
          setGenres(genresData.data)
        } else {
          console.error('Invalid genres data format:', genresData)
          setGenres([])
        }

        if (booksData && Array.isArray(booksData)) {
          setBooks(booksData)
        } else if (booksData && booksData.data && Array.isArray(booksData.data)) {
          setBooks(booksData.data)
        } else {
          console.error('Invalid books data format:', booksData)
          setBooks([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setGenres([])
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Box>
      <Banner />
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>Đang tải...</Box>
      ) : (
        <>
          {genres.length > 0 && <Category genres={genres} />}
          {books.length > 0 && <LatestBook books={books} />}
          {!loading && genres.length === 0 && books.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy dữ liệu</Box>
          )}
        </>
      )}
    </Box>
  )
}

HomePage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default HomePage
