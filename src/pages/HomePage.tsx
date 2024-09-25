import axios from 'axios';
import { useCallback, useState } from 'react';
import { FaCloudUploadAlt, FaEdit } from 'react-icons/fa';
import { baseUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUploadLocal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setUploadedImage(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target?.result as string;
          img.className = 'max-w-full h-auto rounded-lg';
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

  const handleImageUpload = useCallback(async () => {
    if (uploadedImage) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', uploadedImage);
      try {
        const response = await axios.post(baseUrl + '/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadSuccess(true);
        setUploadedImageUrl(response.data.imageUrl);
      } catch {
        setUploadSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [uploadedImage]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold text-purple-500">
            Image Processing
          </h1>
          <div className="mx-auto max-w-2xl rounded-lg bg-neutral-800 p-8 shadow-xl">
            <label
              className="mb-4 block text-center text-xl font-semibold"
              htmlFor="imageInput"
            >
              Upload an image:
            </label>
            <div className="flex w-full items-center justify-center">
              <label
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-neutral-700 transition duration-300 hover:bg-neutral-600"
                htmlFor="imageInput"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <FaCloudUploadAlt className="mb-3 h-10 w-10 text-purple-500" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  id="imageInput"
                  onChange={handleImageUploadLocal}
                  type="file"
                />
              </label>
            </div>

            <div className="mt-4 flex justify-center" id="imagePreview"></div>

            <button
              className="mt-6 w-full rounded-md bg-purple-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-purple-700 focus:outline-none disabled:bg-purple-400"
              disabled={!uploadedImage || isLoading}
              onClick={handleImageUpload}
            >
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>

            {uploadSuccess && (
              <div className="mt-4 text-center text-green-500">
                Image uploaded successfully!
              </div>
            )}

            {uploadedImageUrl && (
              <div className="mt-6">
                <h3 className="mb-4 text-center text-2xl font-bold text-purple-500">
                  Edit Image
                </h3>
                <img
                  alt="Uploaded"
                  className="w-full rounded-lg"
                  src={uploadedImageUrl}
                />
                <button className="mt-4 w-full rounded-md bg-purple-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-purple-700 focus:outline-none">
                  <FaEdit className="mr-2 inline-block" /> Edit Image
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
