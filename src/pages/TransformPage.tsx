import axios from 'axios';
import React, { useCallback, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

interface Transformations {
  resize: {
    width: number;
    height: number;
  };
  crop: Crop;
  rotate: number;
  filters: {
    grayscale: boolean;
    sepia: boolean;
  };
  format: string;
}

const TransformPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [transformations, setTransformations] = useState<Transformations>({
    resize: { width: 800, height: 600 },
    crop: { unit: '%', width: 30, height: 30, x: 35, y: 35 },
    rotate: 0,
    filters: { grayscale: false, sepia: false },
    format: 'png',
  });

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTransformedImageUrl(null);
    setIsCropping(true);
  }, []);

  const handleCropComplete = useCallback((crop: Crop) => {
    setTransformations((prev) => ({ ...prev, crop }));
  }, []);

  const handleCropCancel = useCallback(() => {
    setIsCropping(false);
  }, []);

  const handleCropConfirm = useCallback(() => {
    setIsCropping(false);
  }, []);

  const handleTransform = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image to transform');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('transformations', JSON.stringify(transformations));

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
  }, [selectedImage, transformations]);

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
                  crop={transformations.crop}
                  onChange={(c) =>
                    setTransformations((prev) => ({ ...prev, crop: c }))
                  }
                  onComplete={handleCropComplete}
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
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Width
                      </label>
                      <input
                        type="number"
                        value={transformations.resize.width}
                        onChange={(e) =>
                          setTransformations((prev) => ({
                            ...prev,
                            resize: {
                              ...prev.resize,
                              width: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Height
                      </label>
                      <input
                        type="number"
                        value={transformations.resize.height}
                        onChange={(e) =>
                          setTransformations((prev) => ({
                            ...prev,
                            resize: {
                              ...prev.resize,
                              height: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-300">
                      Rotation
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={transformations.rotate}
                      onChange={(e) =>
                        setTransformations((prev) => ({
                          ...prev,
                          rotate: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-purple-500"
                    />
                    <span className="mt-1 block text-right text-sm text-purple-300">
                      {transformations.rotate}°
                    </span>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-300">
                      Filters
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={transformations.filters.grayscale}
                          onChange={(e) =>
                            setTransformations((prev) => ({
                              ...prev,
                              filters: {
                                ...prev.filters,
                                grayscale: e.target.checked,
                              },
                            }))
                          }
                          className="mr-2 accent-purple-500"
                        />
                        Grayscale
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={transformations.filters.sepia}
                          onChange={(e) =>
                            setTransformations((prev) => ({
                              ...prev,
                              filters: {
                                ...prev.filters,
                                sepia: e.target.checked,
                              },
                            }))
                          }
                          className="mr-2 accent-purple-500"
                        />
                        Sepia
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-300">
                      Format
                    </label>
                    <select
                      value={transformations.format}
                      onChange={(e) =>
                        setTransformations((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                      className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
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
                    {isLoading ? 'Transforming...' : 'Apply Transformation'}
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
                  src={transformedImageUrl}
                  alt="Transformed"
                  className="max-w-full rounded-lg"
                />
                <a
                  href={transformedImageUrl}
                  download={`transformed_image.${transformations.format}`}
                  className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700"
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
