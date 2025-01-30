import React from 'react';
import {
  FiSun,
  FiContrast,
  FiDroplet,
  FiSliders,
  FiRotateCw,
  FiFlip
} from 'react-icons/fi';
import { Slider } from '@mui/material';

interface ImageControlsProps {
  brightness: number;
  contrast: number;
  saturation: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
}

export const ImageControls: React.FC<ImageControlsProps> = ({
  brightness,
  contrast,
  saturation,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onRotate,
  onFlipHorizontal,
  onFlipVertical
}) => {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <label className="flex items-center text-sm text-gray-700">
          <FiSun className="mr-2" /> Brightness
        </label>
        <Slider
          value={brightness}
          min={-100}
          max={100}
          onChange={(_, value) => onBrightnessChange(value as number)}
          valueLabelDisplay="auto"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm text-gray-700">
          <FiContrast className="mr-2" /> Contrast
        </label>
        <Slider
          value={contrast}
          min={-100}
          max={100}
          onChange={(_, value) => onContrastChange(value as number)}
          valueLabelDisplay="auto"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm text-gray-700">
          <FiDroplet className="mr-2" /> Saturation
        </label>
        <Slider
          value={saturation}
          min={-100}
          max={100}
          onChange={(_, value) => onSaturationChange(value as number)}
          valueLabelDisplay="auto"
        />
      </div>

      <div className="flex justify-around">
        <button
          onClick={onRotate}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Rotate 90°"
        >
          <FiRotateCw className="w-6 h-6" />
        </button>
        <button
          onClick={onFlipHorizontal}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Flip Horizontal"
        >
          <FiSliders className="w-6 h-6 transform rotate-90" />
        </button>
        <button
          onClick={onFlipVertical}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Flip Vertical"
        >
          <FiSliders className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};