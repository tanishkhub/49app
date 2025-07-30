import { Button, IconButton, LinearProgress, Rating, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReviewAsync, resetReviewAddStatus, resetReviewDeleteStatus, resetReviewUpdateStatus, selectReviewAddStatus, selectReviewDeleteStatus, selectReviewStatus, selectReviewUpdateStatus, selectReviews } from '../ReviewSlice'
import { ReviewItem } from './ReviewItem'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { toast } from 'react-toastify'
import CreateIcon from '@mui/icons-material/Create'
import { MotionConfig, motion } from 'framer-motion'
import { useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export const Reviews = ({ productId, averageRating }) => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const [value, setValue] = useState(1)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const loggedInUser = useSelector(selectLoggedInUser)
  const reviewStatus = useSelector(selectReviewStatus)

  const reviewAddStatus = useSelector(selectReviewAddStatus)
  const reviewDeleteStatus = useSelector(selectReviewDeleteStatus)
  const reviewUpdateStatus = useSelector(selectReviewUpdateStatus)

  const [writeReview, setWriteReview] = useState(false)
  const theme = useTheme()

  const is840 = useMediaQuery(theme.breakpoints.down(840))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    if (reviewAddStatus === 'fulfilled') {
      toast.success("Review added")
    } else if (reviewAddStatus === 'rejected') {
      toast.error("Error posting review, please try again later")
    }
    reset()
    setValue(1)
  }, [reviewAddStatus])

  useEffect(() => {
    if (reviewDeleteStatus === 'fulfilled') {
      toast.success("Review deleted")
    } else if (reviewDeleteStatus === 'rejected') {
      toast.error("Error deleting review, please try again later")
    }
  }, [reviewDeleteStatus])

  useEffect(() => {
    if (reviewUpdateStatus === 'fulfilled') {
      toast.success("Review updated")
    } else if (reviewUpdateStatus === 'rejected') {
      toast.error("Error updating review, please try again later")
    }
  }, [reviewUpdateStatus])

  useEffect(() => {
    return () => {
      dispatch(resetReviewAddStatus())
      dispatch(resetReviewDeleteStatus())
      dispatch(resetReviewUpdateStatus())
    }
  }, [])

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  }

  reviews.map((review) => {
    ratingCounts[review.rating] = ratingCounts[review.rating] + 1
  })

  const handleAddReview = (data) => {
    const review = { ...data, rating: value, user: loggedInUser._id, product: productId }
    dispatch(createReviewAsync(review))
    setWriteReview(false)
  }

  return (
    <Stack spacing={5} alignSelf={"flex-start"} width={is480 ? "90vw" : is840 ? "25rem" : '40rem'}>

      {/* Header Section */}
      <Stack>
        <Typography gutterBottom variant="h4" fontWeight={500} color="text.primary">Customer Reviews</Typography>
        {
          reviews?.length ? (
            <Stack spacing={3}>
              {/* Rating Section */}
              <Stack spacing={1}>
                <Typography variant="h3" fontWeight={700}>{averageRating.toFixed(1)}</Typography>
                <Rating readOnly value={averageRating} />
                <Typography variant="body2" color="text.secondary">Based on {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</Typography>
              </Stack>

              {/* Rating Distribution */}
              <Stack spacing={2}>
                {
                  [5, 4, 3, 2, 1].map((number) => (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>{number} star</Typography>
                      <LinearProgress sx={{ width: "100%", height: "1rem", borderRadius: "8px", backgroundColor: "#f0f0f0" }} variant="determinate" value={(ratingCounts[number] / reviews?.length) * 100} />
                      <Typography variant="body2">{Math.round(ratingCounts[number] / reviews?.length * 100)}%</Typography>
                    </Stack>
                  ))
                }
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary" fontWeight={400}>{loggedInUser?.isAdmin ? "There are no reviews currently" : "Be the first to post a review"}</Typography>
          )
        }
      </Stack>

      {/* Reviews Section */}
      <Stack spacing={2}>
        {reviews?.map((review) => (
          <ReviewItem key={review._id} id={review._id} userid={review.user._id} comment={review.comment} createdAt={review.createdAt} rating={review.rating} username={review.user.name} />
        ))}
      </Stack>

      {/* Add Review Form */}
      {writeReview ? (
        <Stack spacing={3} position="relative" component="form" noValidate onSubmit={handleSubmit(handleAddReview)}>
          <TextField
            id="reviewTextField"
            {...register("comment", { required: true })}
            sx={{ mt: 3, width: is840 ? "100%" : "40rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            multiline
            rows={6}
            fullWidth
            placeholder="Write a review..."
            variant="outlined"
          />

          <Stack spacing={1}>
            <Typography variant="body2">How much did you like the product?</Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} style={{ width: "fit-content" }}>
              <Rating size="large" value={value} onChange={(e) => setValue(e.target.value)} />
            </motion.div>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>
              <motion.div>
                <LoadingButton
                  sx={{ textTransform: "none", fontSize: is480 ? "0.875rem" : "1rem" }}
                  size={is480 ? "small" : "large"}
                  loading={reviewStatus === 'pending'}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Add Review
                </LoadingButton>
              </motion.div>
              <motion.div>
                <Button onClick={() => setWriteReview(false)} color="error" size={is480 ? "small" : "large"} variant="outlined" sx={{ textTransform: "none", fontSize: is480 ? "0.875rem" : "1rem" }}>
                  Cancel
                </Button>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      ) : !loggedInUser?.isAdmin && (
        <motion.div onClick={() => setWriteReview(!writeReview)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} style={{ width: "fit-content" }}>
          <Button
            disableElevation
            size={is480 ? "medium" : "large"}
            variant="contained"
            sx={{ color: theme.palette.primary.light, textTransform: "none", fontSize: "1rem", borderRadius: '8px' }}
            startIcon={<CreateIcon />}
          >
            Write a review
          </Button>
        </motion.div>
      )}
    </Stack>
  )
}
