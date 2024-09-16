import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      setError('Your username or password might be wrong');
    }
  };

  return (
    <div className="mx-auto my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
      <h1 className="mb-4 text-4xl">Login</h1>
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
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          className="w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          type="submit"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link className="text-blue-500 hover:underline" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
