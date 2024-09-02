import { useCallback } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';

const HomePage = () => {
  const { logout } = useAuth();

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Process the file here (e.g., upload to server, display preview)
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          const previewContainer = document.getElementById('imagePreview');
          if (previewContainer) {
            previewContainer.innerHTML = '';
            previewContainer.append(img);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <nav className="mb-4 flex items-center justify-between bg-neutral-800 p-4">
        <h2 className="text-xl font-bold">Imagery</h2>
        <div className="flex items-center space-x-4">
          <Link
            className="text-white transition duration-300 hover:text-pink-500"
            to="/transform"
          >
            Transform
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
              <FaUserCircle className="h-6 w-6" />
            </button>
            <div
              className="absolute right-0 mt-2 hidden w-48 rounded-md bg-neutral-800 shadow-lg"
              id="profileDropdown"
            >
              <a
                className="block px-4 py-2 text-sm text-white hover:bg-neutral-700"
                href="/profile"
              >
                Profile
              </a>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-4">
        <div className="w-full max-w-md rounded-lg bg-neutral-800 p-8 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-pink-500">
            Image Processing
          </h2>

          <label className="mb-2 block text-center" htmlFor="imageInput">
            Upload an image:
          </label>
          <input
            accept="image/*"
            className="mb-6 w-full cursor-pointer rounded-md bg-pink-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-pink-700"
            id="imageInput"
            onChange={handleImageUpload}
            type="file"
          />

          <div className="mt-4 flex justify-center" id="imagePreview"></div>

          <p className="mb-4 mt-8 text-center font-semibold">Resize Image</p>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="mb-2 block" htmlFor="widthInput">
                Width:
              </label>
              <input
                className="w-full rounded border border-neutral-600 bg-neutral-700 px-3 py-2"
                id="widthInput"
                min="1"
                placeholder="Enter width"
                type="number"
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="mb-2 block" htmlFor="heightInput">
                Height:
              </label>
              <input
                className="w-full rounded border border-neutral-600 bg-neutral-700 px-3 py-2"
                id="heightInput"
                min="1"
                placeholder="Enter height"
                type="number"
              />
            </div>
          </div>

          <button className="mt-6 w-full rounded-md bg-pink-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-pink-700">
            Process Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
