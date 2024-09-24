import React, { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      // Redirect or show success message
    } catch {
      alert('Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-lg bg-neutral-800 p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-purple-500">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="username"
              >
                Username
              </label>
              <div className="flex items-center rounded border border-neutral-600 bg-neutral-700">
                <FaUser className="ml-3 text-purple-500" />
                <input
                  className="w-full rounded border-none bg-transparent px-3 py-2 focus:outline-none"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  required
                  type="text"
                  value={username}
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center rounded border border-neutral-600 bg-neutral-700">
                <FaLock className="ml-3 text-purple-500" />
                <input
                  className="w-full rounded border-none bg-transparent px-3 py-2 focus:outline-none"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>
            <button
              className="w-full rounded bg-purple-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-purple-700 focus:outline-none"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{' '}
            <Link className="text-purple-500 hover:underline" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
