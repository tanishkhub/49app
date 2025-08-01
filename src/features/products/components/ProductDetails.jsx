import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync, resetProductFetchStatus, selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice'
import { Box, Checkbox, Rating, Stack, Typography, useMediaQuery, Button, Paper } from '@mui/material'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { fetchReviewsByProductIdAsync, resetReviewFetchStatus, selectReviewFetchStatus, selectReviews } from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { MotionConfig, motion } from 'framer-motion'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import Favorite from '@mui/icons-material/Favorite'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { useTheme } from '@mui/material'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'


const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLORS = ['#020202', '#F6F6F6', '#B82222', '#BEA9A9', '#E2BB8D']
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColorIndex, setSelectedColorIndex] = useState(-1)
    const reviews = useSelector(selectReviews)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const theme = useTheme()
    const is1420 = useMediaQuery(theme.breakpoints.down(1420))
    const is990 = useMediaQuery(theme.breakpoints.down(990))
    const is840 = useMediaQuery(theme.breakpoints.down(840))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const is387 = useMediaQuery(theme.breakpoints.down(387))
    const is340 = useMediaQuery(theme.breakpoints.down(340))

    const wishlistItems = useSelector(selectWishlistItems)

    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)

    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = parseInt(Math.ceil(totalReviewRating / totalReviews))

    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        } else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist")
        }
        else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later")
        }
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist")
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later")
        }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching product details, please try again later")
        }
    }, [productFetchStatus])

    useEffect(() => {
        if (reviewFetchStatus === 'rejected') {
            toast.error("Error fetching product reviews, please try again later")
        }
    }, [reviewFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct())
            dispatch(resetProductFetchStatus())
            dispatch(resetReviewFetchStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [])

    const handleAddToCart = () => {
        const item = { user: loggedInUser._id, product: id, quantity }
        dispatch(addToCartAsync(item))
        setQuantity(1)
    }

    const handleDecreaseQty = () => {
        if (quantity !== 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncreaseQty = () => {
        if (quantity < 20 && quantity < product.stockQuantity) {
            setQuantity(quantity + 1)
        }
    }

    const handleSizeSelect = (size) => {
        setSelectedSize(size)
    }

    const handleAddRemoveFromWishlist = (e) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: id }
            dispatch(createWishlistItemAsync(data))
        } else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === id)
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }

    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = product?.images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };


    return (
        <>
            {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center', mb: '3rem', rowGap: "3rem", maxWidth: '1200px' }}>
                    {
                        (productFetchStatus || reviewFetchStatus) === 'pending' ?
                            <Stack width={is500 ? "35vh" : '30rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
                                <Lottie animationData={loadingAnimation} />
                            </Stack>
                            :
                            <Stack>
                                {/* product details */}
                                <Stack width={is480 ? "auto" : is1420 ? "auto" : '90rem'} p={is480 ? 2 : 0} height={is840 ? "auto" : "55rem"} rowGap={5} mt={is840 ? 0 : 5} justifyContent={'center'} mb={5} flexDirection={is840 ? "column" : "row"} columnGap={is990 ? "2rem" : "4rem"}>

                                    {/* left stack (images) */}
                                    <Stack sx={{ flexDirection: "row", columnGap: "2.5rem", alignSelf: "flex-start", height: "100%" }}>

                                        {/* image selection */}
                                        {!is1420 && <Stack sx={{ display: "flex", rowGap: '1.5rem', height: "100%", overflowY: "scroll" }}>
                                            {
                                                product && product.images.map((image, index) => (
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }} style={{ width: "200px", cursor: "pointer" }} onClick={() => setSelectedImageIndex(index)}>
                                                        <img style={{ width: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} src={image} alt={`${product.title} image`} />
                                                    </motion.div>
                                                ))
                                            }
                                        </Stack>}

                                        {/* selected image */}
                                        <Stack mt={is480 ? "0rem" : '5rem'}>
                                            {
                                                is1420 ?
                                                    <Stack width={is480 ? "100%" : is990 ? '400px' : "500px"} >
                                                        <AutoPlaySwipeableViews width={'100%'} height={'100%'} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents >
                                                            {
                                                                product?.images.map((image, index) => (
                                                                    <div key={index} style={{ width: "100%", height: '100%' }}>
                                                                        {
                                                                            Math.abs(activeStep - index) <= 2
                                                                                ?
                                                                                <Box component="img" sx={{ width: '100%', objectFit: "contain", overflow: "hidden", aspectRatio: 1 / 1, borderRadius: '12px' }} src={image} alt={product?.title} />
                                                                                :
                                                                                null
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </AutoPlaySwipeableViews>

                                                        <MobileStepper steps={maxSteps} position="static" activeStep={activeStep} nextButton={<Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} sx={{ color: 'black', fontWeight: 600, transition: "0.2s" }} >Next {theme.direction === 'rtl' ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}</Button>} backButton={<Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={{ color: 'black', fontWeight: 600, transition: "0.2s" }}>{theme.direction === 'rtl' ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)} Back</Button>} />
                                                    </Stack>
                                                    :
                                                    <div style={{ width: "100%" }}>
                                                        <img style={{ width: "100%", objectFit: "contain", aspectRatio: 1 / 1, borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} src={product?.images[selectedImageIndex]} alt={`${product?.title} image`} />
                                                    </div>
                                            }
                                        </Stack>

                                    </Stack>

                                    {/* right stack - about product */}
                                    <Stack rowGap={"1.5rem"} width={is480 ? "100%" : '28rem'}>
                                        {/* title rating price */}
                                        <Stack rowGap={".5rem"}>

                                            {/* title */}
                                            <Typography variant='h3' fontWeight={700} color={'#333'}>{product?.title}</Typography>

                                            {/* rating */}
                                            <Stack sx={{ flexDirection: "row", columnGap: is340 ? ".5rem" : "1rem", alignItems: "center", flexWrap: 'wrap', rowGap: '1rem' }}>
                                                <Rating value={averageRating} readOnly />
                                                <Typography variant="body2" color="textSecondary">( {totalReviews === 0 ? "No reviews" : totalReviews === 1 ? `${totalReviews} Review` : `${totalReviews} Reviews`} )</Typography>
                                                <Typography color={product?.stockQuantity <= 10 ? "error" : product?.stockQuantity <= 20 ? "orange" : "green"}>{product?.stockQuantity <= 10 ? `Only ${product?.stockQuantity} left` : product?.stockQuantity <= 20 ? "Only few left" : "In Stock"}</Typography>
                                            </Stack>

                                            {/* price */}
                                            <Typography variant='h5' sx={{ fontWeight: 600, color: '#555' }}>₹{product?.price}</Typography>
                                        </Stack>

                                        {/* description */}
                                        <Stack rowGap={".8rem"}>
                                            <Typography color="#666">{product?.description}</Typography>
                                            <hr />
                                        </Stack>


                                        {/* color, size and add-to-cart */}

                                        {
                                            !loggedInUser?.isAdmin &&

                                            <Stack sx={{ rowGap: "1.3rem", borderRadius: '10px', padding: '2rem', backgroundColor: '#f9f9f9' }}>

                                                {/* quantity , add to cart and wishlist */}
                                                <Stack flexDirection={"row"} columnGap={is387 ? ".3rem" : "1.5rem"} width={'100%'} justifyContent="space-between" alignItems="center" >

                                                    {/* qunatity */}
                                                    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} onClick={handleDecreaseQty} style={{ padding: "10px 15px", fontSize: "1.1rem", backgroundColor: "white", color: "black", outline: "none", border: '1px solid #ddd', borderRadius: "8px" }}>-</motion.button>
                                                        <p style={{ margin: "0 1rem", fontSize: "1.1rem", fontWeight: '400' }}>{quantity}</p>
                                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} onClick={handleIncreaseQty} style={{ padding: "10px 15px", fontSize: "1.1rem", backgroundColor: "black", color: "white", outline: "none", border: 'none', borderRadius: "8px" }}>+</motion.button>
                                                    </Stack>

                                                    {/* add to cart */}
                                                    {
                                                        isProductAlreadyInCart ?
                                                            <button style={{ padding: "10px 15px", fontSize: "1.1rem", backgroundColor: "black", color: "white", outline: "none", border: 'none', borderRadius: "8px" }} onClick={() => navigate("/cart")}>In Cart</button>
                                                            :
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} onClick={handleAddToCart} style={{ padding: "10px 15px", fontSize: "1.1rem", backgroundColor: "black", color: "white", outline: "none", border: 'none', borderRadius: "8px" }}>Add To Cart</motion.button>
                                                    }

                                                    {/* wishlist */}
                                                    <motion.div style={{ border: "1px solid grayText", borderRadius: "4px", display: "flex", justifyContent: "center", alignItems: "center", padding: '5px' }}>
                                                        <Checkbox checked={isProductAlreadyinWishlist} onChange={(e) => handleAddRemoveFromWishlist(e)} icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: 'red' }} />} />
                                                    </motion.div>

                                                </Stack>

                                            </Stack>
                                        }

                                        {/* product perks */}
                                        <Stack mt={3} sx={{ justifyContent: "center", alignItems: 'center', border: "1px grayText solid", borderRadius: "7px", padding: '2rem' }}>

                                            <Stack flexDirection={'row'} alignItems={"center"} columnGap={'1rem'} width={'100%'} justifyContent={'flex-start'}>
                                                <Box>
                                                    <LocalShippingOutlinedIcon sx={{ fontSize: "2rem", color: '#4caf50' }} />
                                                </Box>
                                                <Stack>
                                                    <Typography variant="body1" fontWeight={500}>Fast Delivery</Typography>
                                                    <Typography variant="body2" color="textSecondary">Enter your postal code to check</Typography>
                                                </Stack>
                                            </Stack>
                                            <hr style={{ width: "100%" }} />
                                            <Stack flexDirection={'row'} alignItems={"center"} width={'100%'} columnGap={'1rem'} justifyContent={'flex-start'}>
                                                <Box>
                                                    <CachedOutlinedIcon sx={{ fontSize: "2rem", color: '#ff9800' }} />
                                                </Box>
                                                
                                                <Stack>
                                                    <Typography variant="body1" fontWeight={500}>Easy Returns</Typography>
                                                    <Typography variant="body2" color="textSecondary">Free 30 Days Delivery Returns</Typography>
                                                </Stack>
                                            </Stack>

                                        </Stack>

                                    </Stack>

                                </Stack>

                                {/* reviews */}
                                <Stack width={is1420 ? "auto" : '90rem'} p={is480 ? 2 : 0}>
                                    <Reviews productId={id} averageRating={averageRating} />
                                </Stack>
                            </Stack>
                    }
                </Stack>
            )}
        </>
    )
}
