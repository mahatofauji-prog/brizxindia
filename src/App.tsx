/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import WelcomePage from './pages/WelcomePage';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import Blog from './pages/public/Blog';
import BrandListing from './pages/public/BrandListing';
import BrandDetails from './pages/public/BrandDetails';
import SeekerListing from './pages/public/SeekerListing';
import SeekerDetails from './pages/public/SeekerDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import SearchSeekers from './pages/SearchSeekers';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSubscriptions from './pages/AdminSubscriptions';
import AdminPayments from './pages/AdminPayments';
import AdminReports from './pages/AdminReports';
import AdminCommunications from './pages/AdminCommunications';
import AdminSettings from './pages/AdminSettings';
import AdminSeekers from './pages/admin/AdminSeekers';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCMS from './pages/admin/AdminCMS';
import AdminHomePageManagement from './pages/admin/AdminHomePageManagement';
import AdminNavigationManagement from './pages/admin/AdminNavigationManagement';
import AdminFeaturedListings from './pages/admin/AdminFeaturedListings';
import AdminSmartMatch from './pages/admin/AdminSmartMatch';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminRolesPermissions from './pages/admin/AdminRolesPermissions';
import AdminBackupRestore from './pages/admin/AdminBackupRestore';
import AdminImportExport from './pages/admin/AdminImportExport';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminConnections from './pages/admin/AdminConnections';
import AdminDeveloperSettings from './pages/admin/AdminDeveloperSettings';
import BrandCRM from './pages/brand/BrandCRM';
import BrandMeetings from './pages/brand/BrandMeetings';
import BrandSubscription from './pages/brand/BrandSubscription';
import BrandDashboard from './pages/brand/BrandDashboard';
import BrandSavedLeads from './pages/brand/BrandSavedLeads';
import BrandPayments from './pages/brand/BrandPayments';
import BrandAnalytics from './pages/brand/BrandAnalytics';
import BrandNotifications from './pages/brand/BrandNotifications';
import BrandProfile from './pages/brand/BrandProfile';
import BrandApplications from './pages/brand/BrandApplications';
import AdminApplications from './pages/admin/AdminApplications';
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import SeekerMeetings from './pages/seeker/SeekerMeetings';
import SeekerBrowseBrands from './pages/seeker/SeekerBrowseBrands';
import SeekerSavedBrands from './pages/seeker/SeekerSavedBrands';
import SeekerROICalculator from './pages/seeker/SeekerROICalculator';
import AdvancedROICalculator from './pages/AdvancedROICalculator';
import SeekerBrandVerification from './pages/seeker/SeekerBrandVerification';
import AdminBrandVerification from './pages/admin/AdminBrandVerification';
import SeekerPremium from './pages/seeker/SeekerPremium';
import SeekerNotifications from './pages/seeker/SeekerNotifications';
import SeekerSettings from './pages/seeker/SeekerSettings';
import SeekerConnections from './pages/seeker/SeekerConnections';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'BRAND_OWNER') return <Navigate to="/brand" replace />;
    if (user.role === 'FRANCHISE_SEEKER') return <Navigate to="/seeker" replace />;
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="brands" element={<BrandListing />} />
          <Route path="brands/:id" element={<BrandDetails />} />
          <Route path="seekers" element={<SeekerListing />} />
          <Route path="seekers/:id" element={<SeekerDetails />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="roi-calculator" element={<SeekerROICalculator />} />
          <Route path="roi-calculator/advanced" element={<AdvancedROICalculator />} />
          <Route path="advanced-roi-calculator" element={<AdvancedROICalculator />} />
        </Route>
        
        <Route element={<DashboardLayout />}>
          {/* Brand Routes */}
          <Route path="/brand" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandDashboard />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <SearchSeekers />
            </ProtectedRoute>
          } />
          <Route path="/brand/crm" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandCRM />
            </ProtectedRoute>
          } />
          <Route path="/brand/meetings" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandMeetings />
            </ProtectedRoute>
          } />
          <Route path="/brand/subscription" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandSubscription />
            </ProtectedRoute>
          } />
          <Route path="/brand/saved-leads" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandSavedLeads />
            </ProtectedRoute>
          } />
          <Route path="/brand/payments" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandPayments />
            </ProtectedRoute>
          } />
          <Route path="/brand/analytics" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/brand/notifications" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandNotifications />
            </ProtectedRoute>
          } />
          <Route path="/brand/profile" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandProfile />
            </ProtectedRoute>
          } />
          <Route path="/brand/roi-calculator" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <AdvancedROICalculator />
            </ProtectedRoute>
          } />
          <Route path="/brand/applications" element={
            <ProtectedRoute allowedRoles={['BRAND_OWNER']}>
              <BrandApplications />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminApplications />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/seekers" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminSeekers />
            </ProtectedRoute>
          } />
          <Route path="/admin/brands" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminBrands />
            </ProtectedRoute>
          } />
          <Route path="/admin/brand-verification" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminBrandVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/subscriptions" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminSubscriptions />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminPayments />
            </ProtectedRoute>
          } />
          <Route path="/admin/cms" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminCMS />
            </ProtectedRoute>
          } />
          <Route path="/admin/homepage-management" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminHomePageManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/navigation-management" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminNavigationManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/featured" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminFeaturedListings />
            </ProtectedRoute>
          } />
          <Route path="/admin/smart-match" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminSmartMatch />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/communications" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminCommunications />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminAuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/roles" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminRolesPermissions />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/backup" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminBackupRestore />
            </ProtectedRoute>
          } />
          <Route path="/admin/import-export" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
               <AdminImportExport />
            </ProtectedRoute>
          } />

          <Route path="/admin/media" element={ 
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
               <AdminMediaLibrary /> 
            </ProtectedRoute> 
          } /> 
          <Route path="/admin/notifications" element={ 
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
               <AdminNotifications /> 
            </ProtectedRoute> 
          } /> 
          <Route path="/admin/connections" element={ 
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
               <AdminConnections /> 
            </ProtectedRoute> 
          } /> 
          <Route path="/admin/developer" element={ 
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
               <AdminDeveloperSettings /> 
            </ProtectedRoute> 
          } />
          {/* Seeker Routes */}
          <Route path="/seeker" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seeker/browse-brands" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerBrowseBrands />
            </ProtectedRoute>
          } />
          <Route path="/seeker/saved-brands" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerSavedBrands />
            </ProtectedRoute>
          } />
          <Route path="/seeker/connections" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerConnections />
            </ProtectedRoute>
          } />
          <Route path="/seeker/connections/:connectionId" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerConnections />
            </ProtectedRoute>
          } />
          <Route path="/seeker/meetings" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerMeetings />
            </ProtectedRoute>
          } />
          <Route path="/seeker/roi-calculator" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerROICalculator />
            </ProtectedRoute>
          } />
          <Route path="/seeker/roi-calculator/advanced" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <AdvancedROICalculator />
            </ProtectedRoute>
          } />
          <Route path="/seeker/brand-verification" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
              <SeekerBrandVerification />
            </ProtectedRoute>
          } />
          <Route path="/seeker/profile" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
               <SeekerProfile />
            </ProtectedRoute>
          } />
          <Route path="/seeker/premium" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
               <SeekerPremium />
            </ProtectedRoute>
          } />
          <Route path="/seeker/notifications" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
               <SeekerNotifications />
            </ProtectedRoute>
          } />
          <Route path="/seeker/settings" element={
            <ProtectedRoute allowedRoles={['FRANCHISE_SEEKER']}>
               <SeekerSettings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
