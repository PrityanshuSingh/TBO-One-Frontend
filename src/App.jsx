import React, { Suspense, lazy } from 'react';
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import Sidebar from './layouts/SideBar/SideBar';
import ProtectedRoute from './authentication/ProtectedRoute';
import styles from './App.module.scss';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
const Packages = lazy(() => import('./pages/Packages/Packages'));
const PackageDetails = lazy(() => import('./pages/Packages/PackageDetails'));
const SavedPackages = lazy(() => import('./pages/Packages/SavedPackages'));
const WhatsAppCampaign = lazy(() => import('./pages/Campaign/WhatsAppCampaign'));
const Campaigns = lazy(() => import('./pages/Campaign/Campaigns'));
const ErrorPage = lazy(() => import('./pages/Error/Error')); // Import your error page

function App() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  return (
    <div className={styles.appContainer}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/packages/details/" element={<PackageDetails />} />

          {/* Redirect based on query parameters */}
          <Route
            path="/packages/details"
            element={
              id && email ? (
                <Navigate to={`/packages/details/${id}?email=${email}`} replace />
              ) : (
                <ErrorPage />
              )
            }
          />

          {/* Protected Routes with Sidebar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className={styles.mainContent}>
                  <Routes>
                    <Route path="/" element={<Packages />} />
                    <Route path="/u/packages" element={<Packages />} />
                    <Route path="/u/packages/details/:id" element={<PackageDetails />} />
                    <Route path="/u/packages/saved" element={<SavedPackages />} />
                    <Route path="/u/packages/campaign/:id" element={[<Packages />, <WhatsAppCampaign />]} />

                    <Route path="/u/campaigns" element={<Campaigns />} />
                    <Route path="/u/campaigns/edit/:id" element={<WhatsAppCampaign />} />

                    {/* Catch-all route for 404 errors */}
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for unprotected routes (e.g., /unknown-route) */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;