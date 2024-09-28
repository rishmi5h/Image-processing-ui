import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { baseUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

const HomePage = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showUploadComponent, setShowUploadComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch uploaded images when component mounts
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      const response = await axios.get(baseUrl + '/images');
      setUploadedImages(response.data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageUploadLocal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    },
    [],
  );

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(baseUrl + '/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedImages((prevImages) => [
        ...prevImages,
        response.data.imageUrl,
      ]);
      setShowUploadComponent(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-purple-500">
          Your Images
        </h1>
        <div className="rounded-lg bg-neutral-800 p-6 shadow-xl">
          {showUploadComponent ? (
            <div className="relative">
              <button
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
                onClick={() => setShowUploadComponent(false)}
              >
                <FaTimes size={24} />
              </button>
              <UploadImage
                onImageSelect={handleImageUploadLocal}
                previewUrl={null}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {uploadedImages.map((imageUrl, index) => (
                <div className="group relative" key={index}>
                  <img
                    alt={`Uploaded ${index + 1}`}
                    className="h-40 w-full transform rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                    src={imageUrl}
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button className="rounded-full bg-purple-600 p-2 transition-colors duration-200 hover:bg-purple-700">
                      <FaEdit className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="group flex h-40 w-full items-center justify-center rounded-lg bg-neutral-700 transition-colors duration-200 hover:bg-neutral-600"
                onClick={() => setShowUploadComponent(true)}
              >
                <FaPlus className="text-4xl text-purple-500 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
