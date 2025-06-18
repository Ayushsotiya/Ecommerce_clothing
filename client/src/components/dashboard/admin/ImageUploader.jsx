// components/ImageUploader.jsx

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImagesChange, error }) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedFiles = [...imagePreviews, ...acceptedFiles];
      setImagePreviews(updatedFiles);
      onImagesChange(updatedFiles);
    },
    [imagePreviews, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
          isDragActive ? "border-white bg-zinc-800" : "border-zinc-700 bg-zinc-900"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-white">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select"}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Preview Grid */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {imagePreviews.map((file, index) => (
          <div
            key={index}
            className="w-full h-32 overflow-hidden rounded-lg border border-zinc-600"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
