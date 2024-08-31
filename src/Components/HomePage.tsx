import { useCallback } from 'react';
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
    <div>
      <h2>Home Page</h2>
      <button
        className="mb-4 rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        onClick={logout}
      >
        Logout
      </button>
      <div>
        <label htmlFor="imageInput">Upload an image:</label>
        <input
          accept="image/*"
          className="mt-4 rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
          id="imageInput"
          onChange={handleImageUpload}
          type="file"
        />
        <div id="imagePreview"></div>
        <p>Resize Image</p>
        <label className="mr-2 mt-2" htmlFor="widthInput">
          Width:
        </label>
        <input
          className="mt-2 rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
          id="widthInput"
          min="1"
          placeholder="Enter width"
          type="number"
        />

        <label className="ml-4 mr-2 mt-2" htmlFor="heightInput">
          Height:
        </label>
        <input
          className="mt-2 rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
          id="heightInput"
          min="1"
          placeholder="Enter height"
          type="number"
        />
        <button className="mt-4 rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600">
          Process Image
        </button>
      </div>
    </div>
  );
};

export default HomePage;
