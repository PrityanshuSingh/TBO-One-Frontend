import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/SideBar/SideBar';
import ProtectedRoute from './authentication/ProtectedRoute';
import styles from './App.module.scss';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
const Packages = lazy(() => import('./pages/Packages/Packages'));
const SavedPackages = lazy(() => import('./pages/Packages/SavedPackages'));
const Campaigns = lazy(() => import('./pages/Campaign/Campaigns'));
const WhatsAppCampaign = lazy(() => import('./pages/Campaign/WhatsAppCampaign'));

function App() {
  return (
    <div className={styles.appContainer}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className={styles.mainContent}>
                  <Routes>
                    <Route path="packages" element={<Packages />} />
                    <Route path="/packages/saved" element={<SavedPackages />} />
                    <Route path="/packages/campaign/:id" element={[<Packages />, <WhatsAppCampaign />]} />
                    <Route path="/campaigns" element={<Campaigns />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
