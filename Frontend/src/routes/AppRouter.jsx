import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// Layout
import Navbar from '@components/common/Navbar';
import Footer from '@components/common/Footer';

// Pages
import HomePage       from '@pages/Home';
import HotelsPage     from '@pages/Hotels';
import HotelDetail    from '@pages/Hotels/HotelDetail';
import ToursPage      from '@pages/Tours';
import TourDetail     from '@pages/Tours/TourDetail';
import GuidesPage     from '@pages/Guides';
import GuideDetail    from '@pages/Guides/GuideDetail';
import LoginPage      from '@pages/Auth/Login';
import RegisterPage   from '@pages/Auth/Register';
import DashboardPage  from '@pages/Dashboard';
import BookingPage    from '@pages/Booking';
import BookingSuccess from '@pages/Booking/BookingSuccess';
import AdminPage      from '@pages/Admin';
import NotFoundPage   from '@pages/NotFound';

// Protected route wrapper
const PrivateRoute = ({ children, roles }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="page-loading">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/hotels"        element={<HotelsPage />} />
          <Route path="/hotels/:slug"  element={<HotelDetail />} />
          <Route path="/tours"         element={<ToursPage />} />
          <Route path="/tours/:slug"   element={<TourDetail />} />
          <Route path="/guides"        element={<GuidesPage />} />
          <Route path="/guides/:id"    element={<GuideDetail />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />

          {/* Protected – any logged-in user */}
          <Route path="/booking/:type/:id" element={
            <PrivateRoute><BookingPage /></PrivateRoute>
          } />
          <Route path="/booking/success" element={
            <PrivateRoute><BookingSuccess /></PrivateRoute>
          } />
          <Route path="/dashboard/*" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/*" element={
            <PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
