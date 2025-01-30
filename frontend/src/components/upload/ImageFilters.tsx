import React, { useState, useEffect } from 'react';
import { ImageFilterService } from '../../services/image-filters.service';

interface FilterPreviewProps {
  imageSrc: string;
  filter: string;
  onSelect: () => void;
  isSelected: boolean;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({
  imageSrc,
  filter,
  onSelect,
  isSelected
}) => {
  const [previewSrc, setPreviewSrc] = useState<string>(imageSrc);
  const filterService = new ImageFilterService();

  useEffect(() => {
    generatePreview();
  }, [imageSrc, filter]);

  const generatePreview = async () => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    const filtered = await filterService.applyFilter(img, filter);
    setPreviewSrc(filtered);
  };

  return (
    <div
      onClick={onSelect}
      className={`
        cursor-pointer rounded-lg overflow-hidden
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}
      `}
    >
      <div className="relative aspect-square">
        <img
          src={previewSrc}
          alt={filter}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <span className="text-white text-sm font-medium">
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ImageFiltersProps {
  imageSrc: string;
  onFilterApply: (filteredImage: string) => void;
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  imageSrc,
  onFilterApply
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('original');
  const [intensity, setIntensity] = useState<number>(1);
  const filterService = new ImageFilterService();

  const filters = [
    'original',
    'grayscale',
    'sepia',
    'vintage',
    'vibrant',
    'dramatic',
    'cinematic',
    'noir'
  ];

  useEffect(() => {
    applySelectedFilter();
  }, [selectedFilter, intensity]);

  const applySelectedFilter = async () => {
    if (selectedFilter === 'original') {
      onFilterApply(imageSrc);
      return;
    }

    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    
    const filtered = await filterService.applyFilter(
      img,
      selectedFilter,
      intensity
    );
    onFilterApply(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {filters.map((filter) => (
          <FilterPreview
            key={filter}
            imageSrc={imageSrc}
            filter={filter}
            onSelect={() => setSelectedFilter(filter)}
            isSelected={selectedFilter === filter}
          />
        ))}
      </div>

      {selectedFilter !== 'original' && (
        <div className="space-y-2">
          <label className="text-sm text-gray-700">
            Filter Intensity
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};