import { Box, Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetCurrentOrder, selectCurrentOrder } from '../features/order/OrderSlice';
import { selectUserInfo } from '../features/user/UserSlice';
import { orderSuccessAnimation } from '../assets';
import Lottie from 'lottie-react';

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const userDetails = useSelector(selectUserInfo);
  const { id } = useParams();

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (currentOrder?._id) {
      navigator.clipboard.writeText(currentOrder._id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the "copied" state after 2 seconds
      });
    }
  };

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  return (
    <Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Stack
        component={Paper}
        boxShadow={is480 ? 'none' : ''}
        rowGap={3}
        elevation={1}
        p={is480 ? 1 : 4}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box width={'10rem'} height={'7rem'}>
          <Lottie animationData={orderSuccessAnimation}></Lottie>
        </Box>

        <Stack mt={2} textAlign={'center'} justifyContent={'center'} alignItems={'center'} rowGap={1}>
          <Typography variant="h6" fontWeight={400}>
            Hey {userDetails?.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'bold' }}
            onClick={handleCopyOrderId}
          >
            Your Order <strong>#{currentOrder?._id}</strong> is confirmed
          </Typography>
          {copied && (
            <Typography variant="body2" color="success.main">
              Order ID copied to clipboard!
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Thank you for shopping with us ❤️
          </Typography>
        </Stack>

        <Button
          component={Link}
          to={'/orders'}
          onClick={() => dispatch(resetCurrentOrder())}
          size={is480 ? 'small' : ''}
          variant="contained"
        >
          Check order status in my orders
        </Button>
      </Stack>
    </Stack>
  );
};
