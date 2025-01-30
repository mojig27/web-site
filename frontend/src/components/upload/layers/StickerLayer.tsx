import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface StickerLayerProps {
  id: string;
  stickerUrl: string;
  onUpdate: (id: string, props: any) => void;
  onDelete: (id: string) => void;
  zIndex: number;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  id,
  stickerUrl,
  onUpdate,
  onDelete,
  zIndex
}) => {
  const [rotation, setRotation] = useState(0);

  const handleRotate = (delta: number) => {
    const newRotation = (rotation + delta) % 360;
    setRotation(newRotation);
    onUpdate(id, { rotation: newRotation });
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }}
      style={{
        zIndex,
        transform: `rotate(${rotation}deg)`
      }}
      onDragStop={(e, d) => {
        onUpdate(id, { position: { x: d.x, y: d.y } });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(id, {
          size: { width: ref.style.width, height: ref.style.height },
          position
        });
      }}
    >
      <div className="relative group">
        <img
          src={stickerUrl}
          alt="sticker"
          className="w-full h-full object-contain"
        />

        {/* Sticker Controls */}
        <div className="absolute -top-10 left-0 hidden group-hover:flex space-x-2 bg-white rounded-lg shadow p-2">
          <button
            onClick={() => handleRotate(-90)}
            className="p-1 rounded hover:bg-gray-100"
            title="Rotate Left"
          >
            ↶
          </button>
          <button
            onClick={() => handleRotate(90)}
            className="p-1 rounded hover:bg-gray-100"
            title="Rotate Right"
          >
            ↷
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1 rounded hover:bg-red-100 text-red-500"
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>
    </Rnd>
  );
};