import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductBanner = ({ images }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's mobile view

  return (
    <>
      <AutoPlaySwipeableViews
        style={{ overflow: 'hidden', height: 'auto' }} // Ensure height auto for responsiveness
        width={'100%'}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((image, index) => (
          <div key={index} style={{ width: '100%', height: 'auto' }}> {/* Ensuring the container is not fixed */}
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: 'auto',  // Ensure the image height is auto to prevent overflow
                  objectFit: 'contain',
                  display: 'block',
                }}
                src={image}
                alt={'Banner Image'}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: isMobile ? theme.spacing(1) : 0 }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            backgroundColor: 'transparent',
            width: '70%',  // Make the stepper fit better on mobile by using percentage width
            maxWidth: '360px',  // Max width to ensure it's not too large
            padding: theme.spacing(0),
            '& .MuiMobileStepper-dot': {
              display: 'none', // Hide the dots
            },
          }}
        />
      </div>
    </>
  );
};
