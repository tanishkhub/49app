import { Avatar, Button, Paper, Stack, Typography, useTheme, TextField, useMediaQuery, Card, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '../UserSlice'
import { addAddressAsync, resetAddressAddStatus, resetAddressDeleteStatus, resetAddressUpdateStatus, selectAddressAddStatus, selectAddressDeleteStatus, selectAddressErrors, selectAddressStatus, selectAddressUpdateStatus, selectAddresses } from '../../address/AddressSlice'
import { Address } from '../../address/components/Address'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import profilepic from "../../../assets/images/profilepic.gif";


export const UserProfile = () => {

  const dispatch = useDispatch()
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const status = useSelector(selectAddressStatus)
  const userInfo = useSelector(selectUserInfo)
  const addresses = useSelector(selectAddresses)
  const theme = useTheme()
  const [addAddress, setAddAddress] = useState(false)

  const addressAddStatus = useSelector(selectAddressAddStatus)
  const addressUpdateStatus = useSelector(selectAddressUpdateStatus)
  const addressDeleteStatus = useSelector(selectAddressDeleteStatus)

  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    })
  }, [])

  useEffect(() => {
    if (addressAddStatus === 'fulfilled') {
      toast.success("Address added")
    } else if (addressAddStatus === 'rejected') {
      toast.error("Error adding address, please try again later")
    }
  }, [addressAddStatus])

  useEffect(() => {
    if (addressUpdateStatus === 'fulfilled') {
      toast.success("Address updated")
    } else if (addressUpdateStatus === 'rejected') {
      toast.error("Error updating address, please try again later")
    }
  }, [addressUpdateStatus])

  useEffect(() => {
    if (addressDeleteStatus === 'fulfilled') {
      toast.success("Address deleted")
    } else if (addressDeleteStatus === 'rejected') {
      toast.error("Error deleting address, please try again later")
    }
  }, [addressDeleteStatus])

  useEffect(() => {
    return () => {
      dispatch(resetAddressAddStatus())
      dispatch(resetAddressUpdateStatus())
      dispatch(resetAddressDeleteStatus())
    }
  }, [])

  const handleAddAddress = (data) => {
    const address = { ...data, user: userInfo._id }
    dispatch(addAddressAsync(address))
    setAddAddress(false)
    reset()
  }

  return (
    <Stack height={'calc(100vh - 4rem)'} justifyContent={'flex-start'} alignItems={'center'}>

      <Stack component={is480 ? '' : Paper} elevation={4} width={is900 ? '100%' : "50rem"} p={3} mt={is480 ? 0 : 5} rowGap={4} borderRadius="1rem" boxShadow={3}>

        {/* User Details */}
        <Stack bgcolor={theme.palette.primary.light} color={theme.palette.primary.main} p={3} rowGap={1} borderRadius={'1rem'} justifyContent={'center'} alignItems={'center'} boxShadow={2}>
        <Avatar 
  src={profilepic}  // Use the imported profilepic here
  alt={userInfo?.name} 
  sx={{ width: 90, height: 90 }} 
/>

          <Typography variant="h5" fontWeight={700}>{userInfo?.name}</Typography>
          <Typography variant="body2" color="textSecondary">{userInfo?.email}</Typography>
        </Stack>

        {/* Address Section */}
        <Stack justifyContent={'center'} alignItems={'center'} rowGap={4}>

          {/* Heading and Add Button */}
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} width="100%">
            <Typography variant='h6' fontWeight={600} color={theme.palette.secondary.dark}>Manage Addresses</Typography>
            <Button onClick={() => setAddAddress(true)} size={is480 ? 'small' : ""} variant='contained' color="secondary">Add Address</Button>
          </Stack>

          {/* Add Address Form */}
          {
            addAddress && (
              <Stack width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleAddAddress)} rowGap={3} borderRadius="0.8rem" boxShadow={2} p={3}>
                <TextField label="Address Type" variant="outlined" fullWidth {...register("type", { required: true })} error={!!errors.type} helperText={errors.type && 'Address type is required'} />
                <TextField label="Street" variant="outlined" fullWidth {...register("street", { required: true })} error={!!errors.street} helperText={errors.street && 'Street is required'} />
                <TextField label="Postal Code" type="number" variant="outlined" fullWidth {...register("postalCode", { required: true })} error={!!errors.postalCode} helperText={errors.postalCode && 'Postal code is required'} />
                <TextField label="Country" variant="outlined" fullWidth {...register("country", { required: true })} error={!!errors.country} helperText={errors.country && 'Country is required'} />
                <TextField label="Phone Number" type="number" variant="outlined" fullWidth {...register("phoneNumber", { required: true })} error={!!errors.phoneNumber} helperText={errors.phoneNumber && 'Phone number is required'} />
                <TextField label="State" variant="outlined" fullWidth {...register("state", { required: true })} error={!!errors.state} helperText={errors.state && 'State is required'} />
                <TextField label="City" variant="outlined" fullWidth {...register("city", { required: true })} error={!!errors.city} helperText={errors.city && 'City is required'} />

                <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={2}>
                  <LoadingButton loading={status === 'pending'} type='submit' variant='contained' color='primary'>Add Address</LoadingButton>
                  <Button color='error' onClick={() => setAddAddress(false)} variant='outlined' size={is480 ? "small" : ""}>Cancel</Button>
                </Stack>
              </Stack>
            )
          }

          {/* List of Addresses */}
          <Stack width={'100%'} rowGap={3}>
            {
              addresses.length > 0 ? (
                addresses.map((address) => (
                  <Card key={address._id} sx={{ borderRadius: '1rem', boxShadow: 3, padding: 2 }}>
                    <CardContent>
                      <Address key={address._id} id={address._id} city={address.city} country={address.country} phoneNumber={address.phoneNumber} postalCode={address.postalCode} state={address.state} street={address.street} type={address.type} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography textAlign={'center'} variant='body2' color="textSecondary" mt={2}>You have no added addresses</Typography>
              )
            }
          </Stack>

        </Stack>

      </Stack>

    </Stack>
  )
}
