import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import Link from 'next/link'
import Swal from 'sweetalert2'

const TableBooks = ({ rows, onDelete }) => {
  const handleDelete = id => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa sách này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(result => {
      if (result.isConfirmed) {
        onDelete(id)
      }
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên sách</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Thể loại</TableCell>
            <TableCell>Tác giả</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Tồn kho</TableCell>
            <TableCell>Đã bán</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(row.price)}
              </TableCell>
              <TableCell>
                <Chip label={row.genre?.name || 'Không có thể loại'} color='primary' variant='outlined' size='small' />
              </TableCell>
              <TableCell>{row.author}</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {row.description}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={row.stock} color={row.stock > 0 ? 'success' : 'error'} size='small' />
              </TableCell>
              <TableCell>
                <Chip label={row.soldQty || 0} color='info' size='small' />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title='Sửa'>
                    <Link href={`/admin/books/update/${row.id}`} passHref>
                      <IconButton color='primary' component='span'>
                        <Edit />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  <Tooltip title='Xóa'>
                    <IconButton onClick={() => handleDelete(row.id)} color='error'>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableBooks
