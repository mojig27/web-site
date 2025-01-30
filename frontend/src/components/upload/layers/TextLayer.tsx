import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { SketchPicker } from 'react-color';

interface TextLayerProps {
  id: string;
  initialText?: string;
  onUpdate: (id: string, props: any) => void;
  onDelete: (id: string) => void;
  zIndex: number;
}

export const TextLayer: React.FC<TextLayerProps> = ({
  id,
  initialText = 'Double click to edit',
  onUpdate,
  onDelete,
  zIndex
}) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [style, setStyle] = useState({
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'normal' as const,
    fontStyle: 'normal' as const,
    textAlign: 'center' as const,
    backgroundColor: 'transparent',
    padding: '8px',
    textShadow: 'none'
  });

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onUpdate(id, { text: e.target.value });
  };

  const handleStyleChange = (newStyle: Partial<typeof style>) => {
    const updatedStyle = { ...style, ...newStyle };
    setStyle(updatedStyle);
    onUpdate(id, { style: updatedStyle });
  };

  const handleColorChange = (color: any) => {
    handleStyleChange({ color: color.hex });
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 200,
        height: 'auto'
      }}
      style={{ zIndex }}
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
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full h-full p-2 border-2 border-blue-500 rounded"
            style={style}
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            style={style}
            className="cursor-move select-none break-words"
          >
            {text}
          </div>
        )}

        {/* Text Controls */}
        <div className="absolute -top-10 left-0 hidden group-hover:flex space-x-2 bg-white rounded-lg shadow p-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 rounded hover:bg-gray-100"
            title="Color"
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: style.color }}
            />
          </button>

          <select
            value={style.fontSize}
            onChange={(e) => handleStyleChange({ fontSize: Number(e.target.value) })}
            className="p-1 rounded hover:bg-gray-100"
          >
            {[12, 16, 24, 32, 48, 64].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>

          <select
            value={style.fontFamily}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="p-1 rounded hover:bg-gray-100"
          >
            {['Arial', 'Times New Roman', 'Courier New', 'Georgia'].map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          <button
            onClick={() => handleStyleChange({
              fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold'
            })}
            className={`p-1 rounded hover:bg-gray-100 ${
              style.fontWeight === 'bold' ? 'bg-gray-200' : ''
            }`}
          >
            B
          </button>

          <button
            onClick={() => handleStyleChange({
              fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic'
            })}
            className={`p-1 rounded hover:bg-gray-100 ${
              style.fontStyle === 'italic' ? 'bg-gray-200' : ''
            }`}
          >
            I
          </button>

          <button
            onClick={() => onDelete(id)}
            className="p-1 rounded hover:bg-red-100 text-red-500"
          >
            ×
          </button>
        </div>

        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2">
            <div
              className="fixed inset-0"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="relative">
              <SketchPicker
                color={style.color}
                onChange={handleColorChange}
              />
            </div>
          </div>
        )}
      </div>
    </Rnd>
  );
};