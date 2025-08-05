import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import { logosvg } from '../../../assets';
import profilepic from "../../../assets/images/profilepic.gif";

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const settings = [
    { name: 'Home', to: '/' },
  ];

  if (loggedInUser) {
    settings.push(
      {
        name: 'Profile',
        to: loggedInUser.isAdmin ? '/admin/profile' : '/profile',
      },
      {
        name: loggedInUser.isAdmin ? 'Orders' : 'My orders',
        to: loggedInUser.isAdmin ? '/admin/orders' : '/orders',
      },
      {
        name: 'Logout',
        to: '/logout',
      }
    );
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        color: 'text.primary',
        zIndex: theme.zIndex.drawer + 1,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar
        sx={{
          p: 1,
          height: '4.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            columnGap: '0.5rem',
            transition: 'transform 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src={logosvg}
            alt="49 STORES LOGO"
            style={{
              height: '4rem',
              width: '4rem',
              borderRadius: '50%',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              animation: 'flip 5s infinite, shine 1s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes flip {
              0% { transform: rotateY(0deg); }
              50% { transform: rotateY(180deg); }
              100% { transform: rotateY(360deg); }
            }
            @keyframes shine {
              0%, 100% { background: rgba(255, 255, 255, 0); }
              50% { background: rgba(255, 255, 255, 0.3); }
            }
          `}</style>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'black',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            49 Stores
          </Typography>
        </Link>

        {/* Right Section */}
        <Stack flexDirection="row" alignItems="center" columnGap={2}>
          {/* Profile Menu */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={profilepic} alt={userInfo?.name} sx={{ width: 70, height: 70 }} />
            </IconButton>
          </Tooltip>

          {loggedInUser && (
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {loggedInUser.isAdmin && (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    color="text.primary"
                    sx={{ textDecoration: 'none', fontFamily: 'Poppins, sans-serif' }}
                    to="/admin/add-product"
                    textAlign="center"
                  >
                    Add new Product
                  </Typography>
                </MenuItem>
              )}
              {loggedInUser.isAdmin && (
  <MenuItem onClick={handleCloseUserMenu}>
    <Typography
      component={Link}
      color="text.primary"
      sx={{ textDecoration: 'none', fontFamily: 'Poppins, sans-serif' }}
      to="/location"
      textAlign="center"
    >
      Delivery Locations
    </Typography>
  </MenuItem>
)}

              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    color="text.primary"
                    sx={{ textDecoration: 'none', fontFamily: 'Poppins, sans-serif' }}
                    to={setting.to}
                    textAlign="center"
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          )}

          {/* Greeting */}
          <Typography
            variant="h6"
            fontWeight={300}
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontFamily: 'Poppins, sans-serif',
              '& .wave': {
                display: 'inline-block',
                transformOrigin: '70% 70%',
                animation: 'wave 2s ease-in-out infinite',
              },
              '@keyframes wave': {
                '0%': { transform: 'rotate(0deg)' },
                '10%': { transform: 'rotate(14deg)' },
                '20%': { transform: 'rotate(-8deg)' },
                '30%': { transform: 'rotate(14deg)' },
                '40%': { transform: 'rotate(-4deg)' },
                '50%': { transform: 'rotate(10deg)' },
                '60%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(0deg)' },
              },
            }}
          >
            {is480 ? (
              `${userInfo?.name?.split(' ')[0]}`
            ) : (
              <>
                Hey<span className="wave">👋</span>, {userInfo?.name}
              </>
            )}
          </Typography>

          {/* Admin Label */}
          {loggedInUser?.isAdmin && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s',
                '&:hover': { backgroundColor: 'primary.dark', transform: 'scale(1.05)' },
              }}
            >
              Admin
            </Button>
          )}

          {/* Cart / Wishlist / Filter */}
          <Stack flexDirection="row" columnGap={2} alignItems="center">
            {cartItems?.length > 0 && (
              <Badge badgeContent={cartItems.length} color="error">
                <IconButton onClick={() => navigate('/cart')}>
                  <ShoppingCartOutlinedIcon sx={{ color: 'black', '&:hover': { color: 'primary.main' } }} />
                </IconButton>
              </Badge>
            )}

            {!loggedInUser?.isAdmin && (
              <Badge badgeContent={wishlistItems?.length} color="error">
                <IconButton component={Link} to="/wishlist">
                  <FavoriteBorderIcon sx={{ color: 'black', '&:hover': { color: 'primary.main' } }} />
                </IconButton>
              </Badge>
            )}

            {isProductList && (
              <IconButton onClick={handleToggleFilters}>
                <TuneIcon
                  sx={{
                    color: isProductFilterOpen ? 'primary.main' : 'gray',
                    '&:hover': { color: 'primary.dark' },
                  }}
                />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
