import { Box } from '@mui/material'
import {useState, useEffect} from 'react'
import DefaultLayout from 'src/layouts/DefaultLayout'
import Banner from 'src/layouts/components/Banner'
import Category from 'src/components/Category'
import LatestBook from 'src/components/LatestBook'
import router from 'next/router'
import { useRouter } from 'next/router';


const BASE_URL = 'http://127.0.0.1:8080/api'
const HomePage = () => {
  const [genres, setGenres] = useState(null)
  const [books, setBooks] = useState(null)


  const router = useRouter();
  const href = router.asPath; // Lấy URL đầy đủ hiện tại



  const fetchVnpay = async () => {
    const fetchVn = await fetch(`http://localhost:8080/api/payment/vn-pay-callback/${href}`)
  }


  useEffect(() => {
    const fetchData = async() => {
      const fetchGenres = fetch(`${BASE_URL}/genre`).then(resp => resp.json())
      const fetchBooks = fetch(`${BASE_URL}/book`).then(resp => resp.json())
      const [fetchedGenre, fetchedBook] = await Promise.all([fetchGenres, fetchBooks])
      setGenres(fetchedGenre)
      setBooks(fetchedBook)
    }
    fetchData().catch((error) => {console.log(error)})
    fetchVnpay
  }, [])


  console.log(books)
  return (
    <Box>
      <Banner/>
      {genres
        ? (<Category genres={genres}/>)
        : (<>Đang tải</>)
      }
      {books
      ? (<LatestBook books={books}/>)
      :(<>Đang tải</>)
      }
    </Box>
  )
}

HomePage.getLayout  = page => <DefaultLayout>{page}</DefaultLayout>

export default HomePage