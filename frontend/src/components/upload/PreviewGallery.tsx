import React, { useState } from 'react';
import { FilePreview } from './FilePreview';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface PreviewGalleryProps {
  files: File[];
  onRemove?: (file: File) => void;
}

export const PreviewGallery: React.FC<PreviewGalleryProps> = ({
  files,
  onRemove
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextPreview = () => {
    setActiveIndex((prev) => (prev + 1) % files.length);
  };

  const previousPreview = () => {
    setActiveIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Main Preview */}
      <div className="relative bg-gray-100 rounded-lg p-4">
        <FilePreview
          file={files[activeIndex]}
          className="max-h-96 flex items-center justify-center"
        />
        
        {files.length > 1 && (
          <>
            <button
              onClick={previousPreview}
              className="absolute left-4 top-1/2 transform -translate-y-1/2
                bg-black bg-opacity-50 text-white p-2 rounded-full
                hover:bg-opacity-75 transition-opacity duration-200"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPreview}
              className="absolute right-4 top-1/2 transform -translate-y-1/2
                bg-black bg-opacity-50 text-white p-2 rounded-full
                hover:bg-opacity-75 transition-opacity duration-200"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(files[activeIndex])}
            className="absolute top-4 right-4 bg-red-500 text-white
              p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {files.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {files.map((file, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                border-2 transition-colors duration-200 ${
                  index === activeIndex
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
            >
              <FilePreview
                file={file}
                showFullscreen={false}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* File Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">{files[activeIndex].name}</p>
        <p>{(files[activeIndex].size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </div>
  );
};
// در SecureFileUpload.tsx، قسمت render را به‌روزرسانی می‌کنیم

// ... (کد قبلی)

{files.length > 0 && (
    <div className="mt-6">
      <PreviewGallery
        files={files.filter(f => f.status !== 'error').map(f => f.file)}
        onRemove={(file) => {
          setFiles(prev => prev.filter(f => f.name !== file.name));
        }}
      />
  
      <div className="mt-6">
        <div className="space-y-4">
          {/* ... (کد قبلی نمایش لیست فایل‌ها) ... */}
        </div>
      </div>
    </div>
  )}
  
  // ... (کد قبلی)