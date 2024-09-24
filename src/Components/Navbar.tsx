import React from 'react';
import { FaImage, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-purple-500 underline'
      : 'text-white';
  };

  return (
    <nav className="bg-neutral-900 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          className="flex items-center space-x-2 text-xl font-bold text-white transition duration-300 hover:text-purple-500"
          to="/"
        >
          <FaImage className="text-purple-500" />
          <span>Imagery</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            className={`${isActive('/transform')} transition duration-300 hover:text-purple-500`}
            to="/transform"
          >
            Transform
          </Link>
          <Link
            className={`${isActive('/convert')} transition duration-300 hover:text-purple-500`}
            to="/convert"
          >
            Convert
          </Link>
          <div className="relative">
            <button
              className="rounded-full bg-neutral-700 p-2 hover:bg-neutral-600"
              onClick={() =>
                document
                  .getElementById('profileDropdown')
                  ?.classList.toggle('hidden')
              }
            >
              <FaUserCircle className="h-6 w-6 text-white" />
            </button>
            <div
              className="absolute right-0 mt-2 hidden w-48 rounded-md bg-neutral-800 shadow-lg"
              id="profileDropdown"
            >
              <Link
                className={`block px-4 py-2 text-sm ${isActive('/profile')} hover:bg-neutral-700`}
                to="/profile"
              >
                Profile
              </Link>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
