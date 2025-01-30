import React, { useState, useEffect } from 'react';
import { ImageOptimizerService } from '../../services/image-optimizer.service';
import {
  FiImage,
  FiDownload,
  FiCheck,
  FiAlertCircle,
  FiSettings
} from 'react-icons/fi';

interface ImageOptimizerProps {
  file: File;
  onOptimized: (optimizedFile: File) => void;
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  file,
  onOptimized
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    maxSizeMB: 1,
    quality: 0.8,
    maxWidthOrHeight: 1920
  });

  const optimizer = new ImageOptimizerService();

  useEffect(() => {
    analyzeImage();
  }, [file]);

  const analyzeImage = async () => {
    const result = await optimizer.analyzeImage(file);
    setAnalysis(result);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizer.optimizeImage(file, customOptions);
      setOptimizationResult(result);
      onOptimized(result.optimizedFile);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {analysis && (
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">Image Analysis</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Format: {analysis.format.toUpperCase()}</p>
                <p>
                  Dimensions: {analysis.dimensions.width}x{analysis.dimensions.height}
                </p>
                <p>Size: {formatSize(analysis.size)}</p>
              </div>
            </div>
          </div>

          {analysis.recommendedOptimizations.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Recommended Optimizations
                  </h3>
                  <ul className="mt-2 text-sm text-yellow-700">
                    {analysis.recommendedOptimizations.map((opt: string) => (
                      <li key={opt}>• {opt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FiSettings className="mr-2" />
              {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
            </button>

            {showAdvancedSettings && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Size (MB)
                  </label>
                  <input
                    type="number"
                    value={customOptions.maxSizeMB}
                    onChange={(e) => setCustomOptions({
                      ...customOptions,
                      maxSizeMB: Number(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quality (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={customOptions.quality}
                    onChange={(e) => setCustomOptions({
                      ...customOptions,
                      quality: Number(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Width/Height (px)
                  </label>
                  <input
                    type="number"
                    value={customOptions.maxWidthOrHeight}
                    onChange={(e) => setCustomOptions({
                      ...customOptions,
                      maxWidthOrHeight: Number(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent
                rounded-md shadow-sm text-sm font-medium text-white
                ${isOptimizing
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Image'}
            </button>
          </div>

          {optimizationResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FiCheck className="h-5 w-5 text-green-400" />
                <span className="ml-2 text-sm font-medium text-green-800">
                  Optimization Complete
                </span>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <p>Original size: {formatSize(optimizationResult.originalSize)}</p>
                <p>Optimized size: {formatSize(optimizationResult.optimizedSize)}</p>
                <p>
                  Compression rate:{' '}
                  {(optimizationResult.compressionRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// در ImageOptimizer.tsx، اضافه کردن state جدید
const [previewUrls, setPreviewUrls] = useState<{
    before: string;
    after: string | null;
  }>({
    before: URL.createObjectURL(file),
    after: null
  });
  
  // آپدیت handleOptimize
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizer.optimizeImage(file, customOptions);
      setOptimizationResult(result);
      setPreviewUrls(prev => ({
        ...prev,
        after: URL.createObjectURL(result.optimizedFile)
      }));
      onOptimized(result.optimizedFile);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // اضافه کردن cleanup
  useEffect(() => {
    return () => {
      if (previewUrls.before) URL.revokeObjectURL(previewUrls.before);
      if (previewUrls.after) URL.revokeObjectURL(previewUrls.after);
    };
  }, []);
  
  // در بخش render، بعد از نمایش نتایج بهینه‌سازی
  {optimizationResult && previewUrls.after && (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Preview Comparison</h3>
      <BeforeAfterPreview
        beforeImage={previewUrls.before}
        afterImage={previewUrls.after}
      />
    </div>
  )}