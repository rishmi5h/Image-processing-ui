import axios from 'axios';
import React, { useCallback, useState } from 'react';
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

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTransformedImageUrl(null);
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
    formData.append('rotation', rotation.toString());
    formData.append('scale', scale.toString());
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('filter', filter);

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
  }, [selectedImage, rotation, scale, width, height, filter]);

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
              maxSizeInBytes={10 * 1024 * 1024} // 10MB limit
              onImageSelect={handleImageSelect}
              previewUrl={previewUrl}
            />
            {previewUrl && (
              <div className="mt-6">
                <h2 className="mb-4 text-2xl font-bold text-purple-500">
                  Transformation Controls
                </h2>
                <div className="mb-4 flex items-center">
                  <label className="mr-2 w-24">Rotation:</label>
                  <input
                    className="w-full"
                    max="180"
                    min="-180"
                    onChange={(e) =>
                      setRotation(Number.parseInt(e.target.value))
                    }
                    type="range"
                    value={rotation}
                  />
                  <span className="ml-2 w-12 text-right">{rotation}°</span>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="mr-2 w-24">Scale:</label>
                  <input
                    className="w-full"
                    max="200"
                    min="50"
                    onChange={(e) => setScale(Number.parseInt(e.target.value))}
                    type="range"
                    value={scale}
                  />
                  <span className="ml-2 w-12 text-right">{scale}%</span>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="mr-2 w-24">Width:</label>
                  <input
                    className="w-full rounded bg-neutral-700 px-2 py-1"
                    min="1"
                    onChange={(e) => setWidth(Number(e.target.value))}
                    type="number"
                    value={width}
                  />
                  <span className="ml-2 w-12 text-right">px</span>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="mr-2 w-24">Height:</label>
                  <input
                    className="w-full rounded bg-neutral-700 px-2 py-1"
                    min="1"
                    onChange={(e) => setHeight(Number(e.target.value))}
                    type="number"
                    value={height}
                  />
                  <span className="ml-2 w-12 text-right">px</span>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="mr-2 w-24">Filter:</label>
                  <select
                    className="w-full rounded bg-neutral-700 px-2 py-1"
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
                  className="mt-4 flex w-full items-center justify-center rounded bg-purple-600 px-4 py-2 text-white transition duration-300 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
                  disabled={isLoading}
                  onClick={handleTransform}
                >
                  {isLoading ? 'Transforming...' : 'Apply Transformation'}
                </button>
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
