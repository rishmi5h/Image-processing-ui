import axios from 'axios';
import { useCallback, useState } from 'react';
import Navbar from './Navbar.tsx';

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUploadLocal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setUploadedImage(file);
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

  const handleImageUpload = useCallback(() => {
    if (uploadedImage) {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      axios.post('http://localhost:8080/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  }, [uploadedImage]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
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
            onChange={handleImageUploadLocal}
            type="file"
          />

          <div className="mt-4 flex justify-center" id="imagePreview"></div>

          <button
            className="mt-6 w-full rounded-md bg-pink-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-pink-700"
            onClick={handleImageUpload}
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
