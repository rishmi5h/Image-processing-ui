import axios from 'axios';
import { useCallback, useState } from 'react';
import { baseUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUploadLocal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setUploadedImage(file);

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

  const handleImageUpload = useCallback(async () => {
    if (uploadedImage) {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      try {
        const response = await axios.post(baseUrl + '/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadSuccess(true);
        setUploadedImageUrl(response.data.imageUrl); // Assuming the server returns the image URL
      } catch {
        setUploadSuccess(false);
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
              className="mb-4 block text-center text-xl"
              htmlFor="imageInput"
            >
              Upload an image:
            </label>
            <input
              accept="image/*"
              className="mb-6 w-full cursor-pointer rounded-md bg-purple-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-purple-700"
              id="imageInput"
              onChange={handleImageUploadLocal}
              type="file"
            />

            <div className="mt-4 flex justify-center" id="imagePreview"></div>

            <button
              className="mt-6 w-full rounded-md bg-purple-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-purple-700"
              onClick={handleImageUpload}
            >
              Upload Image
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
                {/* Add image editing controls here */}
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
