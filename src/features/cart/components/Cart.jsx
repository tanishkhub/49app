import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button, Chip, Stack, Typography, useMediaQuery, useTheme, Paper } from '@mui/material'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const subtotal = items.reduce((acc, item) => item.product.price * item.quantity + acc, 0)
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const navigate = useNavigate()
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))

    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    const total = subtotal + SHIPPING + TAXES
    const isCartValueValid = total >= 200

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    useEffect(() => {
        if (items.length === 0) {
            navigate("/")
        }
    }, [items])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Product removed from cart")
        }
        else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later")
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [])

    return (
        <Stack justifyContent={'center'} alignItems={'center'} mb={'5rem'}>
            <Paper 
                elevation={6} 
                sx={{
                    width: is900 ? 'auto' : '50rem', 
                    padding: 4, 
                    backgroundColor: '#fff', 
                    borderRadius: 4, 
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                    },
                }}>

                <Stack rowGap={4}>

                    {/* Cart Items with Internal Scroll if > 3 */}
                    <Stack 
                        sx={{
                            maxHeight: items.length > 3 ? '550px' : 'auto', 
                            overflowY: items.length > 3 ? 'auto' : 'visible', 
                            paddingBottom: 2,
                        }} 
                        rowGap={3}>
                        {
                            items && items.map((item) => (
                                <CartItem
                                    key={item._id}
                                    id={item._id}
                                    title={item.product.title}
                                    brand={item.product.brand.name}
                                    category={item.product.category.name}
                                    price={item.product.price}
                                    quantity={item.quantity}
                                    thumbnail={item.product.thumbnail}
                                    stockQuantity={item.product.stockQuantity}
                                    productId={item.product._id}
                                />
                            ))
                        }
                    </Stack>

                    {/* Subtotal and Summary */}
                    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mt={3}>
                        {
                            checkout ? (
                                <Stack rowGap={3} width={'100%'}>
                                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                        <Typography variant="body1" fontWeight={500} color="text.secondary">Subtotal</Typography>
                                        <Typography variant="h6" fontWeight={600}>₹{subtotal}</Typography>
                                    </Stack>

                                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                        <Typography variant="body1" fontWeight={500} color="text.secondary">Shipping</Typography>
                                        <Typography variant="h6" fontWeight={600}>₹{SHIPPING}</Typography>
                                    </Stack>

                                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                        <Typography variant="body1" fontWeight={500} color="text.secondary">Taxes</Typography>
                                        <Typography variant="h6" fontWeight={600}>₹{TAXES}</Typography>
                                    </Stack>

                                    <hr style={{ borderColor: theme.palette.divider, margin: '16px 0' }} />

                                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                        <Typography variant="h4" fontWeight={700}>Total</Typography>
                                        <Typography variant="h4" fontWeight={700}>₹{total}</Typography>
                                    </Stack>
                                </Stack>
                            ) : (
                                <>
                                    <Stack>
                                        <Typography variant='body2' color={'text.secondary'}>Total items in cart: {totalItems}</Typography>
                                        <Typography variant='h6' fontWeight={500} color="text.secondary">Subtotal</Typography>
                                        
                                    </Stack>

                                    <Stack mt={2}>
                                        <Typography variant='h5' fontWeight={700}>₹{subtotal}</Typography>
                                    </Stack>
                                    
                                </>
                                
                            )
                        }
                    </Stack>

                    {/* Checkout or Continue Shopping */}
                    {
                        !checkout && 
                        <Stack rowGap={'1.5rem'}>
                            <Button 
                                variant='contained' 
                                color='primary' 
                                component={Link} 
                                to='/checkout' 
                                disabled={!isCartValueValid} 
                                fullWidth 
                                sx={{
                                    borderRadius: '50px', 
                                    fontWeight: 600, 
                                    padding: '12px 25px', 
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)', 
                                    transition: 'all 0.3s ease', 
                                    '&:hover': {
                                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                                        transform: 'scale(1.05)'
                                    }
                                }}>
                                Checkout
                            </Button>
<Typography textAlign={'center'} fontSize={'0.8rem !important'} color={'text.secondary'}>Shipping and taxes will be calculated at checkout.</Typography>
                           
                                

                            {!isCartValueValid && 
                               <Typography variant="body2" color="error" textAlign="center" fontWeight={500}>
                               Minimum cart value for checkout is <span style={{ fontWeight: 'bold' }}>₹200</span>.
                             </Typography>
                             
                            }

                            <motion.div 
                                style={{ alignSelf: 'center' }} 
                                whileHover={{ scale: 1.1, opacity: 0.85 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Chip 
                                    sx={{
                                        cursor: "pointer",
                                        borderRadius: "25px", 
                                        fontWeight: 500, 
                                        textTransform: 'none', 
                                        padding: '8px 20px', 
                                        backgroundColor: theme.palette.grey[100],
                                        '&:hover': { 
                                            backgroundColor: theme.palette.grey[200],
                                            transform: 'scale(1.05)'
                                        }
                                    }} 
                                    component={Link} 
                                    to={'/'} 
                                    label="or continue shopping" 
                                    variant='outlined'
                                />
                            </motion.div>
                        </Stack>
                    }

                </Stack>

            </Paper>
        </Stack>
    )
}
