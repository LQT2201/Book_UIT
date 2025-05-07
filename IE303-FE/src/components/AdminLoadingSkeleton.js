import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

const AdminLoadingSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100vh'
      }}
    >
      <CircularProgress size={50} />
      <Typography variant='h6' sx={{ mt: 3 }}>
        Đang tải trang admin...
      </Typography>
    </Box>
  )
}

export default AdminLoadingSkeleton
