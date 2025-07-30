import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByUserIdAsync, resetOrderFetchStatus, selectOrderFetchStatus, selectOrders } from '../OrderSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Button, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme,Tooltip, Snackbar } from '@mui/material'
import { Link } from 'react-router-dom'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import Lottie from 'lottie-react'
import { loadingAnimation, noOrdersAnimation } from '../../../assets'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion'

export const UserOrders = () => {

    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const orders = useSelector(selectOrders)
    const cartItems = useSelector(selectCartItems)
    const orderFetchStatus = useSelector(selectOrderFetchStatus)

    const theme = useTheme()
    const is1200 = useMediaQuery(theme.breakpoints.down("1200"))
    const is768 = useMediaQuery(theme.breakpoints.down("768"))
    const is660 = useMediaQuery(theme.breakpoints.down(660))
    const is480 = useMediaQuery(theme.breakpoints.down("480"))

    const cartItemAddStatus = useSelector(selectCartItemAddStatus)

    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 5

    const [copiedOrderId, setCopiedOrderId] = useState('')

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        dispatch(getOrderByUserIdAsync(loggedInUser?._id))
    }, [dispatch])

    useEffect(() => {

        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        }

        else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (orderFetchStatus === 'rejected') {
            toast.error("Error fetching orders, please try again later")
        }
    }, [orderFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetOrderFetchStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [])

    const handleAddToCart = (product) => {
        const item = { user: loggedInUser._id, product: product._id, quantity: 1 }
        dispatch(addToCartAsync(item))
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Smoothly scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = [...orders].reverse().slice(indexOfFirstOrder, indexOfLastOrder)

    const totalPages = Math.ceil(orders.length / ordersPerPage)

    const handleCopy = (orderId) => {
        navigator.clipboard.writeText(orderId)
        setCopiedOrderId(orderId)
        setTimeout(() => setCopiedOrderId(''), 2000) // Clear the copied message after 2 seconds
    }

    return (
        <Stack justifyContent={'center'} alignItems={'center'} sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            {
                orderFetchStatus === 'pending' ? 
                    <Stack width={is480 ? 'auto' : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
                        <Lottie animationData={loadingAnimation} />
                    </Stack> 
                    :
                    <Stack width={is1200 ? "auto" : "60rem"} p={is480 ? 2 : 4} mb={'5rem'} sx={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

                        {/* heading and navigation */}
                        <Stack flexDirection={'row'} columnGap={2} justifyContent={'space-between'} alignItems={'center'}>
                            {
                                !is480 && <motion.div whileHover={{ x: -5 }} style={{ alignSelf: "center" }}>
                                    <IconButton component={Link} to={"/"}><ArrowBackIcon fontSize='large' sx={{ color: '#555' }} /></IconButton>
                                </motion.div>
                            }

                            <Stack rowGap={1} width="100%" textAlign={is480 ? 'center' : 'left'}>
                                <Typography variant='h4' fontWeight={700} sx={{ color: '#333', textTransform: 'uppercase' }}>Order History</Typography>
                                <Typography sx={{ wordWrap: "break-word", color: '#777', fontWeight: 300 }}>Check the status of recent orders, manage returns, and discover similar products.</Typography>
                            </Stack>
                        </Stack>

                        {/* orders */}
                        <Stack mt={5} rowGap={5}>

                            {/* orders mapping */}
                            {
                                currentOrders && currentOrders.map((order) => (
                                    <Stack p={is480 ? 0 : 2} component={is480 ? "" : Paper} elevation={1} rowGap={2} key={order._id} sx={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>

                                        {/* upper */}
                                        <Stack flexDirection={'row'} rowGap={'1rem'} justifyContent={'space-between'} flexWrap={'wrap'}>
                                            <Stack flexDirection={'row'} columnGap={4} rowGap={'1rem'} flexWrap={'wrap'}>
                                                <Stack>
                                                    <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>Order Number</Typography>
                                                    <div>
                                                <Tooltip title="Click to copy" arrow>
                                                    <Typography 
                                                        color="text.secondary" 
                                                        fontWeight="bold" 
                                                        onClick={() => handleCopy(order._id)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        #{order._id}
                                                    </Typography>
                                                </Tooltip>

                                                {copiedOrderId === order._id && (
                                                   <Snackbar 
                                                   open={true} 
                                                   autoHideDuration={2000} 
                                                   message={<span><strong>Order ID Copied!</strong> 🎉</span>} 
                                                   sx={{
                                                       '& .MuiSnackbarContent-root': {
                                                           backgroundColor: '#4caf50', // Green background
                                                           color: 'white',
                                                           fontWeight: 'bold',
                                                           fontSize: '1rem',
                                                           padding: '8px 16px',
                                                           borderRadius: '8px',
                                                       }
                                                   }} 
                                               />
                                               
                                                )}
                                            </div>
                                                </Stack>

                                                <Stack>
                                                    <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>Date Placed</Typography>
                                                    <Typography color={'text.secondary'}>{new Date(order.createdAt).toDateString()}</Typography>
                                                </Stack>

                                                <Stack>
                                                    <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                                                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>₹{order.total}</Typography>
                                                </Stack>
                                            </Stack>

                                            <Stack>
                                                <Typography variant='body2'>Item: {order.item.length}</Typography>
                                            </Stack>
                                        </Stack>

                                        {/* middle */}
                                        <Stack rowGap={2} sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {
                                                order.item.map((product) => (
                                                    <Stack mt={2} flexDirection={'row'} rowGap={is768 ? '2rem' : ''} columnGap={4} flexWrap={is768 ? "wrap" : "nowrap"} key={product.product._id}>

                                                        <Stack>
                                                            <img style={{ width: "100%", aspectRatio: is480 ? 3 / 2 : 1 / 1, objectFit: "contain", borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} src={product.product.images[0]} alt="" />
                                                        </Stack>

                                                        <Stack rowGap={1} width={'100%'}>
                                                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                                                <Stack>
                                                                    <Typography variant='h6' fontSize={'1rem'} fontWeight={500}>{product.product.title}</Typography>
                                                                    <Typography variant='body1' fontSize={'.9rem'} color={'text.secondary'}>{product.product.brand.name}</Typography>
                                                                    <Typography color={'text.secondary'} fontSize={'.9rem'}>Qty: {product.quantity}</Typography>
                                                                </Stack>
                                                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>₹{product.product.price}</Typography>
                                                            </Stack>

                                                            <Typography color={'text.secondary'}>{product.product.description}</Typography>

                                                            <Stack mt={2} alignSelf={is480 ? "flex-start" : 'flex-end'} flexDirection={'row'} columnGap={2}>
                                                                <Button size='small' component={Link} to={`/product-details/${product.product._id}`} variant='outlined' sx={{ borderRadius: '20px', borderColor: '#5C6BC0', '&:hover': { borderColor: '#3F51B5' } }}>View Product</Button>
                                                                {
                                                                    cartItems.some((cartItem) => cartItem.product._id === product.product._id) ?
                                                                        <Button size='small' variant='contained' component={Link} to={"/cart"} sx={{ backgroundColor: '#3F51B5', '&:hover': { backgroundColor: '#303F9F' } }}>Already in Cart</Button>
                                                                        : <Button size='small' variant='contained' onClick={() => handleAddToCart(product.product)} sx={{ backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}>Buy Again</Button>
                                                                }
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                ))
                                            }
                                        </Stack>

                                        {/* lower */}
                                        <Stack mt={2} flexDirection={'row'} justifyContent={'space-between'}>
                                            <Typography mb={2} sx={{ fontWeight: 'bold' }}>Status: {order.status}</Typography>
                                        </Stack>

                                    </Stack>
                                ))
                            }

                            {/* no orders animation */}
                            {
                                !orders.length &&
                                <Stack mt={is480 ? '2rem' : 0} mb={'7rem'} alignSelf={'center'} rowGap={2}>
                                    <Stack width={is660 ? "auto" : '30rem'} height={is660 ? "auto" : '30rem'}>
                                        <Lottie animationData={noOrdersAnimation} />
                                    </Stack>

                                    <Typography textAlign={'center'} alignSelf={'center'} variant='h6' sx={{ color: '#FF4081' }}>Oh! Looks like you haven't been shopping lately</Typography>
                                </Stack>
                            }

                        </Stack>

                        {/* Pagination controls */}
                        {
                            orders.length > ordersPerPage &&
                            <Stack flexDirection={'row'} justifyContent={'center'} mt={4} columnGap={2}>
                               <Button
    variant={currentPage === 1 ? 'outlined' : 'contained'}
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    sx={{
        borderRadius: '20px',
        backgroundColor: currentPage === 1 ? '#A9A9A9' : '#3F51B5', // Change to gray when disabled
        color: currentPage === 1 ? '#B0BEC5' : '#ffffff', // Lighter text color when disabled
        '&:hover': {
            backgroundColor: currentPage === 1 ? '#A9A9A9' : '#303F9F', // Match disabled hover effect
        },
        opacity: currentPage === 1 ? 0.5 : 1, // Make the button translucent when disabled
        transition: 'all 0.3s ease', // Smooth transition for color change
    }}
>
    Prev
</Button>


                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    {`Page ${currentPage} of ${totalPages}`}
                                </Typography>

                                <Button
                                    variant={currentPage === totalPages ? 'outlined' : 'contained'}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    sx={{ borderRadius: '20px', backgroundColor: '#3F51B5', '&:hover': { backgroundColor: '#303F9F' } }}
                                >
                                    Next
                                </Button>
                            </Stack>
                        }
                    </Stack>
            }
        </Stack>
    )
}
