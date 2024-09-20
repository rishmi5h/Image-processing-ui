import axios from 'axios';
import React, { useCallback, useState } from 'react';
import Navbar from '../Components/Navbar.tsx';

const ConvertPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    },
    [],
  );

  const handleFormatChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setOutputFormat(event.target.value);
    },
    [],
  );

  const handleConvert = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image to convert');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('format', outputFormat);

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      setConvertedImageUrl(url);
    } catch {
      setError('An error occurred during conversion');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, outputFormat]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Convert Image</h1>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="imageInput">
            Select an image:
          </label>
          <input
            accept="image/*"
            className="w-full rounded bg-neutral-800 p-2"
            id="imageInput"
            onChange={handleImageSelect}
            type="file"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="formatSelect">
            Select output format:
          </label>
          <select
            className="w-full rounded bg-neutral-800 p-2"
            id="formatSelect"
            onChange={handleFormatChange}
            value={outputFormat}
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF</option>
          </select>
        </div>
        <button
          className="rounded bg-purple-600 px-4 py-2 text-white disabled:bg-purple-400"
          disabled={isLoading || !selectedImage}
          onClick={handleConvert}
        >
          {isLoading ? 'Converting...' : 'Convert'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {convertedImageUrl && (
          <div className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Converted Image</h2>
            <img
              alt="Converted"
              className="h-auto max-w-full"
              src={convertedImageUrl}
            />
            <a
              className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white"
              download={`converted.${outputFormat}`}
              href={convertedImageUrl}
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvertPage;
