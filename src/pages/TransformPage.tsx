import axios from 'axios';
import React, { useCallback, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

interface Transformations {
  crop: Crop;
  filters: {
    grayscale: boolean;
    sepia: boolean;
  };
  format: string;
  resize: {
    height: number;
    width: number;
  };
  rotate: number;
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
    crop: { height: 30, unit: '%', width: 30, x: 35, y: 35 },
    filters: { grayscale: false, sepia: false },
    format: 'png',
    resize: { height: 600, width: 800 },
    rotate: 0,
  });
  const [currentImageFormat, setCurrentImageFormat] = useState<string | null>(
    null,
  );

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTransformedImageUrl(null);
    setIsCropping(true);

    // Determine the image format from the file type
    const format = file.type.split('/')[1];
    setCurrentImageFormat(format);
    setTransformations((prev: any) => ({ ...prev, format }));
  }, []);

  const handleCropComplete = useCallback((crop: Crop) => {
    setTransformations((prev: any) => ({ ...prev, crop }));
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

  const getAvailableFormats = useCallback(() => {
    const allFormats = ['png', 'jpeg', 'webp'];
    return allFormats.filter((format) => format !== currentImageFormat);
  }, [currentImageFormat]);

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
                  onChange={(c: Crop) =>
                    setTransformations((prev: Transformations) => ({
                      ...prev,
                      crop: c,
                    }))
                  }
                  onComplete={handleCropComplete}
                >
                  <img alt="Preview" src={previewUrl} />
                </ReactCrop>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                    onClick={handleCropCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    onClick={handleCropConfirm}
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
                        className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e: { target: { value: any } }) =>
                          setTransformations((prev: { resize: any }) => ({
                            ...prev,
                            resize: {
                              ...prev.resize,
                              width: Number(e.target.value),
                            },
                          }))
                        }
                        type="number"
                        value={transformations.resize.width}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Height
                      </label>
                      <input
                        className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e: { target: { value: any } }) =>
                          setTransformations((prev: { resize: any }) => ({
                            ...prev,
                            resize: {
                              ...prev.resize,
                              height: Number(e.target.value),
                            },
                          }))
                        }
                        type="number"
                        value={transformations.resize.height}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-300">
                      Rotation
                    </label>
                    <input
                      className="w-full accent-purple-500"
                      max="180"
                      min="-180"
                      onChange={(e: { target: { value: any } }) =>
                        setTransformations((prev: any) => ({
                          ...prev,
                          rotate: Number(e.target.value),
                        }))
                      }
                      type="range"
                      value={transformations.rotate}
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
                          checked={transformations.filters.grayscale}
                          className="mr-2 accent-purple-500"
                          onChange={(e: { target: { checked: any } }) =>
                            setTransformations((prev: { filters: any }) => ({
                              ...prev,
                              filters: {
                                ...prev.filters,
                                grayscale: e.target.checked,
                              },
                            }))
                          }
                          type="checkbox"
                        />
                        Grayscale
                      </label>
                      <label className="flex items-center">
                        <input
                          checked={transformations.filters.sepia}
                          className="mr-2 accent-purple-500"
                          onChange={(e: { target: { checked: any } }) =>
                            setTransformations((prev: { filters: any }) => ({
                              ...prev,
                              filters: {
                                ...prev.filters,
                                sepia: e.target.checked,
                              },
                            }))
                          }
                          type="checkbox"
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
                      className="w-full rounded bg-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e: { target: { value: any } }) =>
                        setTransformations((prev: any) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                      value={transformations.format}
                    >
                      <option value={currentImageFormat}>
                        {currentImageFormat?.toUpperCase()} (Current)
                      </option>
                      {getAvailableFormats().map((format: string) => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
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
                  alt="Transformed"
                  className="max-w-full rounded-lg"
                  src={transformedImageUrl}
                />
                <a
                  className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700"
                  download={`transformed_image.${transformations.format}`}
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
