import { Paper, Stack, Typography, useTheme, Tooltip, Box } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import logo from '../../../assets/images/logo.svg'; // Import your logo.svg

export const ProductCard = ({ 
  id, 
  title, 
  price, 
  thumbnail, 
  brand, 
  stockQuantity, 
  handleAddRemoveFromWishlist, 
  isWishlistCard, 
  isAdminCard 
}) => {
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const theme = useTheme();

  const isProductAlreadyInWishlist = wishlistItems.some(item => item.product._id === id);
  const isProductAlreadyInCart = cartItems.some(item => item.product._id === id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const data = { user: loggedInUser?._id, product: id };
    dispatch(addToCartAsync(data));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 300,
          height: 450,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #ffffff, #f2f2f2)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => navigate(`/product-details/${id}`)}
      >
        {/* Top Right: Wishlist Icon */}
        <Stack
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          {!isAdminCard && (
            <Tooltip title={isProductAlreadyInWishlist ? "Remove from Wishlist" : "Add to Wishlist"} arrow>
              <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={isProductAlreadyInWishlist}
                  onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                  icon={<FavoriteBorder sx={{ fontSize: '1.8rem', color: '#888' }} />}
                  checkedIcon={<Favorite sx={{ color: '#e91e63', fontSize: '1.8rem' }} />}
                />
              </motion.div>
            </Tooltip>
          )}
        </Stack>

        {/* Image Section */}
<Stack
  sx={{
    flex: 1,
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    px: 2,
    py: 2,
  }}
>
  <Box
    component={motion.div}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    sx={{
      width: '100%',
      height: '100%',
      maxHeight: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 2,
    }}
  >
    <Box
      component="img"
  src={thumbnail}
  alt={title}
  loading="lazy"
  width="100%"
  height="auto"
  style={{ objectFit: "contain" }}
  onError={(e) => { e.target.src = logo; }} // Optional fallback
    />
  </Box>

  {/* Overlay for hover effect */}
  <motion.div
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 0.15 }}
    transition={{ duration: 0.3 }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000',
      borderRadius: '12px',
    }}
  />
</Stack>


        {/* Info & Action Section */}
        <Stack
          sx={{
            p: 2,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
          }}
          spacing={1}
        >
          {/* Title & Brand */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: theme.palette.text.secondary,
            }}
          >
            {brand}
          </Typography>

          {/* Price with Logo */}
          <Typography
            variant="h6"
            fontWeight={600}
            color={theme.palette.primary.main}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <img 
  src={logo} 
  alt="Rupee" 
  style={{ width: '2.5em', height: '2em', marginRight: '0.3em', verticalAlign: 'middle', transform: 'scaleX(2)' }} 
/>{price}
          </Typography>

          {/* Action Buttons */}
          <Stack spacing={1} mt={1}>
            {isWishlistCard ? null : (
              isProductAlreadyInCart ? (
                <Typography variant="body2" color="success.main" align="center">
                  Added to Cart
                </Typography>
              ) : (
                !isAdminCard && (
                  <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={(e) => {
    e.stopPropagation();
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    handleAddToCart(e);
  }}
  style={{
    width: '100%',
    padding: '10px 0',
    borderRadius: '30px',
    border: 'none',
    outline: 'none',
    background: !loggedInUser
      ? 'linear-gradient(90deg, #757575, #9e9e9e)'
      : 'linear-gradient(90deg, #e91e63, #ff4081)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  }}
>
  {loggedInUser ? 'Add to Cart' : 'Login to add to cart'}
</motion.button>

                )
              )
            )}

            {/* Stock Alert */}
            {stockQuantity <= 20 && (
              <Typography variant="caption" color="error" align="center">
                {stockQuantity === 1 ? "Only 1 left in stock!" : "Limited stock available!"}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
};
