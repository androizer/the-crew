import { Role } from '@the-crew/common/enums';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Footer } from '..';
import { OverlayLoading } from '../..';
import { useAppSelector } from '../../../store';
import { authSelector } from '../../../store/slices';
import { Home, NotFound404 } from '../../../views';

const AboutUs = React.lazy(() => import('../../../views/about-us/about-us'));
const Bookings = React.lazy(() => import('../../../views/bookings/bookings'));
const Dashboard = React.lazy(() => import('../../../views/dashboard/dashboard'));
const RegisterAsProfessional = React.lazy(
  () => import('../../../views/register-as-professional/register-as-professional'),
);
const SearchService = React.lazy(() => import('../../../views/service-search/search-service'));
const ServiceList = React.lazy(() => import('../../../views/service-list/service-list'));
const Login = React.lazy(() => import('../../../views/login/login'));

const Main: React.FC = () => {
  const { user: currentUser } = useAppSelector(authSelector);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            !currentUser || !currentUser.role.includes(Role.PROFESSIONAL) ? (
              <Home />
            ) : (
              <Navigate to={{ pathname: '/dashboard' }} />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<OverlayLoading open={true} />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register-as-professional"
          element={
            <Suspense fallback={<OverlayLoading open={true} />}>
              <RegisterAsProfessional />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<OverlayLoading open={true} />}>
              <SearchService />
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            currentUser?.role.includes(Role.PROFESSIONAL) ? (
              <Suspense fallback={<OverlayLoading open={true} />}>
                <ServiceList />
              </Suspense>
            ) : (
              <Navigate to={{ pathname: '/' }} />
            )
          }
        />
        <Route
          path="/bookings"
          element={
            currentUser ? (
              <Suspense fallback={<OverlayLoading open={true} />}>
                <Bookings />
              </Suspense>
            ) : (
              <Navigate to={{ pathname: '/' }} />
            )
          }
        />
        <Route
          path="/about-us"
          element={
            <Suspense fallback={<OverlayLoading open={true} />}>
              <AboutUs />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            currentUser?.role.includes(Role.PROFESSIONAL) ? (
              <Suspense fallback={<OverlayLoading open={true} />}>
                <Dashboard />
              </Suspense>
            ) : (
              <Navigate to={{ pathname: '/' }} />
            )
          }
        />
        <Route element={<NotFound404 />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Main;
