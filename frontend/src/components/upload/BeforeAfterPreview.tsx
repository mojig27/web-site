import React, { useState, useRef, useEffect } from 'react';
import { FiEye, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

interface BeforeAfterPreviewProps {
  beforeImage: string;
  afterImage: string;
  width?: number;
  height?: number;
}

export const BeforeAfterPreview: React.FC<BeforeAfterPreviewProps> = ({
  beforeImage,
  afterImage,
  width = 600,
  height = 400
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width, height });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all([loadImage(beforeImage), loadImage(afterImage)]).then(
      ([beforeImg, afterImg]) => {
        const aspectRatio = beforeImg.width / beforeImg.height;
        let newWidth = width;
        let newHeight = height;

        if (isFullscreen) {
          newWidth = window.innerWidth;
          newHeight = window.innerHeight;
        }

        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }

        setImageDimensions({ width: newWidth, height: newHeight });
      }
    );
  }, [beforeImage, afterImage, isFullscreen]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div
        ref={containerRef}
        className="relative select-none"
        style={{
          width: imageDimensions.width,
          height: imageDimensions.height,
          margin: isFullscreen ? 'auto' : undefined,
          top: isFullscreen ? '50%' : undefined,
          transform: isFullscreen ? 'translateY(-50%)' : undefined
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute top-0 left-0 object-cover"
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height
            }}
          />
          <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Before
          </div>
        </div>

        {/* After Image */}
        <img
          src={afterImage}
          alt="After"
          className="absolute top-0 left-0 object-cover"
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height
          }}
        />
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          After
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow"></div>
          <div
            className="absolute top-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full bg-white shadow-lg
              flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <FiEye className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 text-white
            hover:bg-black/75 transition-colors"
        >
          {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>

      {/* Info Overlay */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>
          <p>Drag the slider to compare</p>
          <p>Click the fullscreen button to expand</p>
        </div>
        <div className="text-right">
          <p>{(sliderPosition).toFixed(0)}% Original</p>
          <p>{(100 - sliderPosition).toFixed(0)}% Optimized</p>
        </div>
      </div>
    </div>
  );
};