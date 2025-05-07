// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BuildIcon from '@mui/icons-material/Build'
import { Chip, IconButton, Tooltip, Box } from '@mui/material'
import formater from 'src/utils/formatCurrency'
import { Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Function to format date
const formatDate = dateString => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return dateString
  }
}

// Function to clean order status (remove quotes if present)
const cleanOrderStatus = status => {
  if (!status) return 'Chưa cập nhật'

  // Remove quotes if present
  if (status.startsWith('"') && status.endsWith('"')) {
    return status.slice(1, -1)
  }
  return status
}

// Function to format shipping address
const formatShippingAddress = address => {
  if (!address) return 'Không có địa chỉ'

  // Check if address is a JSON string
  if (address.startsWith('{') && address.endsWith('}')) {
    try {
      const parsedAddress = JSON.parse(address)
      // Check for different possible structures
      if (parsedAddress.shippingAddress) {
        return parsedAddress.shippingAddress
      } else if (parsedAddress.address) {
        return parsedAddress.address
      }
      return address // Return original if no known properties are found
    } catch (error) {
      return address // Return original if parsing fails
    }
  }

  return address
}

// Function to get status color
const getStatusColor = status => {
  const cleanedStatus = cleanOrderStatus(status).toLowerCase()

  if (cleanedStatus.includes('đã hủy')) return 'error'
  if (cleanedStatus.includes('đã giao') || cleanedStatus.includes('thanh toán')) return 'success'
  if (cleanedStatus.includes('đang giao')) return 'info'
  if (cleanedStatus.includes('đang xử lý')) return 'warning'

  return 'default'
}

const TableOrders = ({ rows, onDelete, onView }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell align='center'>Khách hàng</TableCell>
            <TableCell align='center'>Trạng thái</TableCell>
            <TableCell align='center'>Tổng tiền</TableCell>
            <TableCell align='center'>Địa chỉ</TableCell>
            <TableCell align='center'>Ngày đặt</TableCell>
            <TableCell align='center'>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                <Tooltip title={row.id}>
                  <span>{row.id.substring(0, 10)}...</span>
                </Tooltip>
              </TableCell>
              <TableCell align='center'>{row.username || 'Không xác định'}</TableCell>
              <TableCell align='center'>
                <Chip
                  label={cleanOrderStatus(row.orderStatus)}
                  color={getStatusColor(row.orderStatus)}
                  variant='outlined'
                />
              </TableCell>
              <TableCell align='center'>{formater.format(row.totalPrice || 0)}</TableCell>
              <TableCell align='center'>
                <Tooltip title={formatShippingAddress(row.shippingAddress)}>
                  <span>
                    {formatShippingAddress(row.shippingAddress).substring(0, 20)}
                    {formatShippingAddress(row.shippingAddress).length > 20 ? '...' : ''}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell align='center'>{formatDate(row.orderAt)}</TableCell>
              <TableCell align='center'>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton color='primary' onClick={() => onView(row.id)} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color='error' onClick={() => onDelete(row.id)} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableOrders
