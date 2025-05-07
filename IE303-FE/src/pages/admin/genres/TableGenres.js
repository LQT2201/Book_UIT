// ** MUI Imports
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Typography
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import Link from 'next/link'
import Swal from 'sweetalert2'

const TableGenres = ({ rows, onDelete }) => {
  const handleDelete = id => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa thể loại này?',
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
            <TableCell>Mã thể loại</TableCell>
            <TableCell>Tên thể loại</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Hình ảnh</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <Chip label={row.name} color='primary' variant='outlined' />
              </TableCell>
              <TableCell>
                <div
                  style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {row.description || 'Không có mô tả'}
                </div>
              </TableCell>
              <TableCell>
                {row.images ? (
                  <img src={row.images} alt={row.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : (
                  <Chip label='Không có ảnh' size='small' />
                )}
              </TableCell>
              <TableCell>
                <Tooltip title='Sửa'>
                  <Link href={`/admin/genres/update/${row.id}`} passHref>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableGenres
