import { log } from 'console';
import axios from 'axios';
import React, { useState } from 'react';

const Link = (props: JSX.IntrinsicElements['a']) => (
  <a
    className="text-pink-500 underline hover:no-underline dark:text-pink-400"
    {...props}
  />
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });
      console.log('Login successful', response.data);
    } catch {
      alert('Login Failed');
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
            required
            type="password"
            value={password}
          />
        </div>
        <button
          className="w-full rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <div className="mx-auto my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
      <h1 className="mb-4 text-center text-4xl">Image Processing</h1>
      <Login />
    </div>
  );
}
