import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage.tsx';
import Login from './Components/Login.tsx';
import Register from './Components/Register.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" /> : children;
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
