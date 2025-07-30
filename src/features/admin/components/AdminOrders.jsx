import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersAsync,
  updateOrderByIdAsync,
  resetOrderUpdateStatus,
  selectOrders,
  selectCount,
  selectOrderUpdateStatus,
} from "../../order/OrderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Collapse,
  TablePagination,
  Box,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  console.log(orders)
  const count = useSelector(selectCount);
  console.log(count)
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const [searchId, setSearchId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [copiedId, setCopiedId] = useState(null);
  
  const [selectedColumns, setSelectedColumns] = useState([
    "Id",
    "Item",
    "Total Amount",
    "Status",
    "Actions",
  ]);
  const [editOrderId, setEditOrderId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    dispatch(getAllOrdersAsync({page, rowsPerPage, searchId,filterStatus,sortOrder}));
  }, [dispatch,page,rowsPerPage,searchId,filterStatus,sortOrder]);
// alert(searchId)
  useEffect(() => {
    if (orderUpdateStatus === "fulfilled") toast.success("Status updated");
    else if (orderUpdateStatus === "rejected")
      toast.error("Error updating order status");
    dispatch(resetOrderUpdateStatus());
  }, [orderUpdateStatus, dispatch]);

  const handleUpdateOrder = (data) => {
    dispatch(updateOrderByIdAsync({ ...data, _id: editOrderId }));
    setEditOrderId(null);
  };

  const handleColumnChange = (event) => {
    setSelectedColumns(event.target.value);
  };

  // const filteredOrders = orders
  //   .filter(
  //     (order) =>
  //       (!searchId || order._id.includes(searchId)) &&
  //       (!filterStatus || order.status === filterStatus)
  //   )
  //   .sort((a, b) =>
  //     sortOrder === "asc"
  //       ? new Date(a.createdAt) - new Date(b.createdAt)
  //       : new Date(b.createdAt) - new Date(a.createdAt)
  //   )
  //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3} p={3} bgcolor="background.default" borderRadius="16px">
      {/* 🔹 Search & Filters */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="Search Order ID"
          variant="outlined"
          fullWidth
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
        />
        <FormControl fullWidth>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
          >
            <MenuItem value="">All</MenuItem>
            {[
              "Pending",
              "Dispatched",
              "Out for delivery",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Sort by Date</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
          >
            <MenuItem value="asc">Oldest First</MenuItem>
            <MenuItem value="desc">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* 🔹 Column Selection */}
      <FormControl fullWidth>
        <InputLabel>Select Columns</InputLabel>
        <Select
          multiple
          value={selectedColumns}
          onChange={handleColumnChange}
          renderValue={(selected) => selected.join(", ")}
          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
        >
          {["Id", "Items", "Total Amount", "Status", "Actions"].map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 🔹 Orders Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.200" }}>
              {selectedColumns.map((col) => (
                <TableCell
                key={col}
                sx={{
                  fontWeight: "bold",
                  textAlign: col === 'Total Amount' ? 'right' : 'center',
                  padding: '10px 12px', // subtle padding
                  color: '#333', // dark text for good contrast
                  borderBottom: '2px solid #e0e0e0', // thin border for separation
                  backgroundColor: col === 'Total Amount' ? '#f9f9f9' :'#f9f9f9' , // highlight background for 'Total Amount'
                  transition: 'background-color 0.2s ease', // smooth background transition on hover
                  '&:hover': {
                    backgroundColor: '#f1f1f1', // light background change on hover
                  }
                }}
              >
                {col}
              </TableCell>
              
              ))}
              <TableCell />
            </TableRow> 
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <React.Fragment key={order._id}>
                <TableRow
                  sx={{
                    "&:hover": {
                      bgcolor: "grey.100",
                      transition: "0.3s",
                    },
                  }}
                >
                  {/* 🔹 ID Cell with Tooltip */}
                  {selectedColumns.includes("Id") && (
                    <Tooltip title="Copy Order ID">
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: copiedId === order._id ? "green" : "inherit",
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(order._id);
                          setCopiedId(order._id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                      >
                        {order._id}
                      </TableCell>
                    </Tooltip>
                  )}

                  {/* 🔹 Item Cell */}
                  {selectedColumns.includes("Item") && (
  <TableCell>
    <Box
      sx={{
        maxHeight: 200,        // Adjust the height to your preference
        overflowY: 'auto',     // Enable vertical scrolling
        padding: 1,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      {order.item.map((product) => (
        <Stack
          key={product.product._id}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            padding: 1,
            marginBottom: 1,      // Space between each item
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Avatar
            src={product.product.thumbnail}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {product.product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {product.quantity}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  </TableCell>
)}


                  {/* 🔹 Total Amount */}
                  {selectedColumns.includes("Total Amount") && (
  <TableCell
    sx={{
      color: order.paymentStatus === "Success" ? "green" : "red",
      fontWeight: "bold",
      textAlign: "right", // To make it right aligned
    }}
  >
    ₹{parseFloat(order.total).toFixed(2)}
  </TableCell>
)}


                  {/* 🔹 Status */}
                  {selectedColumns.includes("Status") && (
                    <TableCell>
                      <Chip
                        label={order.status}
                        sx={{
                          bgcolor:
                            order.status === "Delivered"
                              ? "success.light"
                              : "warning.light",
                        }}
                      />
                    </TableCell>
                  )}

                  {/* 🔹 Actions */}
                  {selectedColumns.includes("Actions") && (
                    <TableCell>
                      {editOrderId === order._id ? (
                        <form onSubmit={handleSubmit(handleUpdateOrder)}>
                          <Select
                            {...register("status")}
                            defaultValue={order.status}
                            sx={{ fontSize: "small" }}
                          >
                            {[
                              "Pending",
                              "Dispatched",
                              "Out for delivery",
                              "Delivered",
                              "Cancelled",
                            ].map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                          <IconButton type="submit">
                            <CheckCircleOutlinedIcon color="success" />
                          </IconButton>
                        </form>
                      ) : (
                        <Tooltip title="Edit Status">
                          <IconButton
                            onClick={() => {
                              setEditOrderId(order._id);
                              setValue("status", order.status);
                            }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}

                  {/* 🔹 Expandable Row */}
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order._id ? null : order._id
                        )
                      }
                    >
                      {expandedOrder === order._id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* 🔹 Expanded Row */}
                {expandedOrder === order._id && (
                  <TableRow>
                    <TableCell colSpan={selectedColumns.length + 1}>
                      <Collapse in={true}>
                        <Stack
                          p={2}
                          spacing={2}
                          sx={{
                            borderRadius: 2,
                            bgcolor: "grey.50",
                            boxShadow: 1,
                          }}
                        >
                          <Typography>
                            <b>Shipping Address:</b> {order.address[0].street},{" "}
                            {order.address[0].city}, {order.address[0].state}
                          </Typography>
                          <Typography>
                            <b>Phone:</b> {order.address[0].phoneNumber}
                          </Typography>
                          <Typography>
  <b>Order Date:</b> {new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}
</Typography>

                          <Typography>
                            <b>Payment Status:</b>{" "}
                            {order.paymentStatus || "N/A"}
                          </Typography>
                          <Typography>
            <b>Payment Id:</b>{" "}
            <Tooltip title="Click to Copy Payment ID">
              <Box
                component="span"
                sx={{
                  cursor: "pointer",
                  color: copiedId === order.paymentDetails[0]?.razorpay_payment_id ? "green" : "inherit",
                  
                }}
                onClick={() => {
                  if (order.paymentDetails[0]?.razorpay_payment_id) {
                    navigator.clipboard.writeText(
                      order.paymentDetails[0]?.razorpay_payment_id
                    );
                    setCopiedId(order.paymentDetails[0]?.razorpay_payment_id);
                    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
                    toast.success("Payment ID copied to clipboard!");
                  } else {
                    toast.error("No Payment ID available to copy!");
                  }
                }}
              >
                {order.paymentDetails[0]?.razorpay_payment_id || "N/A"}
              </Box>
            </Tooltip>
          </Typography>
                        </Stack>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔹 Pagination */}
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </Stack>
  );
};
