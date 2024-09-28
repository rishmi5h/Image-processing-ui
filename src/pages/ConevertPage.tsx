import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { FaDownload, FaExchangeAlt } from 'react-icons/fa';
import { getUrl } from '../api/getUrl.tsx';
import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';
import UploadImage from '../Components/UploadImage.tsx';

const ConvertPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
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

    try {
      const response = await axios.get(getUrl('/convert'), {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          format: outputFormat,
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
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-purple-500">
          Convert Image
        </h1>
        <div className="mx-auto max-w-2xl rounded-lg bg-neutral-800 p-8 shadow-xl">
          <UploadImage
            onImageSelect={handleImageSelect}
            previewUrl={previewUrl}
          />
          <div className="mb-6">
            <label className="mb-2 block font-semibold" htmlFor="formatSelect">
              Select output format:
            </label>
            <select
              className="w-full rounded bg-neutral-700 p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            className="flex w-full items-center justify-center rounded bg-purple-600 px-4 py-2 text-white transition duration-300 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
            disabled={isLoading || !selectedImage}
            onClick={handleConvert}
          >
            {isLoading ? (
              <>
                <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                Converting...
              </>
            ) : (
              <>
                <FaExchangeAlt className="mr-2" /> Convert
              </>
            )}
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {convertedImageUrl && (
            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-purple-500">
                Converted Image
              </h2>
              <img
                alt="Converted"
                className="h-auto max-w-full rounded-lg"
                src={convertedImageUrl}
              />
              <a
                className="mt-4 inline-flex items-center rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700"
                download={`converted.${outputFormat}`}
                href={convertedImageUrl}
              >
                <FaDownload className="mr-2" /> Download
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConvertPage;
