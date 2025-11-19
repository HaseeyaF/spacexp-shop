import React, { useState } from "react";
import { Box, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button,
  Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Chip, IconButton, Collapse,
} from "@mui/material";
import { Refresh, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openRow, setOpenRow] = useState(null);

  const orders = [
    {
      _id: "ORD001",
      userId: "USER1001",
      paymentStatus: "paid",
      orderStatus: "delivered",
      total: 159.99,
      createdAt: "2025-01-14 10:33AM",
      items: [
        { productId: "P01", variantColor: "Black", size: "M", qty: 1, price: 89.99 },
        { productId: "P09", variantColor: "Red", size: "L", qty: 2, price: 35.00 },
      ],
    },
    {
      _id: "ORD002",
      userId: "USER555",
      paymentStatus: "pending",
      orderStatus: "processing",
      total: 79.50,
      createdAt: "2025-01-15 04:21PM",
      items: [
        { productId: "P20", variantColor: "Blue", size: "S", qty: 1, price: 79.50 },
      ],
    },
    {
      _id: "ORD003",
      userId: "USER983",
      paymentStatus: "failed",
      orderStatus: "cancelled",
      total: 42.00,
      createdAt: "2025-01-16 08:12AM",
      items: [
        { productId: "P05", variantColor: "White", size: "M", qty: 1, price: 42.00 },
      ],
    },
  ];

  const PAYMENT_COLORS = {
    paid: "success",
    pending: "warning",
    failed: "error",
  };

  const ORDER_COLORS = {
    created: "info",
    processing: "warning",
    delivered: "success",
    cancelled: "error",
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight={600}>
        Order Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search Order / User ID"
            size="small"
            sx={{ minWidth: 220 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={paymentFilter}
              label="Payment Status"
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={statusFilter}
              label="Order Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="created">Created</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" startIcon={<Refresh />} sx={{ ml: "auto" }}>
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order, index) => (
              <React.Fragment key={order._id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      onClick={() => setOpenRow(openRow === index ? null : index)}
                    >
                      {openRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>

                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.userId}</TableCell>

                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      color={PAYMENT_COLORS[order.paymentStatus]}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={ORDER_COLORS[order.orderStatus]}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>${order.total}</TableCell>
                  <TableCell>{order.createdAt}</TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={order.orderStatus}
                      sx={{ width: 130 }}
                    >
                      <MenuItem value="created">Created</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>

                {/* EXPANDED ITEMS */}
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0 }}>
                    <Collapse in={openRow === index}>
                      <Box p={2} bgcolor="#fafafa">
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Order Items
                        </Typography>

                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product ID</TableCell>
                              <TableCell>Color</TableCell>
                              <TableCell>Size</TableCell>
                              <TableCell>Qty</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {order.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.productId}</TableCell>
                                <TableCell>{item.variantColor}</TableCell>
                                <TableCell>{item.size}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>${item.price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
