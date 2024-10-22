import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

const ProfilePage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updatePassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-lg bg-neutral-800 p-8 shadow-xl">
            <h1 className="mb-6 text-center text-3xl font-bold text-purple-500">
              Profile
            </h1>
            <p className="mb-4 text-center text-white">
              Welcome, {user?.username}!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-white"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <div className="flex items-center rounded border border-neutral-600 bg-neutral-700">
                  <FaLock className="ml-3 text-purple-500" />
                  <input
                    className="w-full rounded border-none bg-transparent px-3 py-2 text-white autofill:bg-neutral-700 autofill:text-white focus:outline-none"
                    id="currentPassword"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter Current Password"
                    required
                    type="password"
                    value={currentPassword}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-white"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <div className="flex items-center rounded border border-neutral-600 bg-neutral-700">
                  <FaLock className="ml-3 text-purple-500" />
                  <input
                    className="w-full rounded border-none bg-transparent px-3 py-2 text-white autofill:bg-neutral-700 autofill:text-white focus:outline-none"
                    id="newPassword"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    required
                    type="password"
                    value={newPassword}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-bold text-white"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="flex items-center rounded border border-neutral-600 bg-neutral-700">
                  <FaLock className="ml-3 text-purple-500" />
                  <input
                    className="w-full rounded border-none bg-transparent px-3 py-2 text-white autofill:bg-neutral-700 autofill:text-white focus:outline-none"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    type="password"
                    value={confirmPassword}
                  />
                </div>
              </div>
              <button
                className="w-full rounded bg-purple-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-purple-700 focus:outline-none"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
            {message && (
              <div
                className={`mt-4 text-center ${
                  message.includes('Failed') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
