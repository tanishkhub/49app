import { Button, IconButton, Menu, MenuItem, Paper, Rating, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { deleteReviewByIdAsync, selectReviewStatus, updateReviewByIdAsync } from '../ReviewSlice';
import { useForm } from "react-hook-form";
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';

export const ReviewItem = ({ id, username, userid, comment, rating, createdAt }) => {

  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [edit, setEdit] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteReview = () => {
    dispatch(deleteReviewByIdAsync(id));
    handleClose();
  };

  const handleUpdateReview = (data) => {
    const update = { ...data, _id: id, rating: editRating };
    dispatch(updateReviewByIdAsync(update));
    setEdit(false);
  };

  const isOwnReview = userid === loggedInUser?._id;

  return (
    <Stack
      position={'relative'}
      p={3}
      rowGap={3}
      width={'100%'}
      component={Paper}
      borderRadius={2}
      boxShadow={3}
      sx={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        },
      }}
    >

      {/* Header: User, Rating, Created At */}
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack flexDirection={'row'} columnGap={2}>
          <Stack>
            <Typography variant='h6' fontSize={'1.2rem'} fontWeight={600} color="primary.main">{username}</Typography>
            <motion.div>
              <Rating
                size={edit ? (is480 ? 'medium' : 'large') : "small"}
                readOnly={!edit}
                onChange={(e) => setEditRating(e.target.value)}
                value={edit ? editRating : rating}
                sx={{
                  transition: 'transform 0.2s ease',
                  '& .MuiRating-icon': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </motion.div>
          </Stack>
        </Stack>

        {/* Edit/Delete Menu */}
        {isOwnReview && (
          <Stack sx={{ position: 'absolute', top: 0, right: 0 }}>
            <IconButton aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
              <MoreVertIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => { setEdit(true); handleClose() }}>Edit</MenuItem>
              <MenuItem onClick={deleteReview}>Delete</MenuItem>
            </Menu>
          </Stack>
        )}

        <Typography
          alignSelf={"flex-end"}
          color={'text.secondary'}
          fontWeight={400}
          fontSize={'.9rem'}
        >
          {new Date(createdAt).toDateString()}
        </Typography>
      </Stack>

      {/* Review Comment */}
      <Stack>
        {edit ? (
          <Stack component={'form'} noValidate onSubmit={handleSubmit(handleUpdateReview)} rowGap={2}>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              {...register("comment", { required: true, value: comment })}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: 2,
                  },
                },
              }}
            />
            <Stack flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'} columnGap={1}>
              <LoadingButton size="small" type="submit" variant="contained" color="primary" sx={{ alignSelf: "flex-end" }}>
                Update
              </LoadingButton>
              <Button variant="outlined" size="small" onClick={() => setEdit(false)} color="error">
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Typography color={'text.secondary'}>{comment}</Typography>
        )}
      </Stack>

    </Stack>
  );
}
