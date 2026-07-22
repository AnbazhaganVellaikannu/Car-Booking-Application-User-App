import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RideProvider } from './context/RideContext.jsx';
import { SignupProvider } from './context/SignupContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import Splash from './pages/onboarding/Splash.jsx';
import Onboarding from './pages/onboarding/Onboarding.jsx';
import EnableLocation from './pages/onboarding/EnableLocation.jsx';
import Welcome from './pages/onboarding/Welcome.jsx';

import SignUp from './pages/auth/SignUp.jsx';
import VerifyOtp from './pages/auth/VerifyOtp.jsx';
import CompleteProfile from './pages/auth/CompleteProfile.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ForgotPasswordOtp from './pages/auth/ForgotPasswordOtp.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

import Home from './pages/home/Home.jsx';
import Notifications from './pages/home/Notifications.jsx';

import LocationSearch from './pages/location/LocationSearch.jsx';
import LocationConfirm from './pages/location/LocationConfirm.jsx';

import SelectVehicle from './pages/ride/SelectVehicle.jsx';
import Searching from './pages/ride/Searching.jsx';
import RideTracking from './pages/ride/RideTracking.jsx';
import Payment from './pages/ride/Payment.jsx';
import RateDriver from './pages/ride/RateDriver.jsx';
import Receipt from './pages/ride/Receipt.jsx';

import RideHistory from './pages/history/RideHistory.jsx';

import Profile from './pages/profile/Profile.jsx';
import Favorites from './pages/profile/Favorites.jsx';
import AddFavorite from './pages/profile/AddFavorite.jsx';
import Settings from './pages/profile/Settings.jsx';
import ChangePassword from './pages/profile/ChangePassword.jsx';
import DeleteAccount from './pages/profile/DeleteAccount.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <SignupProvider>
        <RideProvider>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/enable-location" element={<EnableLocation />} />
            <Route path="/welcome" element={<Welcome />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/verify" element={<VerifyOtp />} />
            <Route path="/signup/profile" element={<CompleteProfile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/verify" element={<ForgotPasswordOtp />} />
            <Route path="/forgot-password/reset" element={<ResetPassword />} />

            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            <Route path="/location/search/:field" element={<PrivateRoute><LocationSearch /></PrivateRoute>} />
            <Route path="/location/confirm" element={<PrivateRoute><LocationConfirm /></PrivateRoute>} />

            <Route path="/ride/select-vehicle" element={<PrivateRoute><SelectVehicle /></PrivateRoute>} />
            <Route path="/ride/searching" element={<PrivateRoute><Searching /></PrivateRoute>} />
            <Route path="/ride/:id/tracking" element={<PrivateRoute><RideTracking /></PrivateRoute>} />
            <Route path="/ride/:id/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/ride/:id/rate" element={<PrivateRoute><RateDriver /></PrivateRoute>} />
            <Route path="/ride/:id/receipt" element={<PrivateRoute><Receipt /></PrivateRoute>} />

            <Route path="/history" element={<PrivateRoute><RideHistory /></PrivateRoute>} />

            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/profile/favorites/add" element={<PrivateRoute><AddFavorite /></PrivateRoute>} />
            <Route path="/profile/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/profile/settings/password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            <Route path="/profile/settings/delete" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
          </Routes>
        </RideProvider>
      </SignupProvider>
    </div>
  );
}
