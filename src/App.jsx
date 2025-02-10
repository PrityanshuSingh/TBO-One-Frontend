import React, { Suspense, lazy } from 'react';
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import Sidebar from './layouts/SideBar/SideBar';
import ProtectedRoute from './authentication/ProtectedRoute';
import styles from './App.module.scss';
import Load from './microInteraction/Load/Load';

// Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/SignUp'));

const CreatePackage = lazy(() => import('./pages/Packages/CreatePackage'));

const Packages = lazy(() => import('./pages/Packages/Packages'));
const PackageDetails = lazy(() => import('./pages/Packages/PackageDetails'));
const SavedPackages = lazy(() => import('./pages/Packages/SavedPackages'));
const PeronalizedPackages = lazy(() => import('./pages/Packages/PersonalizedPackages'));

const WhatsAppCampaign = lazy(() => import('./pages/Campaign/WhatsAppCampaign'));
const InstagramCampaign = lazy(() => import('./components/Modals/InstagramModal'));
const EmailCampaign = lazy(() => import('./components/Modals/EmailModal'));

const EditCampign = lazy(() => import('./pages/Campaign/EditCampaign'));
const Campaigns = lazy(() => import('./pages/Campaign/Campaigns'));

const Customers = lazy(() => import('./pages/Customer/Customers'));

const SocialMedia = lazy(() => import('./pages/SocialMedia/SocialMedia'));

const ErrorPage = lazy(() => import('./pages/Error/Error'));

function App() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  return (
    <div className={styles.appContainer}>
      <Suspense fallback={<Load />}>
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

                    <Route path="/u/create" element={<CreatePackage />} />

                    <Route path="/u/packages" element={<Packages />} />
                    <Route path="/u/packages/saved" element={<SavedPackages />} />
                    <Route path="/u/packages/personalized" element={<PeronalizedPackages />} />

                    <Route path="/u/packages/details/:id" element={<PackageDetails />} />

                    <Route path="/u/packages/whatsAppCampaign/:id" element={[<Packages />, <WhatsAppCampaign />]} />
                    <Route path="/u/packages/instagramCampaign/:id" element={[<Packages />, <InstagramCampaign />]} />
                    <Route path="/u/packages/emailCampaign/:id" element={[<Packages />, <EmailCampaign />]} />

                    <Route path="/u/packages/edit/:id" element={<PackageDetails />} />

                    <Route path="/u/campaigns" element={<Campaigns />} />
                    <Route path="/u/campaigns/edit/:id" element={[<Campaigns />,<WhatsAppCampaign />]} />

                    <Route path="/u/customers" element={<Customers />} />
                    <Route path="/u/customers/:id" element={<Customers />} />

                    <Route path="/u/socials" element={<SocialMedia />} />
                    <Route path="/u/socials/:id" element={<SocialMedia />} />

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