import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(username, password);
      setSuccessMessage('Registration successful. Redirecting to login...');
    } catch {
      alert('Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
      <h1 className="mb-4 text-4xl">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="username">
            UserName
          </label>
          <input
            className="w-full rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            required
            type="username"
            value={username}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            type="password"
            value={password}
          />
        </div>
        {successMessage ? (
          <div className="text-center text-green-500">{successMessage}</div>
        ) : (
          <button
            className="w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:bg-purple-300"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                <span className="ml-2">Registering...</span>
              </div>
            ) : (
              'Register'
            )}
          </button>
        )}
      </form>
      <div className="mt-4 text-center">
        <Link className="text-blue-500 hover:underline" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
