import { Stack, TextField, Typography, Button, Grid, FormControl, Radio, Paper, IconButton, useTheme, useMediaQuery, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Cart } from '../../cart/components/Cart';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addAddressAsync, selectAddresses, selectAddressStatus } from '../../address/AddressSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice';
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants';
import { motion } from 'framer-motion';

export const Checkout = () => {
    const addresses = useSelector(selectAddresses);
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const { register, handleSubmit, reset } = useForm();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(selectLoggedInUser);
    const addressStatus = useSelector(selectAddressStatus);
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const orderStatus = useSelector(selectOrderStatus);
    const currentOrder = useSelector(selectCurrentOrder);

    // Calculate order total and round up to nearest integer
    const orderTotal = Math.ceil(cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0));

    const theme = useTheme();
    const is900 = useMediaQuery(theme.breakpoints.down(900));
    const is480 = useMediaQuery(theme.breakpoints.down(480));

    // State for error message and button disable logic
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            reset();
        } else if (addressStatus === 'rejected') {
            alert('Error adding your address');
        }
    }, [addressStatus]);

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            dispatch(resetCartByUserIdAsync(loggedInUser?._id));
            navigate(`/order-success/${currentOrder?._id}`);
        }
    }, [currentOrder]);

    const handleAddAddress = (data) => {
        const address = { ...data, user: loggedInUser._id };
        dispatch(addAddressAsync(address));
        reset();
    };

    const handleCreateOrder = () => {
        const order = {
            user: loggedInUser._id,
            item: cartItems,
            address: selectedAddress,
            paymentMode: selectedPaymentMethod === 'cash' ? 'COD' : 'Online',
            total: Math.ceil(orderTotal + SHIPPING + TAXES), // Use rounded orderTotal here
        };
        dispatch(createOrderAsync(order));
    };

    const handleOnlinePayment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/orders/create-razorpay-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: selectedAddress,
                    total: Math.ceil(orderTotal + SHIPPING + TAXES) * 100, // Round up the total before sending to Razorpay
                    currency: 'INR',
                    user: loggedInUser._id,
                    paymentMode: selectedPaymentMethod === 'cash' ? 'COD' : 'Online',
                    item: cartItems,
                }),
            });

            const data = await response.json();

            if (data.orderId) {
                alert(process.env.REACT_APP_RAZORPAY_KEY_ID)
                const options = {
                   
                    
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Fetch this from .env
                    amount: data.amount,
                    currency: data.currency,
                    name: '49stores',
                    description: 'Thank you For Ordering',
                    image: '/logo.png', // Replace with your logo
                    order_id: data.orderId,
                    handler: async (response) => {
                        // Save the payment ID and then create the order
                        const paymentDetails = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        await handleCreateOrderWithPayment(paymentDetails); // This only runs after successful payment
                    },
                    prefill: {
                        name: loggedInUser.name,
                        email: loggedInUser.email,
                        contact: loggedInUser.phone,
                    },
                    theme: {
                        color: '#3399cc',
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert('Error creating Razorpay order');
            }
        } catch (error) {
            console.error(error);
            alert('Payment failed, please try again.');
        }
    };

    const handleCreateOrderWithPayment = async (paymentDetails) => {
        const order = {
            user: loggedInUser._id,
            item: cartItems,
            address: selectedAddress,
            paymentMode: selectedPaymentMethod === 'cash' ? 'COD' : 'Online',
            total: Math.ceil(orderTotal + SHIPPING + TAXES), // Use rounded orderTotal here
            paymentDetails, // Add payment details to the order object
            paymentStatus: 'Success',
        };

        dispatch(createOrderAsync(order));
    };

    const handlePayment = () => {
        const totalAmount = Math.ceil(orderTotal + SHIPPING + TAXES);

        // Check if the total amount exceeds 499
        if (totalAmount < 499) {
            setErrorMessage('Minimum order value should exceed ₹499.');
            return; // Prevent further execution if validation fails
        }

        setErrorMessage(''); // Clear any previous error messages

        if (selectedPaymentMethod === 'cash') {
            handleCreateOrder(); // Handle order creation for cash on delivery
        } else {
            handleOnlinePayment(); // Handle online payment
        }
    };

    return (
        <Stack
            flexDirection={'row'}
            p={3}
            rowGap={10}
            justifyContent={'center'}
            flexWrap={'wrap'}
            mb={'5rem'}
            mt={2}
            columnGap={4}
            alignItems={'flex-start'}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '10px',
                boxShadow: 3,
            }}
        >
            {/* Left Section */}
            <Stack rowGap={4} width={is900 ? '100%' : '50%'}>
                {/* Heading */}
                <Stack flexDirection={'row'} columnGap={is480 ? 0.3 : 1} alignItems={'center'}>
                    <motion.div whileHover={{ x: -5 }}>
                        <IconButton component={Link} to={"/cart"}>
                            <ArrowBackIcon fontSize={is480 ? 'medium' : 'large'} />
                        </IconButton>
                    </motion.div>
                    <Typography variant='h4' fontWeight={600} color={theme.palette.primary.main}>
                        Shipping Information
                    </Typography>
                </Stack>

                {/* Address Form */}
                <Card sx={{ padding: 3, borderRadius: '8px', boxShadow: 1 }}>
                    <Stack component={'form'} noValidate rowGap={3} onSubmit={handleSubmit(handleAddAddress)}>
                        <Typography variant="h6" color={theme.palette.text.primary}>Add New Address</Typography>
                        <TextField label="Address Type" variant="outlined" fullWidth {...register("type", { required: true })} />
                        <TextField label="Street" variant="outlined" fullWidth {...register("street", { required: true })} />
                        <TextField label="Country" variant="outlined" fullWidth {...register("country", { required: true })} />
                        <TextField label="Phone Number" type="number" variant="outlined" fullWidth {...register("phoneNumber", { required: true })} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label="City" variant="outlined" fullWidth {...register("city", { required: true })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="State" variant="outlined" fullWidth {...register("state", { required: true })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Postal Code" type="number" variant="outlined" fullWidth {...register("postalCode", { required: true })} />
                            </Grid>
                        </Grid>

                        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <LoadingButton
                                loading={addressStatus === 'pending'}
                                variant="contained"
                                type="submit"
                            >
                                Add Address
                            </LoadingButton>
                            <Button variant="outlined" color="error" onClick={() => reset()}>
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Card>

                {/* Existing Addresses */}
                <Stack>
                    <Typography variant="h6">Choose an Existing Address</Typography>
                    <Grid container spacing={2}>
                        {addresses.map((address) => (
                            <Grid item key={address._id}>
                                <Card sx={{ padding: 2, width: '20rem', boxShadow: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Radio
                                            checked={selectedAddress === address}
                                            onChange={() => setSelectedAddress(address)}
                                            color="primary"
                                        />
                                        <Typography>{address.type}</Typography>
                                    </Stack>
                                    <Typography variant="body2">{address.street}, {address.city}, {address.state}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>

                {/* Payment Methods */}
                <Stack rowGap={3}>
                    <Typography variant="h6">Select Payment Method</Typography>
                    <Stack rowGap={1}>
                        <Stack direction="row" alignItems="center">
                            <Radio
                                value="cash"
                                checked={selectedPaymentMethod === 'cash'}
                                onChange={() => setSelectedPaymentMethod('cash')}
                            />
                            <Typography>Cash on Delivery</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Radio
                                value="online"
                                checked={selectedPaymentMethod === 'online'}
                                onChange={() => setSelectedPaymentMethod('online')}
                            />
                            <Typography>Online Payment</Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
            </Stack>

            {/* Right Section */}
            <Stack width={is900 ? '100%' : '50%'} alignItems="flex-start">
                <Typography variant="h4" fontWeight={600} color={theme.palette.primary.main}>
                    Order Summary
                </Typography>
                <Cart checkout={true} />

                {/* Pay and Order Button */}
                <LoadingButton
                    fullWidth
                    loading={orderStatus === 'pending'}
                    variant="contained"
                    onClick={handlePayment}
                    size="large"
                    disabled={Math.ceil(orderTotal + SHIPPING + TAXES) < 499}
                    sx={{
                        borderRadius: '8px',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    Pay and Order
                </LoadingButton>

                {/* Minimum Order Error */}
                {Math.ceil(orderTotal + SHIPPING + TAXES) < 499 && (
                    <Typography color="error" variant="body2" mt={2} align="center">
                        Minimum order value should exceed ₹499.
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};
