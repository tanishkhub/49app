import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";

import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";

import {
  AddProductPage,
  AdminOrdersPage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage
} from './pages';

import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LocationManager } from './pages/LocationManager';

function App() {
  const isAuthChecked  = useSelector(selectIsAuthChecked);
  const loggedInUser   = useSelector(selectLoggedInUser);

  // kick off your auth/token validation only once on mount
  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ───────── PUBLIC ROUTES ───────── */}
        <Route path='/'                     element={<HomePage/>} />
        <Route path='/signup'               element={<SignupPage/>} />
        <Route path='/login'                element={<LoginPage/>} />
        <Route path='/verify-otp'           element={<OtpVerificationPage/>} />
        <Route path='/forgot-password'      element={<ForgotPasswordPage/>} />
        <Route path='/reset-password/:userId/:passwordResetToken'
                                            element={<ResetPasswordPage/>} />

        {/* ───────── SHARED PROTECTED ROUTES ───────── */}
        <Route path='/logout'               element={<Protected><Logout/></Protected>} />
        <Route path='/product-details/:id'  element={<Protected><ProductDetailsPage/></Protected>} />

        {/* ───────── ROLE‑BASED ROUTES ───────── */}
        {loggedInUser?.isAdmin ? (
          // ─── ADMIN ONLY ───
          <>
            <Route path='/admin/dashboard'        element={<Protected><AdminDashboardPage/></Protected>} />
            <Route path='/admin/add-product'      element={<Protected><AddProductPage/></Protected>} />
            <Route path='/location'              element={<Protected><LocationManager/></Protected>}/>
            <Route path='/admin/product-update/:id'
                                                   element={<Protected><ProductUpdatePage/></Protected>} />
            <Route path='/admin/orders'           element={<Protected><AdminOrdersPage/></Protected>} />
            {/* catch‑all redirects back to admin dashboard */}
            <Route path='*'                       element={<Navigate to='/admin/dashboard' />} />
          </>
        ) : (
          // ─── NORMAL USER ───
          <>
            <Route path='/cart'                  element={<Protected><CartPage/></Protected>} />
            <Route path='/profile'               element={<Protected><UserProfilePage/></Protected>} />
            <Route path='/checkout'              element={<Protected><CheckoutPage/></Protected>} />
            <Route path='/order-success/:id'     element={<Protected><OrderSuccessPage/></Protected>} />
            <Route path='/orders'                element={<Protected><UserOrdersPage/></Protected>} />
            <Route path='/wishlist'              element={<Protected><WishlistPage/></Protected>} />
            {/* fallback to public 404 */}
            <Route path='*'                      element={<NotFoundPage/>} />
            
          </>
        )}
      </>
    )
  );

  // Always render router so public HomePage shows instantly.
  // Protected() component itself will wait on `isAuthChecked` before allowing child renders.
  return <RouterProvider router={router} />;
}

export default App;
