import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { getUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

interface Transformations {
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

interface EventWithNumberValue {
  target: {
    value: string;
  };
}

interface EventWithBooleanValue {
  target: {
    checked: boolean;
  };
}

const TransformPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transformations, setTransformations] = useState<Transformations>({
    filters: { grayscale: false, sepia: false },
    format: 'png',
    resize: { height: 600, width: 800 },
    rotate: 0,
  });
  const [currentImageFormat, setCurrentImageFormat] = useState<string | null>(
    null,
  );

  const logTransformation = useCallback(
    (type: string, oldValue: any, newValue: any) => {
      // Log transformation changes for debugging
      const logData = {
        from: oldValue,
        timestamp: new Date().toISOString(),
        to: newValue,
      };
      // Using a more appropriate logging method
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Transformation Update - ${type}:`, logData);
      }
    },
    [],
  );

  const handleImageSelect = useCallback(
    (file: File) => {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTransformedImageUrl(null);

      // Determine the image format from the file type
      const format = file.type.split('/')[1];
      logTransformation('format', currentImageFormat, format);
      setCurrentImageFormat(format);
      setTransformations((prev: any) => {
        logTransformation('initial-format', prev.format, format);
        return { ...prev, format };
      });
    },
    [logTransformation, currentImageFormat],
  );

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
            {previewUrl && (
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
                        className="w-full rounded bg-neutral-600 px-3 py-2"
                        onChange={(e: EventWithNumberValue) => {
                          const newWidth = Number(e.target.value);
                          logTransformation(
                            'resize-width',
                            transformations.resize.width,
                            newWidth,
                          );
                          setTransformations((prev: Transformations) => ({
                            ...prev,
                            resize: { ...prev.resize, width: newWidth },
                          }));
                        }}
                        type="number"
                        value={transformations.resize.width}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-purple-300">
                        Height
                      </label>
                      <input
                        className="w-full rounded bg-neutral-600 px-3 py-2"
                        onChange={(e: EventWithNumberValue) => {
                          const newHeight = Number(e.target.value);
                          logTransformation(
                            'resize-height',
                            transformations.resize.height,
                            newHeight,
                          );
                          setTransformations((prev: Transformations) => ({
                            ...prev,
                            resize: { ...prev.resize, height: newHeight },
                          }));
                        }}
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
                      onChange={(e: EventWithNumberValue) => {
                        const newRotation = Number(e.target.value);
                        logTransformation(
                          'rotate',
                          transformations.rotate,
                          newRotation,
                        );
                        setTransformations((prev: Transformations) => ({
                          ...prev,
                          rotate: newRotation,
                        }));
                      }}
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
                          onChange={(e: EventWithBooleanValue) => {
                            const newValue = e.target.checked;
                            logTransformation(
                              'filter-grayscale',
                              transformations.filters.grayscale,
                              newValue,
                            );
                            setTransformations((prev: Transformations) => ({
                              ...prev,
                              filters: { ...prev.filters, grayscale: newValue },
                            }));
                          }}
                          type="checkbox"
                        />
                        Grayscale
                      </label>
                      <label className="flex items-center">
                        <input
                          checked={transformations.filters.sepia}
                          className="mr-2 accent-purple-500"
                          onChange={(e: EventWithBooleanValue) => {
                            const newValue = e.target.checked;
                            logTransformation(
                              'filter-sepia',
                              transformations.filters.sepia,
                              newValue,
                            );
                            setTransformations((prev: Transformations) => ({
                              ...prev,
                              filters: { ...prev.filters, sepia: newValue },
                            }));
                          }}
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
                      className="w-full rounded bg-neutral-600 px-3 py-2"
                      onChange={(e: EventWithNumberValue) => {
                        const newFormat = e.target.value;
                        logTransformation(
                          'format',
                          transformations.format,
                          newFormat,
                        );
                        setTransformations((prev: Transformations) => ({
                          ...prev,
                          format: newFormat,
                        }));
                      }}
                      value={transformations.format}
                    >
                      <option value={currentImageFormat || ''}>
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
