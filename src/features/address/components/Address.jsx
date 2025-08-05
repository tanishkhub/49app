import { LoadingButton } from '@mui/lab'
import { Button, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'

import React, { useState, useEffect } from 'react';

import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { deleteAddressByIdAsync, selectAddressErrors, selectAddressStatus, updateAddressByIdAsync } from '../AddressSlice'
import axios from 'axios';
import { MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';

export const Address = ({id,type,street,postalCode,country,phoneNumber,state,city}) => {

    const theme=useTheme()
    const dispatch=useDispatch()
    const {register,handleSubmit,watch,reset,formState: { errors }} = useForm()
    const [edit,setEdit]=useState(false)
    const [open, setOpen] = useState(false);
    const status=useSelector(selectAddressStatus)
    const error=useSelector(selectAddressErrors)
    

    const [locations, setLocations] = useState([]);
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);
const [postalCodes, setPostalCodes] = useState([]);

const [selectedState, setSelectedState] = useState(state || '');
const [selectedCity, setSelectedCity] = useState(city || '');
const [postalCodeValue, setPostalCodeValue] = useState(postalCode || '');

useEffect(() => {
  axios.get(`${process.env.REACT_APP_BASE_URL}/api/locations`)
    .then((res) => {
      const rawData = res.data;
      const transformed = [];

      Object.entries(rawData).forEach(([state, cities]) => {
        Object.entries(cities).forEach(([city, postalCodes]) => {
          transformed.push({
            state,
            city,
            postalCodes: postalCodes.filter(p => p && p.trim() !== "")
          });
        });
      });

      setLocations(transformed);
      setStates([...new Set(transformed.map(item => item.state))]);

      if (state) {
        const filteredCities = transformed.filter(loc => loc.state === state);
        setCities(filteredCities);
      }

      if (city) {
        const matched = transformed.find(loc => loc.state === state && loc.city === city);
        if (matched) {
          setPostalCodes(matched.postalCodes);
        }
      }

    })
    .catch((err) => console.error("Error loading locations:", err));
}, []);


    const is480=useMediaQuery(theme.breakpoints.down(480))

    const handleRemoveAddress=()=>{
        dispatch(deleteAddressByIdAsync(id))
    }

    const handleUpdateAddress=(data)=>{
        const update={...data,_id:id}
        setEdit(false)
        dispatch(updateAddressByIdAsync(update))
    }

const handleStateChange = (e) => {
  const selected = e.target.value;
  setSelectedState(selected);
  setSelectedCity('');
  setPostalCodeValue('');
  const filtered = locations.filter(loc => loc.state === selected);
  setCities(filtered);
};

const handleCityChange = (e) => {
  const selected = e.target.value;
  setSelectedCity(selected);
  const matched = locations.find(loc => loc.state === selectedState && loc.city === selected);
  if (matched) {
    setPostalCodes(matched.postalCodes);
  } else {
    setPostalCodes([]);
  }
};

const handlePostalCodeChange = (e) => {
  const code = e.target.value;
  setPostalCodeValue(code);
};

  return (
    <Stack width={'100%'} p={is480?0:1}>
                                        
        {/* address type */}
        <Stack color={'whitesmoke'} p={'.5rem'} borderRadius={'.2rem'} bgcolor={theme.palette.primary.main}>
            <Typography>{type?.toUpperCase()}</Typography>
        </Stack>

        {/* address details */}
        <Stack p={2} position={'relative'} flexDirection={'column'} rowGap={1} component={'form'} noValidate onSubmit={handleSubmit(handleUpdateAddress)}>

            {/* if the edit is true then this update from shows*/}
            {
                edit?
                (   
                    // update address form
                    <Stack rowGap={2}>
                        
                        <Stack>
                            <Typography gutterBottom>Type</Typography>
                            <TextField {...register("type",{required:true,value:type})}/>
                        </Stack>


                        <Stack>
                            <Typography gutterBottom>Street</Typography>
                            <TextField {...register("street",{required:true,value:street})}/>
                        </Stack>


                        <Stack>
                            <Typography gutterBottom>Country</Typography>
                            <TextField {...register("country",{required:true,value:country})}/>
                        </Stack>

                        <Stack>
                            <Typography  gutterBottom>Phone Number</Typography>
                            <TextField type='number' {...register("phoneNumber",{required:true,value:phoneNumber})}/>
                        </Stack>

                       <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography gutterBottom>State</Typography>
    <TextField
      select
      fullWidth
      value={selectedState}
      onChange={handleStateChange}
      {...register("state", { required: true })}
    >
      {states.map((state, i) => (
        <MenuItem key={i} value={state}>{state}</MenuItem>
      ))}
    </TextField>
  </Grid>

  <Grid item xs={12}>
    <Typography gutterBottom>City</Typography>
    <TextField
      select
      fullWidth
      value={selectedCity}
      onChange={handleCityChange}
      disabled={!selectedState}
      {...register("city", { required: true })}
    >
      {cities.map((loc, i) => (
        <MenuItem key={i} value={loc.city}>{loc.city}</MenuItem>
      ))}
    </TextField>
  </Grid>

  <Grid item xs={12}>
    <Typography gutterBottom>Postal Code</Typography>
    <FormControl fullWidth disabled={!selectedCity}>
      <InputLabel>Postal Code</InputLabel>
      <Select
        value={postalCodeValue}
        onChange={handlePostalCodeChange}
      >
        {postalCodes.map((code, index) => (
          <MenuItem key={index} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <input type="hidden" {...register("postalCode", { required: true })} value={postalCodeValue} />
  </Grid>
</Grid>

                    </Stack>
                ):(
                <>
                <Typography>Street - {street}</Typography>
                <Typography>Postal Code- {postalCode}</Typography>
                <Typography>Country - {country}</Typography>
                <Typography>Phone Number - {phoneNumber}</Typography>
                <Typography>State - {state}</Typography>
                <Typography>City - {city}</Typography>
                </>
                )
            }

            {/* action buttons */}
            <Stack position={is480?"static":edit?"static":'absolute'} bottom={4} right={4} mt={is480?2:4} flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>

                {/* if edit is true, then save changes button is shown instead of edit*/}
                {
                    edit?(<LoadingButton loading={status==='pending'} size='small' type='submit' variant='contained'>Save Changes</LoadingButton>
                    ):(<Button size='small' onClick={()=>setEdit(true)} variant='contained'>Edit</Button>)
                }

                {/* if edit is true then cancel button is shown instead of remove */}
                {
                    edit?(
                        <Button size='small' onClick={()=>{setEdit(false);reset()}} variant='outlined' color='error'>Cancel</Button>
                    ):(
                        <LoadingButton loading={status==='pending'} size='small' onClick={handleRemoveAddress} variant='outlined' color='error' >Remove</LoadingButton>
                    )
                }
            </Stack>
        </Stack>

    </Stack>
  )
}
