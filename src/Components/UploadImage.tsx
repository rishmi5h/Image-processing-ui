import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

interface UploadImageProps {
  maxSizeInBytes?: number;
  onImageSelect: (file: File) => void;
  previewUrl?: string | null;
}

const UploadImage: React.FC<UploadImageProps> = ({
  maxSizeInBytes = 10 * 1024 * 1024,
  onImageSelect,
  previewUrl, // 10MB default
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSizeInBytes) {
        alert(`File size exceeds ${maxSizeInBytes / (1024 * 1024)}MB limit`);
        return;
      }
      onImageSelect(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="mb-2 block font-semibold" htmlFor="imageInput">
        Select an image:
      </label>
      <div className="flex w-full items-center justify-center">
        <label
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-neutral-700 transition duration-300 hover:bg-neutral-600"
          htmlFor="imageInput"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <FaCloudUploadAlt className="mb-3 h-10 w-10 text-purple-500" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            accept="image/*"
            className="hidden"
            id="imageInput"
            onChange={handleFileChange}
            type="file"
          />
        </label>
      </div>
      {previewUrl && (
        <div className="mt-4">
          <img
            alt="Preview"
            className="h-auto max-w-full rounded-lg"
            src={previewUrl}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
