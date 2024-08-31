import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage.tsx';
import Login from './Components/Login.tsx';
import Register from './Components/Register.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route element={<Login />} path="/login" />
    <Route element={<Register />} path="/register" />
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
