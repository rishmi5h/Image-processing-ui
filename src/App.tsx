import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Login.tsx';
import Register from './Components/Register.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
// import ConvertPage from './';
import HomePage from './pages/HomePage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import TransformPage from './pages/TransformPage.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/landing" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/Home" /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
      path="/login"
    />
    <Route
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
      path="/register"
    />
    <Route
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
      path="/Home"
    />
    <Route
      element={
        <ProtectedRoute>
          <TransformPage />
        </ProtectedRoute>
      }
      path="/transform"
    />
    {/* <Route
      element={
        <ProtectedRoute>
          <ConvertPage />
        </ProtectedRoute>
      }
      path="/convert"
    /> */}
    <Route
      element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      }
      path="/"
    />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
