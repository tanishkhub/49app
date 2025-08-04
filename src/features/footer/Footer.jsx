import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from '@mui/icons-material';
import VisitorCounter from './VisitorCounter';
import { MotionConfig, motion } from 'framer-motion';

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit'
};

export const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const labelStyles = {
    fontWeight: 300,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      color: theme.palette.secondary.main
    }
  };

  const sectionHeading = {
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'uppercase',
    marginBottom: '0.5rem'
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '2.5rem 1rem',
        width: '100%',
        overflow: 'hidden',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        rowGap="2rem"
        sx={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Brand / About */}
        <Stack spacing={1} maxWidth="260px">
          <Typography variant="h6" sx={sectionHeading}>
            49Stores
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 300 }}>
            Affordable daily essentials & trendy picks — all at ₹49.
          </Typography>
        </Stack>

        {/* Support */}
        <Stack spacing={0.7}>
          <Typography sx={sectionHeading}>Support</Typography>
          <Typography sx={labelStyles}>102, Blue Heavens, Plot No 57, Sec 21,</Typography>
          <Typography sx={labelStyles}>Ulwe, Maharashtra 410206</Typography>
          
          <Typography sx={labelStyles}>mail.49stores@gmail.com</Typography>
          <Typography sx={labelStyles}>+91 99208 74166</Typography>
        </Stack>

        {/* Account */}
        <Stack spacing={0.7}>
          <Typography sx={sectionHeading}>Account</Typography>
          <Link to="/profile" style={linkStyle}><Typography sx={labelStyles}>My Account</Typography></Link>
          <Link to="/login" style={linkStyle}><Typography sx={labelStyles}>Login / Register</Typography></Link>
          <Link to="/cart" style={linkStyle}><Typography sx={labelStyles}>Cart</Typography></Link>
          <Link to="https://merchant.razorpay.com/policy/PmOj9NwR8Ux31u/terms" style={linkStyle}><Typography sx={labelStyles}>Terms</Typography></Link>
          <Link to="/wishlist" style={linkStyle}><Typography sx={labelStyles}>Wishlist</Typography></Link>
          <Link to="/" style={linkStyle}><Typography sx={labelStyles}>Shop</Typography></Link>
        {/* WhatsApp Career Link */}
  <a
    href="https://wa.me/919920874166?text=Hi%2C%20I%20am%20interested%20to%20work%20at%2049stores"
    target="_blank"
    rel="noopener noreferrer"
    style={linkStyle}
  >
    <Typography sx={labelStyles}>Careers</Typography>
  </a>
</Stack>

        {/* Social & Visitors */}
        <Stack spacing={1} alignItems={isMobile ? 'flex-start' : 'center'}>
          <Typography sx={sectionHeading}>Connect</Typography>
          <Stack direction="row" spacing={1}>
            <MotionConfig transition={{ type: "spring", stiffness: 300 }}>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61578414568298"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: theme.palette.primary.contrastText }}
                >
                  <Facebook />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  component="a"
                  href="https://www.instagram.com/49storesindia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: theme.palette.primary.contrastText }}
                >
                  <Instagram />
                </IconButton>
              </motion.div>
            </MotionConfig>
          </Stack>
          <VisitorCounter />
        </Stack>
      </Stack>

      <Divider
        sx={{
          marginTop: '2rem',
          borderColor: theme.palette.primary.light,
          opacity: 0.3
        }}
      />

      <Typography
        align="center"
        variant="caption"
        sx={{ color: theme.palette.grey[400], marginTop: '1rem' }}
      >
        &copy; {new Date().getFullYear()} 49Stores. All rights reserved.
      </Typography>
    </Box>
  );
};
