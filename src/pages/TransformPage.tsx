import axios from 'axios';
import React, { useCallback, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { getUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

const TransformPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [filter, setFilter] = useState('none');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 30,
    aspect: 16 / 9,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTransformedImageUrl(null);
    setIsCropping(true);
  }, []);

  const handleCropComplete = useCallback((crop: Crop) => {
    setCompletedCrop(crop);
  }, []);

  const handleCropCancel = useCallback(() => {
    setIsCropping(false);
    setCrop({ unit: '%', width: 30, aspect: 16 / 9 });
    setCompletedCrop(null);
  }, []);

  const handleCropConfirm = useCallback(() => {
    if (completedCrop && previewUrl) {
      // Here you would typically send the crop data to your backend
      // For this example, we'll just update the previewUrl
      setIsCropping(false);
      // You may want to actually crop the image here or send crop data to backend
    }
  }, [completedCrop, previewUrl]);

  const handleTransform = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image to transform');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('rotation', rotation.toString());
    formData.append('scale', scale.toString());
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('filter', filter);
    formData.append('crop', JSON.stringify(completedCrop));

    try {
      const response = await axios.post(getUrl('/transform'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      setTransformedImageUrl(url);
    } catch (error) {
      console.error('Transformation error:', error);
      setError('An error occurred during transformation');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, rotation, scale, width, height, filter, completedCrop]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold text-purple-500">
            Transform Image
          </h1>
          <div className="mx-auto max-w-2xl rounded-lg bg-neutral-800 p-8 shadow-xl">
            <UploadImage
              maxSizeInBytes={10 * 1024 * 1024}
              onImageSelect={handleImageSelect}
              previewUrl={previewUrl}
            />
            {previewUrl && isCropping && (
              <div className="mt-6 rounded-lg bg-neutral-700 p-6 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-purple-400">
                  Crop Image
                </h2>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={16 / 9}
                >
                  <img src={previewUrl} alt="Preview" />
                </ReactCrop>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={handleCropCancel}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropConfirm}
                    className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                  >
                    Confirm Crop
                  </button>
                </div>
              </div>
            )}
            {previewUrl && !isCropping && (
              <div className="mt-6 rounded-lg bg-neutral-700 p-6 shadow-lg">
                <h2 className="mb-6 border-b border-purple-400 pb-2 text-2xl font-bold text-purple-400">
                  Transformation Controls
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-purple-300">
                      Rotation
                    </label>
                    <div className="flex items-center">
                      <input
                        className="w-full accent-purple-500"
                        max="180"
                        min="-180"
                        onChange={(e) =>
                          setRotation(Number.parseInt(e.target.value))
                        }
                        type="range"
                        value={rotation}
                      />
                      <span className="ml-4 w-12 text-right text-purple-300">
                        {rotation}°
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-purple-300">
                      Scale
                    </label>
                    <div className="flex items-center">
                      <input
                        className="w-full accent-purple-500"
                        max="200"
                        min="50"
                        onChange={(e) =>
                          setScale(Number.parseInt(e.target.value))
                        }
                        type="range"
                        value={scale}
                      />
                      <span className="ml-4 w-12 text-right text-purple-300">
                        {scale}%
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Width
                      </label>
                      <div className="flex items-center">
                        <input
                          className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min="1"
                          onChange={(e) => setWidth(Number(e.target.value))}
                          type="number"
                          value={width}
                        />
                        <span className="ml-2 text-purple-300">px</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Height
                      </label>
                      <div className="flex items-center">
                        <input
                          className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min="1"
                          onChange={(e) => setHeight(Number(e.target.value))}
                          type="number"
                          value={height}
                        />
                        <span className="ml-2 text-purple-300">px</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-300">
                      Filter
                    </label>
                    <select
                      className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => setFilter(e.target.value)}
                      value={filter}
                    >
                      <option value="none">None</option>
                      <option value="grayscale">Grayscale</option>
                      <option value="sepia">Sepia</option>
                      <option value="blur">Blur</option>
                      <option value="sharpen">Sharpen</option>
                    </select>
                  </div>

                  <button
                    className="mt-4 w-full rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
                    onClick={() => setIsCropping(true)}
                  >
                    Crop Image
                  </button>

                  <button
                    className="mt-6 w-full transform rounded-lg bg-purple-600 px-4 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                    onClick={handleTransform}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        Transforming...
                      </span>
                    ) : (
                      'Apply Transformation'
                    )}
                  </button>
                </div>
              </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {transformedImageUrl && (
              <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold text-purple-500">
                  Transformed Image
                </h2>
                <img
                  alt="Transformed"
                  className="h-auto max-w-full rounded-lg"
                  src={transformedImageUrl}
                />
                <a
                  className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700"
                  download="transformed_image.jpg"
                  href={transformedImageUrl}
                >
                  Download Transformed Image
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransformPage;
