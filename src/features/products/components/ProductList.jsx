import { FormControl, Button, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice';
import { ProductCard } from './ProductCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice';
import Pagination from '@mui/material/Pagination';
import { ITEMS_PER_PAGE } from '../../../constants';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets';
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import { ProductBanner } from './ProductBanner';
import ClearIcon from '@mui/icons-material/Clear';
import Lottie from 'lottie-react';


const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
];


const bannerImages = [banner1, banner3, banner2, banner4];
export const ProductList = () => {

    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(null);
    const theme = useTheme();
    
    const is1200 = useMediaQuery(theme.breakpoints.down(1200));
    const is800 = useMediaQuery(theme.breakpoints.down(800));
    const is700 = useMediaQuery(theme.breakpoints.down(700));
    const is600 = useMediaQuery(theme.breakpoints.down(600));
    const is500 = useMediaQuery(theme.breakpoints.down(500));
    const is488 = useMediaQuery(theme.breakpoints.down(488));
    
    
    const [joke, setJoke] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);



    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const totalResults = useSelector(selectProductTotalResults);
    const loggedInUser = useSelector(selectLoggedInUser);

    const productFetchStatus = useSelector(selectProductFetchStatus);

    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

    const cartItemAddStatus = useSelector(selectCartItemAddStatus);

    const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

    const dispatch = useDispatch();

    const handleBrandFilters = (e) => {
        const filterSet = new Set(filters.brand);
        if (e.target.checked) {
            filterSet.add(e.target.value);
        } else {
            filterSet.delete(e.target.value);
        }
        const filterArray = Array.from(filterSet);
        setFilters({ ...filters, brand: filterArray });
    };

    const handleCategoryFilters = (e) => {
        const filterSet = new Set(filters.category);
        if (e.target.checked) {
            filterSet.add(e.target.value);
        } else {
            filterSet.delete(e.target.value);
        }
        const filterArray = Array.from(filterSet);
        setFilters({ ...filters, category: filterArray });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
    setPage(1);
}, [filters, sort]);

const [isPageChanging, setIsPageChanging] = useState(false); 
useEffect(() => {
    setIsPageChanging(true);
    const finalFilters = { ...filters };
    finalFilters['pagination'] = { page, limit: ITEMS_PER_PAGE };
    finalFilters['sort'] = sort;
    if (!loggedInUser?.isAdmin) finalFilters['user'] = true;

    dispatch(fetchProductsAsync(finalFilters)).finally(() => {
        setIsPageChanging(false);
    });
}, [filters, page, sort]);




useEffect(() => {
    const finalFilters = { ...filters };
    finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE };
    finalFilters['sort'] = sort;

    if (!loggedInUser?.isAdmin) {
        finalFilters['user'] = true;
    }

    dispatch(fetchProductsAsync(finalFilters)); // this is correct!
}, [filters, page, sort]);

    
    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: productId };
            dispatch(createWishlistItemAsync(data));
        } else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === productId);
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    };

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist");
        } else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later");
        }
    }, [wishlistItemAddStatus]);

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist");
        } else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later");
        }
    }, [wishlistItemDeleteStatus]);

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart");
        } else if (cartItemAddStatus === 'rejected') {
            toast.error("Error adding product to cart, please try again later");
        }
    }, [cartItemAddStatus]);

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching products, please try again later");
        }
    }, [productFetchStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus());
            dispatch(resetWishlistItemAddStatus());
            dispatch(resetWishlistItemDeleteStatus());
            dispatch(resetCartItemAddStatus());
        };
    }, []);
    useEffect(() => {
        const fetchJoke = async () => {
            try {
                const response = await fetch("https://official-joke-api.appspot.com/random_joke");
                const data = await response.json();
                setJoke(data);
            } catch (error) {
                console.error("Error fetching joke:", error);
            }
        };

        fetchJoke();
    }, []);
    const fetchNewJoke = async () => {
        try {
            const response = await fetch("https://official-joke-api.appspot.com/random_joke");
            const data = await response.json();
            setJoke(data);
            setRefreshCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error("Error fetching new joke:", error);
        }
    };

    const handleFilterClose = () => {
        dispatch(toggleFilters());
    };

    return (
        <>
            {/* filters side bar */}
            {productFetchStatus === 'pending' ? (
                <Stack width={is500 ? "35vh" : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} marginRight={'auto'} marginLeft={'auto'}>
                    <Lottie animationData={loadingAnimation} />
                </Stack>
            ) : (
                <>
                    <motion.div
    style={{
        position: "fixed",
        top: 0,
        right: 0,
        backgroundColor: "white",
        height: "100vh",
        padding: '1rem',
        overflowY: "scroll",
        width: is500 ? "100vw" : "30rem",
        zIndex: 500
    }}
    variants={{
        show: { right: 0 },
        hide: { right: '-100%' }, // or -500 if fixed width
    }}
    initial="hide"
    transition={{ ease: "easeInOut", duration: .7, type: "spring" }}
    animate={isProductFilterOpen === true ? "show" : "hide"}
>

                        {/* fitlers section */}
                        <Stack
                            mb={'5rem'}
                            sx={{
                                scrollBehavior: "smooth",
                                overflowY: "scroll",
                                position: "relative",
                                padding: "1.5rem",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                maxWidth: "450px",
                            }}
                        >
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    fontSize: '1.875rem',
                                    color: '#333',
                                    letterSpacing: '-0.5px',
                                    mb: 3
                                }}
                            >
                                New Arrivals
                            </Typography>

                            <IconButton
                                onClick={handleFilterClose}
                                sx={{
                                    position: "absolute",
                                    top: 15,
                                    right: 15,
                                    color: '#757575',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: '#000',
                                    }
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ClearIcon fontSize="medium" />
                                </motion.div>
                            </IconButton>

                            <Stack rowGap={2} mt={4}>
                                <Typography
                                    variant='body1'
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: '#007bff',
                                            fontWeight: 600
                                        },
                                        transition: "color 0.3s, font-weight 0.3s"
                                    }}
                                >
                                    💄 Glow & Go (Beauty Essentials)
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: '#007bff',
                                            fontWeight: 600
                                        },
                                        transition: "color 0.3s, font-weight 0.3s"
                                    }}
                                >
                                    💍 Everyday Bling (Accessories)
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: '#007bff',
                                            fontWeight: 600
                                        },
                                        transition: "color 0.3s, font-weight 0.3s"
                                    }}
                                >
                                   🧷 Hair Affair (Hair Accessories)
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: '#007bff',
                                            fontWeight: 600
                                        },
                                        transition: "color 0.3s, font-weight 0.3s"
                                    }}
                                >
                                   🧼 Home Fixers (Daily Tools)
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: '#007bff',
                                            fontWeight: 600
                                        },
                                        transition: "color 0.3s, font-weight 0.3s"
                                    }}
                                >
                                    🎁 Gift it @₹49 (Budget Gifting)
                                </Typography>
                            </Stack>

                            {/* brand filters */}
                            <Stack mt={3} spacing={2}>
                                <Accordion
                                    sx={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #e0e0e0', // Light border with a premium look
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle, elegant shadow
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)', // Slight increase in shadow on hover
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<AddIcon sx={{ color: '#B0BEC5' }} />}
                                        aria-controls="brand-filters"
                                        id="brand-filters"
                                        sx={{
                                            backgroundColor: '#ffffff', // Light background for elegance
                                            color: '#212121', // Dark text for contrast
                                            padding: '16px 24px',
                                            borderRadius: 12,
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5', // Elegant hover effect
                                            },
                                        }}
                                    >
                                        <Typography fontWeight={600} fontSize={17} color="#212121">
                                            Brands
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 2 }}>
                                        <FormGroup onChange={handleBrandFilters}>
                                            {brands?.map((brand) => (
                                                <motion.div
                                                    key={brand._id}
                                                    style={{ width: 'fit-content' }}
                                                    whileHover={{ x: 5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FormControlLabel
                                                        sx={{
                                                            ml: 1,
                                                            '& .MuiCheckbox-root': {
                                                                color: '#B0BEC5', // Light gray checkbox
                                                                '&.Mui-checked': {
                                                                    color: '#00796b', // Teal color when checked (more modern)
                                                                },
                                                            },
                                                            '& .MuiTypography-root': {
                                                                fontSize: 15,
                                                                fontWeight: 500,
                                                                color: '#212121', // Dark gray text for labels
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: '#f5f5f5', // Subtle hover background
                                                            },
                                                        }}
                                                        control={<Checkbox />}
                                                        label={brand.name}
                                                        value={brand._id}
                                                    />
                                                </motion.div>
                                            ))}
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>

                            {/* category filters */}
                            <Stack mt={3} spacing={2}>
                                <Accordion
                                    sx={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<AddIcon sx={{ color: '#B0BEC5' }} />}
                                        aria-controls="category-filters"
                                        id="category-filters"
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            color: '#212121',
                                            padding: '16px 24px',
                                            borderRadius: 12,
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}
                                    >
                                        <Typography fontWeight={600} fontSize={17} color="#212121">
                                            Category
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 2 }}>
                                        <FormGroup onChange={handleCategoryFilters}>
                                            {categories?.map((category) => (
                                                <motion.div
                                                    key={category._id}
                                                    style={{ width: 'fit-content' }}
                                                    whileHover={{ x: 5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FormControlLabel
                                                        sx={{
                                                            ml: 1,
                                                            '& .MuiCheckbox-root': {
                                                                color: '#B0BEC5', // Light gray color for checkboxes
                                                                '&.Mui-checked': {
                                                                    color: '#00796b', // Teal color when checked
                                                                },
                                                            },
                                                            '& .MuiTypography-root': {
                                                                fontSize: 15,
                                                                fontWeight: 500,
                                                                color: '#212121', // Elegant dark text for labels
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: '#f5f5f5', // Light hover effect
                                                            },
                                                        }}
                                                        control={<Checkbox />}
                                                        label={category.name}
                                                        value={category._id}
                                                    />
                                                </motion.div>
                                            ))}
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>

                            {/* Laugh Break Section */}
                            <Stack
                                mt={4}
                                sx={{
                                    padding: '2rem',
                                    backgroundColor: '#fff8f0',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                                    textAlign: 'center',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                }}
                            >
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: '#FF7043' }}>
                                    😄 Ready to Crack Up? Your Daily Laugh Awaits! 😄
                                </Typography>

                                {joke ? (
                                    <Stack spacing={3}>
                                        <Typography variant="h5" fontWeight={500} sx={{ color: '#424242' }}>
                                            "{joke.setup}"
                                        </Typography>
                                        <Typography variant="h6" fontWeight={400} sx={{ color: '#616161' }}>
                                            "{joke.punchline}"
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#757575' }}>
                                            Phew! That one was a knee-slapper! 😆
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        Hold tight! We're cooking up your next favorite joke... ⏳
                                    </Typography>
                                )}

                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 4,
                                        backgroundColor: '#FF5722',
                                        color: '#fff',
                                        padding: '10px 24px',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        borderRadius: '8px',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#E64A19',
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 8px 18px rgba(0, 0, 0, 0.15)',
                                        },
                                    }}
                                    onClick={fetchNewJoke}
                                >
                                    🔄 Hit Me with Another Laugh
                                </Button>

                                {refreshCount > 3 && (
                                    <Typography variant="body2" sx={{ mt: 3, color: '#333' }}>
                                        You’ve hit a high score in joke-refreshing! Keep 'em coming... 😂
                                    </Typography>
                                )}

                                <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
                                    More laughs on the way? Just drop by again, we’ve got endless jokes to go around! 🎉
                                </Typography>
                            </Stack>


                        </Stack>

                    </motion.div>

                    <Stack mb={'3rem'}>
                        {/* banners section */}
                        <Stack
                            sx={{
                                width: "100%",
                                height: "auto", // Use auto to allow flexible height for mobile
                                minHeight: is800 ? "300px" : is1200 ? "400px" : "500px", // Ensure a minimum height on larger screens
                            }}
                        >
                            <ProductBanner images={bannerImages} />
                        </Stack>
                        

                        {/* products */}
                        <Stack rowGap={5} mt={is600 ? 2 : 0}>



                            {/* product grid */}
                            <Grid gap={is700 ? 1 : 2} container justifyContent={'center'} alignContent={'center'}>
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        title={product.title}
                                        thumbnail={product.thumbnail}
                                        brand={product.brand.name}
                                        price={product.price}
                                        handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                    />
                                ))}
                            </Grid>

                            {/* pagination */}
                            <Stack alignSelf={is488 ? 'center' : 'flex-end'} mr={is488 ? 0 : 5} rowGap={2} p={is488 ? 1 : 0}>
                                <Pagination
  size={is488 ? 'medium' : 'large'}
  page={page}
  onChange={(e, value) => setPage(value)}
  count={Math.ceil(totalResults / ITEMS_PER_PAGE)} // 👍 Based on server response
  variant="outlined"
  shape="rounded"
/>

                                <Typography textAlign={'center'}>
                                    Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </>
            )}
        </>
    );
};
