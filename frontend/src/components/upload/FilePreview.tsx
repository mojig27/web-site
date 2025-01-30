import React, { useState, useEffect } from 'react';
import { 
  FiFile, 
  FiFileText, 
  FiImage, 
  FiFilm,
  FiPaperclip,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';

interface FilePreviewProps {
  file: File;
  className?: string;
  showFullscreen?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  className = '',
  showFullscreen = true
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePreview();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [file]);

  const generatePreview = async () => {
    try {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else if (file.type === 'application/pdf') {
        await generatePDFPreview();
      } else if (file.type.startsWith('text/')) {
        await generateTextPreview();
      }
    } catch (err) {
      setError('Failed to generate preview');
      console.error('Preview generation error:', err);
    }
  };

  const generatePDFPreview = async () => {
    try {
      const { pdfjs } = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport: viewport
      }).promise;

      setPreview(canvas.toDataURL());
    } catch (err) {
      setError('Failed to generate PDF preview');
    }
  };

  const generateTextPreview = async () => {
    try {
      const text = await file.text();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.width = 400;
      canvas.height = 300;
      
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = '14px monospace';
      context.fillStyle = '#000000';
      
      const lines = text.split('\n').slice(0, 10);
      lines.forEach((line, index) => {
        context.fillText(
          line.substring(0, 35) + (line.length > 35 ? '...' : ''),
          10,
          20 + (index * 20)
        );
      });

      setPreview(canvas.toDataURL());
    } catch (err) {
      setError('Failed to generate text preview');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderFileIcon = () => {
    if (file.type.startsWith('image/')) return <FiImage className="w-8 h-8" />;
    if (file.type === 'application/pdf') return <FiFileText className="w-8 h-8" />;
    if (file.type.startsWith('text/')) return <FiFile className="w-8 h-8" />;
    if (file.type.startsWith('video/')) return <FiFilm className="w-8 h-8" />;
    return <FiPaperclip className="w-8 h-8" />;
  };

  const renderPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          {renderFileIcon()}
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      );
    }

    if (!preview) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          {renderFileIcon()}
          <p className="text-gray-500 text-sm mt-2">
            {file.name.length > 20 
              ? `${file.name.substring(0, 20)}...` 
              : file.name}
          </p>
        </div>
      );
    }

    return (
      <div className="relative group">
        <img
          src={preview}
          alt={file.name}
          className={`max-w-full h-auto ${
            isFullscreen 
              ? 'fixed top-0 left-0 w-screen h-screen object-contain z-50 bg-black'
              : 'rounded-lg'
          }`}
        />
        {showFullscreen && (
          <button
            onClick={toggleFullscreen}
            className={`absolute top-2 right-2 p-2 rounded-full
              bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              ${isFullscreen ? 'opacity-100' : ''}`}
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {renderPreview()}
    </div>
  );
};